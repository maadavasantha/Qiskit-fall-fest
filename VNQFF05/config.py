"""
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
