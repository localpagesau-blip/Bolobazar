from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    owner_name = Column(String)
    address = Column(String)
    language_preference = Column(String, default="en")
    subscription_tier = Column(String, default="starter")
    whatsapp_notifications_enabled = Column(Boolean, default=False)
    whatsapp_number = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("Inventory", back_populates="store")
    orders = relationship("Order", back_populates="store")
    calls = relationship("CallLog", back_populates="store")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    item_name = Column(String, index=True)
    price = Column(Float)
    unit = Column(String)
    stock_count = Column(Float, default=0)
    is_available = Column(Boolean, default=True)

    store = relationship("Store", back_populates="items")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    customer_name = Column(String)
    customer_phone = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="pending")
    delivery_time = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    store = relationship("Store", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    item_name = Column(String)
    quantity = Column(Float)
    price_at_order = Column(Float)

    order = relationship("Order", back_populates="items")

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    customer_phone = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    duration = Column(Integer)
    outcome = Column(String)
    transcript = Column(String)
    recording_url = Column(String)

    store = relationship("Store", back_populates="calls")
