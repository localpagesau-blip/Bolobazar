from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

import models, schemas, database
from utils.whatsapp import send_whatsapp_order_summary

app = FastAPI(title="BoloBazaar API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to BoloBazaar API"}

# Stores
@app.post("/stores/", response_model=schemas.Store)
def create_store(store: schemas.StoreCreate, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.phone == store.phone).first()
    if db_store:
        return db_store
    new_store = models.Store(**store.dict())
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    return new_store

@app.get("/stores/{phone}", response_model=schemas.Store)
def get_store_by_phone(phone: str, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.phone == phone).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    return db_store

@app.put("/stores/{store_id}", response_model=schemas.Store)
def update_store(store_id: int, store: schemas.StoreCreate, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    for key, value in store.dict().items():
        setattr(db_store, key, value)
    db.commit()
    db.refresh(db_store)
    return db_store

# Inventory
@app.get("/stores/{store_id}/inventory/", response_model=List[schemas.Inventory])
def get_inventory(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Inventory).filter(models.Inventory.store_id == store_id).all()

@app.post("/stores/{store_id}/inventory/", response_model=schemas.Inventory)
def add_inventory_item(store_id: int, item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    new_item = models.Inventory(**item.dict(), store_id=store_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.put("/inventory/{item_id}", response_model=schemas.Inventory)
def update_inventory_item(item_id: int, item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/inventory/{item_id}")
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

# Orders
@app.post("/stores/{store_id}/orders/", response_model=schemas.Order)
def create_order(store_id: int, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(
        store_id=store_id,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        total_amount=order.total_amount,
        status=order.status,
        delivery_time=order.delivery_time
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order.items:
        db_item = models.OrderItem(**item.dict(), order_id=db_order.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)

    # WhatsApp Notification
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if store and store.whatsapp_notifications_enabled and store.whatsapp_number:
        send_whatsapp_order_summary(
            to_number=store.whatsapp_number,
            customer_name=db_order.customer_name or "Valued Customer",
            items=[{"item_name": item.item_name, "quantity": item.quantity} for item in db_order.items],
            total_amount=db_order.total_amount,
            delivery_time=db_order.delivery_time or "As soon as possible"
        )

    return db_order

@app.get("/stores/{store_id}/orders/", response_model=List[schemas.Order])
def get_orders(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.store_id == store_id).all()

@app.patch("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = status
    db.commit()
    return db_order

# Call Logs
@app.post("/stores/{store_id}/calls/", response_model=schemas.CallLog)
def add_call_log(store_id: int, call: schemas.CallLogCreate, db: Session = Depends(get_db)):
    new_call = models.CallLog(**call.dict())
    db.add(new_call)
    db.commit()
    db.refresh(new_call)
    return new_call

@app.get("/stores/{store_id}/calls/", response_model=List[schemas.CallLog])
def get_calls(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.CallLog).filter(models.CallLog.store_id == store_id).all()

# Analytics
@app.get("/stores/{store_id}/stats")
def get_store_stats(store_id: int, db: Session = Depends(get_db)):
    total_orders = db.query(models.Order).filter(models.Order.store_id == store_id).count()
    total_calls = db.query(models.CallLog).filter(models.CallLog.store_id == store_id).count()
    pending_orders = db.query(models.Order).filter(models.Order.store_id == store_id, models.Order.status == 'pending').count()
    
    # Define missed calls as those that didn't result in an order or human handoff
    missed_calls = db.query(models.CallLog).filter(
        models.CallLog.store_id == store_id, 
        ~models.CallLog.outcome.in_(['Order Confirmed', 'Handoff to Human'])
    ).count()
    
    return {
        "total_orders": total_orders,
        "total_calls": total_calls,
        "pending_orders": pending_orders,
        "missed_calls": missed_calls
    }
