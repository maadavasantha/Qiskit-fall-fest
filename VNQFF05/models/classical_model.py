"""
VNQFF-05: Classical Machine Learning Model
Owner: Niharika (ML & Data Preprocessing)
Baseline classical fraud detection using Random Forest / Gradient Boosting.
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier

class ClassicalFraudModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        self.is_trained = False
        self._init_pretrained_weights()
        
    def _init_pretrained_weights(self):
        # Quick synthetic fit so the model is immediately executable
        X_mock = np.array([
            [2500, 1, 95, 90, 5, 0.4, 0.05],
            [1200, 0, 98, 95, 2, 0.2, 0.02],
            [85000, 8, 15, 20, 1400, 4.2, 0.85],
            [92000, 6, 20, 25, 980, 3.8, 0.80],
            [4500, 2, 85, 80, 25, 0.9, 0.10],
            [350, 1, 90, 90, 8, 0.3, 0.04],
            [115000, 11, 10, 15, 2500, 5.1, 0.95],
            [6800, 1, 88, 85, 30, 0.7, 0.08]
        ])
        y_mock = np.array([0, 0, 1, 1, 0, 0, 1, 0])
        self.model.fit(X_mock, y_mock)
        self.is_trained = True

    def predict_proba(self, feature_vector):
        """
        Expects feature vector of shape (1, 7):
        [amount, velocity, device_trust, ben_trust, loc_dist, behaviour_z, network_risk]
        """
        probs = self.model.predict_proba(feature_vector)[0]
        # prob of fraud is index 1
        return float(probs[1])
