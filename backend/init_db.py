import sqlite3
import os

DB_PATH = "/home/team/shared/backend/bolobazaar.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Stores table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        owner_name TEXT,
        address TEXT,
        language_preference TEXT DEFAULT 'en',
        subscription_tier TEXT DEFAULT 'starter',
        whatsapp_notifications_enabled BOOLEAN DEFAULT 0,
        whatsapp_number TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Inventory table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        stock_count REAL DEFAULT 0,
        is_available BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (store_id) REFERENCES stores (id)
    )
    ''')

    # Orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER NOT NULL,
        customer_name TEXT,
        customer_phone TEXT NOT NULL,
        total_amount REAL,
        status TEXT DEFAULT 'pending',
        delivery_time TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
    )
    ''')

    # Order Items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        price_at_order REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id)
    )
    ''')

    # Call Logs table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS call_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER NOT NULL,
        customer_phone TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        duration INTEGER,
        outcome TEXT,
        transcript TEXT,
        recording_url TEXT,
        FOREIGN KEY (store_id) REFERENCES stores (id)
    )
    ''')

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
