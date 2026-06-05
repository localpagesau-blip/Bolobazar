import sqlite3
import os

DB_PATH = "/home/team/shared/backend/bolobazaar.db"

def seed_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Seed a store
    cursor.execute('''
    INSERT OR IGNORE INTO stores (name, phone, owner_name, address, language_preference, subscription_tier, whatsapp_notifications_enabled, whatsapp_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("Ramesh Kirana Store", "9876543210", "Ramesh Kumar", "123, MG Road, Bangalore", "hi", "pro", 1, "+919876543210"))

    store_id = cursor.execute("SELECT id FROM stores WHERE phone = '9876543210'").fetchone()[0]

    # Seed inventory
    items = [
        (store_id, "Milk", 30.0, "liter", 50, True),
        (store_id, "Bread", 40.0, "packet", 20, True),
        (store_id, "Eggs", 60.0, "dozen", 10, True),
        (store_id, "Sugar", 45.0, "kg", 100, True),
        (store_id, "Rice", 60.0, "kg", 200, True),
    ]

    cursor.executemany('''
    INSERT OR IGNORE INTO inventory (store_id, item_name, price, unit, stock_count, is_available)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', items)

    conn.commit()
    conn.close()
    print("Seed data inserted.")

if __name__ == "__main__":
    seed_data()
