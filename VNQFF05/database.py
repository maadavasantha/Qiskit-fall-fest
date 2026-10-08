"""
VNQFF-05: Database Module
Owner: Vasantha (Backend Foundation & Database)
Description: SQLite initialization, schema definition, and transaction storage.
"""
import sqlite3
import os
from datetime import datetime
from config import Config

def get_db_connection():
    os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            avg_amount REAL DEFAULT 5000.0,
            std_amount REAL DEFAULT 2500.0,
            frequent_location TEXT DEFAULT 'Hyderabad',
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Devices table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS devices (
            device_id TEXT PRIMARY KEY,
            user_id TEXT,
            device_model TEXT,
            is_trusted INTEGER DEFAULT 1,
            first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    ''')
    
    # Beneficiaries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS beneficiaries (
            beneficiary_id TEXT PRIMARY KEY,
            account_name TEXT NOT NULL,
            bank_code TEXT DEFAULT 'SBIN',
            trust_score REAL DEFAULT 85.0,
            is_flagged INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            beneficiary_id TEXT NOT NULL,
            device_id TEXT NOT NULL,
            location TEXT NOT NULL,
            transaction_type TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'PROCESSED',
            risk_score REAL,
            risk_level TEXT,
            decision TEXT,
            classical_prob REAL,
            quantum_prob REAL,
            hybrid_prob REAL,
            explanation TEXT,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    ''')
    
    # Fraud Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fraud_alerts (
            alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT NOT NULL,
            risk_score REAL NOT NULL,
            severity TEXT NOT NULL,
            decision TEXT NOT NULL,
            dna_pattern TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'OPEN',
            FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id)
        )
    ''')
    
    # Pre-seed default test users if empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (user_id, username, avg_amount, std_amount, frequent_location) VALUES ('U1001', 'Aditya Sharma', 12000.0, 4500.0, 'Hyderabad')")
        cursor.execute("INSERT INTO users (user_id, username, avg_amount, std_amount, frequent_location) VALUES ('U1002', 'Priya Rao', 6500.0, 2000.0, 'Bengaluru')")
        cursor.execute("INSERT INTO users (user_id, username, avg_amount, std_amount, frequent_location) VALUES ('U1003', 'Rahul Verma', 45000.0, 15000.0, 'Mumbai')")
        
        cursor.execute("INSERT INTO devices (device_id, user_id, device_model, is_trusted) VALUES ('DEV901', 'U1001', 'Pixel 8 Pro', 1)")
        cursor.execute("INSERT INTO devices (device_id, user_id, device_model, is_trusted) VALUES ('DEV902', 'U1002', 'iPhone 15', 1)")
        
        cursor.execute("INSERT INTO beneficiaries (beneficiary_id, account_name, trust_score, is_flagged) VALUES ('B201', 'Swiggy Merchant', 98.0, 0)")
        cursor.execute("INSERT INTO beneficiaries (beneficiary_id, account_name, trust_score, is_flagged) VALUES ('B204', 'Crypto P2P Merchant', 22.0, 1)")
        cursor.execute("INSERT INTO beneficiaries (beneficiary_id, account_name, trust_score, is_flagged) VALUES ('B305', 'Mule Relay Account', 15.0, 1)")

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", Config.DATABASE_PATH)

if __name__ == '__main__':
    init_db()
