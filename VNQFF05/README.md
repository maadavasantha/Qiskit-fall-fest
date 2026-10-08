# VNQFF-05: Quantum-Enhanced Digital Payment Fraud Detection

**Unified Master Architecture & Implementation Plan**

VNQFF-05 is a hybrid quantum-classical digital payment fraud detection platform that combines classical fraud intelligence, Qiskit-based quantum machine learning, hybrid modeling, graph-based fraud analysis, explainable risk scoring, and real-time response to analyze suspicious transactions and compare classical, quantum, and hybrid approaches.

---

## 1. Team Responsibilities & Ownership Matrix

| Member | Module Scope | Core Files | Responsibility |
|---|---|---|---|
| **Vasantha** | Backend Foundation & Integration | `app.py`, `database.py`, `config.py`, `requirements.txt` | Coordinates entire pipeline, Flask APIs, SQLite DB, and module integration |
| **Niharika** | ML & Data Preprocessing | `data/*`, `preprocessing/*`, `models/classical_model.py` | Dataset generation, feature scaling, angle transformation, and classical baseline |
| **Chingu** | Feature Engineering & Network | `features/*` (behaviour, device, beneficiary, location, velocity, network) | Multidimensional fraud intelligence and fraud ring / mule detection |
| **Neelima** | Quantum ML Architecture | `models/quantum_model.py`, `models/hybrid_model.py` | Qiskit ZZFeatureMap, RealAmplitudes ansatz, circuit simulator, and hybrid ensemble |
| **Gay3** | Risk & Explainability / UI | `risk/*`, `templates/*`, `static/*` | 0–100 risk scoring, decision thresholds, SHAP explainability, and frontend dashboard |

---

## 2. The 20 Main Platform Features

1. **Quantum Fraud Classification**: Parameterized Quantum Circuit (PQC) using ZZFeatureMap & RealAmplitudes.
2. **Real-Time Detection**: Immediate transaction ingestion & classification.
3. **Risk Scoring**: 0–30 (LOW → ALLOW), 31–70 (MEDIUM → VERIFY), 71–100 (HIGH → BLOCK + ALERT).
4. **Behaviour Fingerprint**: Historical statistical profile deviation (amount Z-score, circadian pattern).
5. **Transaction Anomaly**: Outlier detection across amount and frequency.
6. **Device Trust**: Hardware fingerprint evaluation, emulator/proxy detection.
7. **Beneficiary Trust**: Flagged mule account check, dispute reputation score.
8. **Location Anomaly**: Haversine distance and impossible-travel velocity computation.
9. **Transaction Velocity**: Sliding window counter (5m, 1h, 24h) to detect smurfing.
10. **Mule Account Detection**: Graph degree symmetry (high in-flow & out-flow pass-through).
11. **Fraud Ring Detection**: Directed cycle and clique identification in transaction graphs.
12. **Transaction Graph**: Interactive network canvas visualizing money laundering paths.
13. **Fraud Pattern DNA**: Compact characteristic signature (e.g., `NEW_DEV + GEO_ANOMALY + HIGH_VELOCITY`).
14. **Early Fraud Prediction**: Micro-probing and velocity acceleration flags.
15. **Explainable Detection**: Natural human-readable reasons and feature attribution weights.
16. **Adaptive Risk Threshold**: Dynamic threshold scaling based on high-alert / festival context.
17. **Fraud Attack Simulation**: 1-click test attack profiles (Account Takeover, Smurfing, Mule Ring, Normal).
18. **Classical vs Quantum vs Hybrid**: Scientific benchmarking across Accuracy, Precision, Recall, F1, and Latency.
19. **Quantum Performance Dashboard**: Qubits, circuit depth, gate counts, execution time, and angle encodings.
20. **Fraud Response Center**: Live incident log, decision review, 2FA challenge, account freeze, and audit trail.

---

## 3. Quick Start (Python 3.10)

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Initialize database
python database.py

# 4. Generate synthetic dataset
python data/synthetic_data.py

# 5. Run Flask application
python app.py
```
Open `http://localhost:5000` to access the application.
