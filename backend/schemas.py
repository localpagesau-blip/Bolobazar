from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InventoryBase(BaseModel):
    item_name: str
    price: float
    unit: str
    stock_count: float = 0
    is_available: bool = True

class InventoryCreate(InventoryBase):
    pass

class Inventory(InventoryBase):
    id: int
    store_id: int

    class Config:
        orm_mode = True

class OrderItemBase(BaseModel):
    item_name: str
    quantity: float
    price_at_order: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: str
    total_amount: Optional[float] = None
    status: str = "pending"
    delivery_time: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    store_id: int
    created_at: datetime
    items: List[OrderItem]

    class Config:
        orm_mode = True

class StoreBase(BaseModel):
    name: str
    phone: str
    owner_name: Optional[str] = None
    address: Optional[str] = None
    language_preference: str = "en"
    subscription_tier: str = "starter"
    whatsapp_notifications_enabled: bool = False
    whatsapp_number: Optional[str] = None

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class CallLogBase(BaseModel):
    customer_phone: str
    duration: Optional[int] = None
    outcome: Optional[str] = None
    transcript: Optional[str] = None
    recording_url: Optional[str] = None

class CallLogCreate(CallLogBase):
    store_id: int

class CallLog(CallLogBase):
    id: int
    store_id: int
    timestamp: datetime

    class Config:
        orm_mode = True
