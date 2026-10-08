"""
VNQFF-05: Synthetic Data Generator
Owner: Niharika (ML & Data Preprocessing)
Generates realistic digital payment transactions with benign and fraud patterns.
Equipped with zero-dependency CSV generation fallback.
"""
import os
import random
import csv
from datetime import datetime, timedelta

def generate_fraud_dataset(n_samples=2500, save_path=None):
    random.seed(42)
    
    user_ids = [f'U{1000 + i}' for i in range(50)]
    locations = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata']
    device_pools = [f'DEV{100 + i}' for i in range(120)]
    beneficiary_pools = [f'B{200 + i}' for i in range(80)]
    txn_types = ['UPI', 'IMPS', 'NEFT', 'CREDIT_CARD', 'WALLET']
    
    fieldnames = [
        'transaction_id', 'user_id', 'amount', 'device_id', 'beneficiary_id',
        'location', 'transaction_type', 'timestamp', 'velocity_5m',
        'device_trust', 'beneficiary_trust', 'loc_distance_km',
        'behaviour_z_score', 'is_fraud'
    ]
    
    rows = []
    base_time = datetime.now() - timedelta(days=30)
    
    for i in range(n_samples):
        is_fraud = 1 if random.random() < 0.15 else 0
        u_id = random.choice(user_ids)
        
        if is_fraud:
            amount = random.choice([
                random.uniform(45000, 150000),
                random.uniform(1.0, 10.0)
            ])
            loc = random.choice(['Dubai', 'Lagos', 'London', 'Moscow', 'Unknown_IP']) if random.random() < 0.4 else random.choice(locations)
            dev = f"DEV_ROGUE_{random.randint(900, 999)}" if random.random() < 0.65 else random.choice(device_pools)
            ben = f"B_MULE_{random.randint(500, 550)}" if random.random() < 0.7 else random.choice(beneficiary_pools)
            velocity_5m = random.randint(4, 15)
            device_trust = random.uniform(5.0, 35.0)
            ben_trust = random.uniform(10.0, 40.0)
            loc_distance_km = random.uniform(800.0, 6000.0)
            behaviour_z_score = random.uniform(2.5, 6.0)
        else:
            amount = random.expovariate(1.0 / 3500) + 150
            loc = random.choice(locations[:3])
            dev = random.choice(device_pools[:30])
            ben = random.choice(beneficiary_pools[:25])
            velocity_5m = random.choice([0, 1, 1, 2])
            device_trust = random.uniform(75.0, 99.0)
            ben_trust = random.uniform(80.0, 98.0)
            loc_distance_km = random.uniform(0.0, 45.0)
            behaviour_z_score = random.uniform(0.1, 1.4)
            
        txn_id = f"TXN{100000 + i}"
        txn_time = base_time + timedelta(minutes=int(i * 15 + random.randint(1, 10)))
        
        rows.append({
            'transaction_id': txn_id,
            'user_id': u_id,
            'amount': round(amount, 2),
            'device_id': dev,
            'beneficiary_id': ben,
            'location': loc,
            'transaction_type': random.choice(txn_types),
            'timestamp': txn_time.strftime('%Y-%m-%d %H:%M:%S'),
            'velocity_5m': velocity_5m,
            'device_trust': round(device_trust, 2),
            'beneficiary_trust': round(ben_trust, 2),
            'loc_distance_km': round(loc_distance_km, 2),
            'behaviour_z_score': round(behaviour_z_score, 3),
            'is_fraud': is_fraud
        })
        
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"Generated dataset with {len(rows)} records saved to {save_path}")
    return rows

if __name__ == '__main__':
    default_path = os.path.join(os.path.dirname(__file__), 'fraud_dataset.csv')
    generate_fraud_dataset(save_path=default_path)
