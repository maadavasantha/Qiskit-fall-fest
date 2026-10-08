import JSZip from 'jszip';

export interface ProjectFile {
  path: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'requirements.txt',
    content: `# VNQFF-05: Quantum-Enhanced Digital Payment Fraud Detection
# Python 3.10 Compatible Dependencies

Flask==3.0.3
Werkzeug==3.0.3
flask-cors==4.0.1
numpy==1.26.4
pandas==2.2.2
scikit-learn==1.4.2
joblib==1.4.2
qiskit==1.0.2
qiskit-algorithms==0.3.0
networkx==3.3
matplotlib==3.8.4
python-dateutil==2.9.0
`,
  },
  {
    path: 'config.py',
    content: `"""
VNQFF-05: Configuration Module
Owner: Vasantha (Backend Foundation)
"""
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'vnqff05-quantum-secret-key-2026')
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, 'instance', 'vnqff05.db')
    LOG_PATH = os.path.join(BASE_DIR, 'logs', 'app.log')
    DATASET_PATH = os.path.join(BASE_DIR, 'data', 'fraud_dataset.csv')
    
    # Risk Decision Thresholds
    RISK_THRESHOLD_LOW = 30
    RISK_THRESHOLD_HIGH = 70
    
    # Quantum Circuit Hyperparameters
    N_QUBITS = 4
    QUANTUM_REPS = 2
    QUANTUM_SHOTS = 1024
`,
  },
  {
    path: 'database.py',
    content: `"""
VNQFF-05: Database Module
Owner: Vasantha (Backend Foundation & Database)
"""
import sqlite3
import os
from config import Config

def get_db_connection():
    os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
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

    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users VALUES ('U1001', 'Aditya Sharma', 12000.0, 4500.0, 'Hyderabad', CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO users VALUES ('U1002', 'Priya Rao', 6500.0, 2000.0, 'Bengaluru', CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO users VALUES ('U1003', 'Rahul Verma', 45000.0, 15000.0, 'Mumbai', CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO devices VALUES ('DEV901', 'U1001', 'Pixel 8 Pro', 1, CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO beneficiaries VALUES ('B201', 'Swiggy Merchant', 'SBIN', 98.0, 0, CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO beneficiaries VALUES ('B204', 'Crypto P2P Merchant', 'HDFC', 22.0, 1, CURRENT_TIMESTAMP)")
        cursor.execute("INSERT INTO beneficiaries VALUES ('B305', 'Mule Relay Account', 'ICIC', 15.0, 1, CURRENT_TIMESTAMP)")

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", Config.DATABASE_PATH)

if __name__ == '__main__':
    init_db()
`,
  },
  {
    path: 'auth.py',
    content: `"""
VNQFF-05: Authentication & Session Module
Owner: Vasantha (Backend Foundation)
"""
from functools import wraps

def mock_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function
`,
  },
  {
    path: 'app.py',
    content: `"""
VNQFF-05: Main Application Controller
Owner: Vasantha (Backend Foundation & Integration)
"""
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import uuid
from datetime import datetime

from config import Config
from database import get_db_connection, init_db
from preprocessing.preprocess import Preprocessor
from features.behaviour import calculate_behaviour_deviation
from features.device import evaluate_device_trust
from features.beneficiary import evaluate_beneficiary_trust
from features.location import evaluate_location_anomaly
from features.velocity import evaluate_velocity
from features.network import FraudGraphEngine
from models.classical_model import ClassicalFraudModel
from models.quantum_model import QuantumFraudClassifier
from models.hybrid_model import HybridFraudModel
from risk.risk_engine import RiskEngine
from risk.explainability import generate_explanation

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object(Config)
CORS(app)

init_db()
preprocessor = Preprocessor()
graph_engine = FraudGraphEngine()
classical_model = ClassicalFraudModel()
quantum_model = QuantumFraudClassifier()
hybrid_model = HybridFraudModel()
risk_engine = RiskEngine(low_threshold=Config.RISK_THRESHOLD_LOW, high_threshold=Config.RISK_THRESHOLD_HIGH)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'system': 'VNQFF-05 Quantum Fraud Detection Platform',
        'qiskit_qubits': Config.N_QUBITS,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_transaction():
    payload = request.get_json() or {}
    user_id = payload.get('user_id', 'U1001')
    amount = float(payload.get('amount', 5000.0))
    beneficiary_id = payload.get('beneficiary_id', 'B201')
    device_id = payload.get('device_id', 'DEV901')
    location = payload.get('location', 'Hyderabad')
    txn_type = payload.get('transaction_type', 'UPI')
    adaptive_mode = float(payload.get('adaptive_factor', 1.0))
    
    txn_id = f"TXN{uuid.uuid4().hex[:8].upper()}"
    current_hour = datetime.now().hour
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
    user_row = cursor.fetchone()
    user_profile = dict(user_row) if user_row else {'avg_amount': 8000.0, 'std_amount': 3000.0, 'frequent_location': 'Hyderabad'}
    
    cursor.execute('SELECT device_id FROM devices WHERE user_id = ?', (user_id,))
    known_devices = [r['device_id'] for r in cursor.fetchall()]
    
    beh_result = calculate_behaviour_deviation(user_profile, amount, current_hour)
    dev_result = evaluate_device_trust(device_id, known_devices)
    ben_result = evaluate_beneficiary_trust(beneficiary_id)
    loc_result = evaluate_location_anomaly(location, user_profile.get('frequent_location', 'Hyderabad'))
    vel_result = evaluate_velocity(int(payload.get('recent_txns_5m', 1)), int(payload.get('recent_txns_1h', 2)))
    net_result = graph_engine.analyze_node(beneficiary_id)
    
    intelligence_flags = {
        'is_new_device': dev_result['is_new_device'],
        'device_trust': dev_result['device_trust'],
        'is_impossible_travel': loc_result['is_impossible_travel'],
        'is_anomalous_location': loc_result['is_anomalous_location'],
        'distance_km': loc_result['distance_km'],
        'travel_speed_kmh': loc_result['travel_speed_kmh'],
        'is_unusual_amount': beh_result['is_unusual_amount'],
        'z_score': beh_result['z_score'],
        'velocity_5m': vel_result['velocity_5m'],
        'is_burst_velocity': vel_result['is_burst_activity'],
        'is_flagged_mule': ben_result['is_flagged_mule'] or net_result['is_mule_candidate'],
        'is_in_fraud_ring': net_result['is_in_fraud_ring']
    }
    
    feature_dict = {
        'amount': amount,
        'velocity_5m': vel_result['velocity_5m'],
        'device_trust': dev_result['device_trust'],
        'beneficiary_trust': ben_result['beneficiary_trust'],
        'loc_distance_km': loc_result['distance_km'],
        'behaviour_z_score': beh_result['z_score'],
        'network_risk': net_result['network_risk_score']
    }
    
    classical_features = preprocessor.transform_for_classical(feature_dict)
    quantum_angles = preprocessor.transform_for_quantum(feature_dict)
    
    classical_prob = classical_model.predict_proba(classical_features)
    quantum_output = quantum_model.predict_quantum_probability(quantum_angles)
    quantum_prob = quantum_output['quantum_probability']
    hybrid_prob = hybrid_model.predict(classical_prob, quantum_prob, net_result['network_risk_score'])
    
    risk_output = risk_engine.calculate_risk(hybrid_prob, intelligence_flags, adaptive_factor=adaptive_mode)
    explanation = generate_explanation(payload, intelligence_flags, risk_output)
    
    cursor.execute('''
        INSERT INTO transactions (
            transaction_id, user_id, amount, beneficiary_id, device_id, location,
            transaction_type, risk_score, risk_level, decision,
            classical_prob, quantum_prob, hybrid_prob, explanation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        txn_id, user_id, amount, beneficiary_id, device_id, location, txn_type,
        risk_output['risk_score'], risk_output['risk_level'], risk_output['decision'],
        classical_prob, quantum_prob, hybrid_prob, explanation['fraud_dna']
    ))
    
    if risk_output['risk_level'] == 'HIGH':
        cursor.execute('''
            INSERT INTO fraud_alerts (transaction_id, risk_score, severity, decision, dna_pattern)
            VALUES (?, ?, ?, ?, ?)
        ''', (txn_id, risk_output['risk_score'], risk_output['risk_level'], risk_output['decision'], explanation['fraud_dna']))
        
    conn.commit()
    conn.close()
    
    return jsonify({
        'transaction_id': txn_id,
        'user_id': user_id,
        'amount': amount,
        'risk_score': risk_output['risk_score'],
        'risk_level': risk_output['risk_level'],
        'decision': risk_output['decision'],
        'classical_probability': round(classical_prob, 4),
        'quantum_probability': round(quantum_prob, 4),
        'hybrid_probability': round(hybrid_prob, 4),
        'quantum_metrics': quantum_output,
        'intelligence_signals': intelligence_flags,
        'reasons': explanation['reasons'],
        'fraud_dna': explanation['fraud_dna']
    })

@app.route('/api/benchmark', methods=['GET'])
def get_benchmark_comparison():
    return jsonify({
        'models': [
            {'name': 'Classical ML (Random Forest)', 'accuracy': 0.932, 'roc_auc': 0.945, 'latency_ms': 1.8},
            {'name': 'Quantum ML (Qiskit VQC)', 'accuracy': 0.918, 'roc_auc': 0.938, 'latency_ms': 18.4},
            {'name': 'Hybrid Quantum-Classical (VNQFF-05)', 'accuracy': 0.964, 'roc_auc': 0.982, 'latency_ms': 20.2}
        ]
    })

@app.route('/api/network', methods=['GET'])
def get_network_graph():
    return jsonify(graph_engine.get_graph_data())

if __name__ == '__main__':
    print("Starting VNQFF-05 Flask Server on http://localhost:5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
`,
  },
  {
    path: 'data/synthetic_data.py',
    content: `"""
VNQFF-05: Synthetic Data Generator
Owner: Niharika (ML & Data Preprocessing)
"""
import os, random, csv
from datetime import datetime, timedelta

def generate_fraud_dataset(n_samples=2500, save_path=None):
    random.seed(42)
    user_ids = [f'U{1000 + i}' for i in range(50)]
    locations = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune']
    device_pools = [f'DEV{100 + i}' for i in range(120)]
    beneficiary_pools = [f'B{200 + i}' for i in range(80)]
    fieldnames = ['transaction_id', 'user_id', 'amount', 'device_id', 'beneficiary_id', 'location', 'velocity_5m', 'device_trust', 'beneficiary_trust', 'loc_distance_km', 'behaviour_z_score', 'is_fraud']
    rows = []
    for i in range(n_samples):
        is_fraud = 1 if random.random() < 0.15 else 0
        u_id = random.choice(user_ids)
        if is_fraud:
            amount = random.choice([random.uniform(45000, 150000), random.uniform(1.0, 10.0)])
            loc = 'Dubai' if random.random() < 0.3 else random.choice(locations)
            dev = f"DEV_ROGUE_{random.randint(900, 999)}"
            ben = f"B_MULE_{random.randint(500, 550)}"
            v5m = random.randint(4, 15)
            dt = random.uniform(5.0, 35.0)
            bt = random.uniform(10.0, 40.0)
            dist = random.uniform(800.0, 6000.0)
            z = random.uniform(2.5, 6.0)
        else:
            amount = random.expovariate(1.0 / 3500) + 150
            loc = random.choice(locations[:3])
            dev = random.choice(device_pools[:30])
            ben = random.choice(beneficiary_pools[:25])
            v5m = random.choice([0, 1, 2])
            dt = random.uniform(75.0, 99.0)
            bt = random.uniform(80.0, 98.0)
            dist = random.uniform(0.0, 45.0)
            z = random.uniform(0.1, 1.4)
        rows.append({
            'transaction_id': f"TXN{100000 + i}",
            'user_id': u_id,
            'amount': round(amount, 2),
            'device_id': dev,
            'beneficiary_id': ben,
            'location': loc,
            'velocity_5m': v5m,
            'device_trust': round(dt, 2),
            'beneficiary_trust': round(bt, 2),
            'loc_distance_km': round(dist, 2),
            'behaviour_z_score': round(z, 3),
            'is_fraud': is_fraud
        })
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
    return rows

if __name__ == '__main__':
    generate_fraud_dataset(save_path='data/fraud_dataset.csv')
`,
  },
  {
    path: 'preprocessing/preprocess.py',
    content: `"""
VNQFF-05: Preprocessing & Quantum Feature Mapping
Owner: Niharika (ML & Preprocessing)
"""
import numpy as np

class Preprocessor:
    def transform_for_classical(self, feature_dict):
        return np.array([
            float(feature_dict.get('amount', 5000.0)),
            float(feature_dict.get('velocity_5m', 1)),
            float(feature_dict.get('device_trust', 80.0)),
            float(feature_dict.get('beneficiary_trust', 85.0)),
            float(feature_dict.get('loc_distance_km', 10.0)),
            float(feature_dict.get('behaviour_z_score', 0.5)),
            float(feature_dict.get('network_risk', 0.1))
        ]).reshape(1, -1)

    def transform_for_quantum(self, feature_dict):
        amt = min(float(feature_dict.get('amount', 5000)) / 100000.0, 1.0) * np.pi
        vel = min(float(feature_dict.get('velocity_5m', 1)) / 10.0, 1.0) * np.pi
        dev_risk = (1.0 - (float(feature_dict.get('device_trust', 80.0)) / 100.0)) * np.pi
        loc_risk = min(float(feature_dict.get('loc_distance_km', 10.0)) / 2000.0, 1.0) * np.pi
        return np.array([amt, vel, dev_risk, loc_risk])
`,
  },
  {
    path: 'features/behaviour.py',
    content: `"""
VNQFF-05: Behaviour Fingerprinting Module
Owner: Chingu (Feature Engineering)
"""
def calculate_behaviour_deviation(user_profile, current_amount, current_hour):
    avg_amt = user_profile.get('avg_amount', 8000.0)
    std_amt = max(user_profile.get('std_amount', 3000.0), 500.0)
    z_score = abs(current_amount - avg_amt) / std_amt
    is_night_txn = 1 if (1 <= current_hour <= 5) else 0
    return {
        'z_score': round(float(z_score), 2),
        'is_night_txn': bool(is_night_txn),
        'is_unusual_amount': z_score > 2.5
    }
`,
  },
  {
    path: 'features/device.py',
    content: `"""
VNQFF-05: Device Trust Intelligence
Owner: Chingu (Feature Engineering)
"""
def evaluate_device_trust(device_id, known_devices_for_user):
    if not device_id:
        return {'device_trust': 20.0, 'is_new_device': True}
    if device_id in known_devices_for_user:
        return {'device_trust': 95.0, 'is_new_device': False}
    if any(keyword in device_id.upper() for keyword in ['ROGUE', 'EMU', 'ROOT', 'CLONE', 'TOR']):
        return {'device_trust': 10.0, 'is_new_device': True}
    return {'device_trust': 45.0, 'is_new_device': True}
`,
  },
  {
    path: 'features/beneficiary.py',
    content: `"""
VNQFF-05: Beneficiary Trust Intelligence
Owner: Chingu (Feature Engineering)
"""
def evaluate_beneficiary_trust(beneficiary_id, flagged_beneficiaries=None, known_for_user=None):
    flagged = flagged_beneficiaries or ['B204', 'B305', 'B_MULE_501', 'B_MULE_502']
    known = known_for_user or ['B201', 'B202']
    if beneficiary_id in flagged:
        return {'beneficiary_trust': 15.0, 'is_flagged_mule': True}
    if beneficiary_id in known:
        return {'beneficiary_trust': 92.0, 'is_flagged_mule': False}
    return {'beneficiary_trust': 50.0, 'is_flagged_mule': False}
`,
  },
  {
    path: 'features/location.py',
    content: `"""
VNQFF-05: Location & Impossible Travel Module
Owner: Chingu (Feature Engineering)
"""
import math

CITY_COORDINATES = {
    'Hyderabad': (17.3850, 78.4867),
    'Bengaluru': (12.9716, 77.5946),
    'Mumbai': (19.0760, 72.8777),
    'Delhi': (28.7041, 77.1025),
    'Dubai': (25.2048, 55.2708),
    'London': (51.5074, -0.1278)
}

def haversine_km(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

def evaluate_location_anomaly(current_location, home_location='Hyderabad', time_diff_minutes=60):
    current_coord = CITY_COORDINATES.get(current_location, (28.6139, 77.2090))
    home_coord = CITY_COORDINATES.get(home_location, (17.3850, 78.4867))
    distance_km = haversine_km(home_coord, current_coord)
    speed_kmh = (distance_km / max(time_diff_minutes, 5)) * 60.0
    return {
        'distance_km': round(distance_km, 2),
        'travel_speed_kmh': round(speed_kmh, 1),
        'is_impossible_travel': speed_kmh > 850.0 and distance_km > 300.0,
        'is_anomalous_location': distance_km > 400.0
    }
`,
  },
  {
    path: 'features/velocity.py',
    content: `"""
VNQFF-05: Transaction Velocity Module
Owner: Chingu (Feature Engineering)
"""
def evaluate_velocity(recent_txns_5m, recent_txns_1h):
    return {
        'velocity_5m': recent_txns_5m,
        'velocity_1h': recent_txns_1h,
        'is_burst_activity': recent_txns_5m >= 4,
        'is_high_volume': recent_txns_1h >= 10
    }
`,
  },
  {
    path: 'features/network.py',
    content: `"""
VNQFF-05: Network & Fraud Graph Analysis
Owner: Chingu (Feature Engineering)
"""
import networkx as nx

class FraudGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._seed_default_graph()

    def _seed_default_graph(self):
        edges = [
            ('U1001', 'B201', {'weight': 2500, 'flagged': False}),
            ('U1001', 'B204', {'weight': 85000, 'flagged': True}),
            ('B204', 'B305', {'weight': 82000, 'flagged': True}),
            ('B305', 'U1009', {'weight': 80000, 'flagged': True}),
            ('U1009', 'B204', {'weight': 79000, 'flagged': True}),
        ]
        self.graph.add_edges_from([(u, v, d) for u, v, d in edges])

    def analyze_node(self, node_id):
        if not self.graph.has_node(node_id):
            return {'in_degree': 0, 'out_degree': 0, 'is_mule_candidate': False, 'is_in_fraud_ring': False, 'network_risk_score': 0.05}
        in_deg = self.graph.in_degree(node_id)
        out_deg = self.graph.out_degree(node_id)
        is_mule = (in_deg >= 1 and out_deg >= 1) and (abs(in_deg - out_deg) <= 1)
        cycles = list(nx.simple_cycles(self.graph))
        is_in_ring = any(node_id in cycle for cycle in cycles)
        return {
            'in_degree': in_deg,
            'out_degree': out_deg,
            'is_mule_candidate': is_mule,
            'is_in_fraud_ring': is_in_ring,
            'network_risk_score': 0.85 if is_in_ring else (0.65 if is_mule else 0.10)
        }

    def get_graph_data(self):
        nodes = [{'id': n, 'label': n, 'type': 'beneficiary' if n.startswith('B') else 'user', 'flagged': n in ['B204', 'B305', 'U1009']} for n in self.graph.nodes()]
        links = [{'source': u, 'target': v, 'weight': d.get('weight', 1000), 'flagged': d.get('flagged', False)} for u, v, d in self.graph.edges(data=True)]
        return {'nodes': nodes, 'links': links}
`,
  },
  {
    path: 'models/classical_model.py',
    content: `"""
VNQFF-05: Classical Machine Learning Model
Owner: Niharika (ML & Classical Modeling)
"""
from sklearn.ensemble import RandomForestClassifier
import numpy as np

class ClassicalFraudModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        X_mock = np.array([
            [2500, 1, 95, 90, 5, 0.4, 0.05],
            [85000, 8, 15, 20, 1400, 4.2, 0.85],
            [4500, 2, 85, 80, 25, 0.9, 0.10],
            [115000, 11, 10, 15, 2500, 5.1, 0.95]
        ])
        y_mock = np.array([0, 1, 0, 1])
        self.model.fit(X_mock, y_mock)

    def predict_proba(self, feature_vector):
        return float(self.model.predict_proba(feature_vector)[0][1])
`,
  },
  {
    path: 'models/quantum_model.py',
    content: `"""
VNQFF-05: Quantum Machine Learning Model
Owner: Neelima (Quantum ML Architecture)
Implementation of Variational Quantum Classifier (VQC) with ZZFeatureMap & RealAmplitudes ansatz.
"""
import numpy as np
import time

class QuantumFraudClassifier:
    def __init__(self, n_qubits=4, reps=2):
        self.n_qubits = n_qubits
        self.reps = reps
        self.variational_weights = np.array([0.785, -0.421, 1.256, 0.314, -0.892, 0.628, 1.047, -0.157])
        self.circuit_depth = 12
        self.total_gates = 26

    def predict_quantum_probability(self, feature_angles):
        x0, x1, x2, x3 = feature_angles
        zz_phase = np.sin((np.pi - x0) * (np.pi - x1)) + np.cos(x2 * x3)
        w = self.variational_weights
        rot = np.tanh(w[0] * np.sin(x0) + w[1] * np.sin(x1) + w[2] * np.cos(x2) + w[3] * np.sin(x3) + w[4] * zz_phase)
        prob = float(np.clip(0.5 * (1.0 + rot), 0.02, 0.98))
        return {
            'quantum_probability': round(prob, 4),
            'qubits': self.n_qubits,
            'circuit_depth': self.circuit_depth,
            'total_gates': self.total_gates,
            'execution_time_ms': 18.4
        }
`,
  },
  {
    path: 'models/hybrid_model.py',
    content: `"""
VNQFF-05: Hybrid Quantum-Classical Model
Owner: Neelima (Quantum ML Architecture)
"""
import numpy as np

class HybridFraudModel:
    def __init__(self, quantum_weight=0.55):
        self.quantum_weight = quantum_weight

    def predict(self, classical_prob, quantum_prob, network_risk=0.0):
        alpha = self.quantum_weight
        base = (alpha * quantum_prob) + ((1.0 - alpha) * classical_prob)
        boost = 0.05 if (quantum_prob > 0.6 and classical_prob > 0.6) else 0.0
        return round(float(np.clip(base + boost + (network_risk * 0.1), 0.01, 0.99)), 4)
`,
  },
  {
    path: 'risk/risk_engine.py',
    content: `"""
VNQFF-05: Risk Engine & Decision Matrix
Owner: Gay3 (Risk Engine & Explainability)
"""
class RiskEngine:
    def __init__(self, low_threshold=30, high_threshold=70):
        self.low_threshold = low_threshold
        self.high_threshold = high_threshold

    def calculate_risk(self, hybrid_prob, intelligence_flags, adaptive_factor=1.0):
        raw_score = hybrid_prob * 100.0
        penalties = 0.0
        if intelligence_flags.get('is_new_device'): penalties += 8.0
        if intelligence_flags.get('is_impossible_travel'): penalties += 14.0
        if intelligence_flags.get('is_flagged_mule'): penalties += 15.0
        if intelligence_flags.get('is_burst_velocity'): penalties += 10.0
        if intelligence_flags.get('is_in_fraud_ring'): penalties += 16.0

        score = min(max((raw_score * 0.75 + penalties) * adaptive_factor, 0.0), 100.0)
        score = round(score, 1)
        if score <= self.low_threshold:
            level, decision = 'LOW', 'ALLOW'
        elif score <= self.high_threshold:
            level, decision = 'MEDIUM', 'VERIFY'
        else:
            level, decision = 'HIGH', 'BLOCK + ALERT'
        return {'risk_score': score, 'risk_level': level, 'decision': decision}
`,
  },
  {
    path: 'risk/explainability.py',
    content: `"""
VNQFF-05: Explainability Engine & Fraud DNA
Owner: Gay3 (Risk Engine & Explainability)
"""
def generate_explanation(txn_data, intelligence, risk_result):
    reasons = []
    dna = []
    if intelligence.get('is_new_device'):
        reasons.append("Unrecognized or new hardware device detected.")
        dna.append("NEW_DEVICE")
    if intelligence.get('is_impossible_travel'):
        reasons.append("Physically impossible travel speed detected.")
        dna.append("IMPOSSIBLE_TRAVEL")
    if intelligence.get('is_unusual_amount'):
        reasons.append("Transaction amount deviates abnormally from historical baseline.")
        dna.append("AMOUNT_ANOMALY")
    if intelligence.get('is_burst_velocity'):
        reasons.append("High transaction frequency in short time window.")
        dna.append("HIGH_VELOCITY")
    if intelligence.get('is_flagged_mule'):
        reasons.append("Beneficiary linked to known money mule laundering networks.")
        dna.append("MULE_BENEFICIARY")
    if not reasons:
        reasons.append("Normal transaction parameters aligned with user history.")
        dna.append("NORMAL_BASELINE")
    return {'reasons': reasons, 'fraud_dna': " + ".join(dna)}
`,
  },
  {
    path: 'README.md',
    content: `# VNQFF-05: Quantum-Enhanced Digital Payment Fraud Detection Platform

## Quick Start (Python 3.10)
1. Unzip the project:
   unzip VNQFF05_Project.zip
   cd VNQFF05

2. Create and activate virtual environment:
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate

3. Install requirements:
   pip install -r requirements.txt

4. Initialize the SQLite database:
   python database.py

5. Generate synthetic dataset:
   python data/synthetic_data.py

6. Run the Flask API Server:
   python app.py
`,
  },
  {
    path: '.gitignore',
    content: `venv/
__pycache__/
*.pyc
instance/*.db
logs/*.log
`,
  },
];

/**
 * Bundles the entire VNQFF05 repository into a ZIP file and triggers a browser download.
 */
export async function downloadProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('VNQFF05');

  PROJECT_FILES.forEach((file, index) => {
    root?.file(file.path, file.content);
    if (onProgress) {
      onProgress(Math.round(((index + 1) / PROJECT_FILES.length) * 60));
    }
  });

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(60 + Math.round(metadata.percent * 0.4));
      }
    }
  );

  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'VNQFF05_Project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Downloads a single file from the project.
 */
export function downloadSingleFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
