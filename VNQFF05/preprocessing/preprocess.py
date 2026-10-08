"""
VNQFF-05: Preprocessing & Feature Encoding
Owner: Niharika (ML & Preprocessing)
Prepares numerical feature vectors and scales features for classical and quantum models.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler

class Preprocessor:
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, np.pi))
        self.is_fitted = False
        
    def fit(self, df):
        cols = ['amount', 'velocity_5m', 'loc_distance_km', 'behaviour_z_score']
        self.scaler.fit(df[cols])
        self.is_fitted = True
        
    def transform_for_classical(self, feature_dict):
        """Returns standard feature array for Classical ML models"""
        return np.array([
            float(feature_dict.get('amount', 5000.0)),
            float(feature_dict.get('velocity_5m', 1)),
            float(feature_dict.get('device_trust', 80.0)),
            float(feature_dict.get('beneficiary_trust', 85.0)),
            float(feature_dict.get('loc_distance_km', 10.0)),
            float(feature_dict.get('behaviour_z_score', 0.5)),
            float(feature_dict.get('network_risk', 0.1))
        ]).reshape(1, -1)
        
    def transform_for_quantum(self, feature_dict, n_qubits=4):
        """
        Scales key fraud indicators into rotation angles [0, pi]
        suitable for Qiskit Quantum Feature Mapping (ZZFeatureMap / PauliFeatureMap).
        """
        amt = min(float(feature_dict.get('amount', 5000)) / 100000.0, 1.0) * np.pi
        vel = min(float(feature_dict.get('velocity_5m', 1)) / 10.0, 1.0) * np.pi
        dev_risk = (1.0 - (float(feature_dict.get('device_trust', 80.0)) / 100.0)) * np.pi
        loc_risk = min(float(feature_dict.get('loc_distance_km', 10.0)) / 2000.0, 1.0) * np.pi
        
        # 4 quantum features mapped to 4 qubits
        quantum_angles = np.array([amt, vel, dev_risk, loc_risk])
        return quantum_angles
