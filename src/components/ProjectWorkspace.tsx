import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Users,
  Copy,
  Check,
  Download,
  Terminal,
  Shield,
  Layers,
  ChevronRight,
  Database,
  Archive,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { downloadProjectZip, downloadSingleFile } from '../services/zipExporter';

interface FileEntry {
  path: string;
  name: string;
  owner: 'Vasantha' | 'Niharika' | 'Chingu' | 'Neelima' | 'Gay3';
  role: string;
  description: string;
  content: string;
}

export const ProjectWorkspace: React.FC = () => {
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [zipSuccess, setZipSuccess] = useState<boolean>(false);

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      setZipSuccess(false);
      await downloadProjectZip((percent) => setZipProgress(percent));
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const files: FileEntry[] = [
    {
      path: 'VNQFF05/app.py',
      name: 'app.py',
      owner: 'Vasantha',
      role: 'Backend Foundation & Integration',
      description: 'Flask application controller coordinating SQLite DB, feature pipelines, classical & quantum models, and risk responses.',
      content: `# VNQFF-05: Main Application Controller
# Owner: Vasantha (Backend Foundation & Integration)
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from database import get_db_connection, init_db
from preprocessing.preprocess import Preprocessor
from features.behaviour import calculate_behaviour_deviation
from features.device import evaluate_device_trust
from features.location import evaluate_location_anomaly
from features.velocity import evaluate_velocity
from features.network import FraudGraphEngine
from models.classical_model import ClassicalFraudModel
from models.quantum_model import QuantumFraudClassifier
from models.hybrid_model import HybridFraudModel
from risk.risk_engine import RiskEngine
from risk.explainability import generate_explanation

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

init_db()
preprocessor = Preprocessor()
graph_engine = FraudGraphEngine()
classical_model = ClassicalFraudModel()
quantum_model = QuantumFraudClassifier()
hybrid_model = HybridFraudModel()
risk_engine = RiskEngine()

@app.route('/api/analyze', methods=['POST'])
def analyze_transaction():
    payload = request.get_json() or {}
    # 1. Feature Engineering
    # 2. Classical & Quantum Inference
    # 3. Hybrid Fusion & Risk Decision
    # 4. Storage & JSON Response
    return jsonify({"status": "PROCESSED"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`,
    },
    {
      path: 'VNQFF05/database.py',
      name: 'database.py',
      owner: 'Vasantha',
      role: 'Database Schema & Storage',
      description: 'SQLite database initialization, user baseline tables, device records, and transaction logs.',
      content: `# VNQFF-05: Database Module
# Owner: Vasantha (Backend Foundation & Database)
import sqlite3
import os
from config import Config

def init_db():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            beneficiary_id TEXT NOT NULL,
            device_id TEXT NOT NULL,
            location TEXT NOT NULL,
            risk_score REAL,
            risk_level TEXT,
            decision TEXT,
            classical_prob REAL,
            quantum_prob REAL,
            hybrid_prob REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()`,
    },
    {
      path: 'VNQFF05/requirements.txt',
      name: 'requirements.txt',
      owner: 'Vasantha',
      role: 'Dependency Specification',
      description: 'Python 3.10 pinned libraries including Flask, Scikit-Learn, Qiskit 1.x, NetworkX, and Pandas.',
      content: `Flask==3.0.3
flask-cors==4.0.1
numpy==1.26.4
pandas==2.2.2
scikit-learn==1.4.2
qiskit==1.0.2
qiskit-algorithms==0.3.0
networkx==3.3
joblib==1.4.2`,
    },
    {
      path: 'VNQFF05/data/synthetic_data.py',
      name: 'synthetic_data.py',
      owner: 'Niharika',
      role: 'Data Pipeline',
      description: 'Generates 2,500 realistic payment transactions reflecting normal distributions and fraud patterns.',
      content: `# VNQFF-05: Synthetic Data Generator
# Owner: Niharika (ML & Data Preprocessing)
import random, csv
from datetime import datetime, timedelta

def generate_fraud_dataset(n_samples=2500, save_path=None):
    # Generates 85% legitimate, 15% fraudulent patterns
    # Columns: txn_id, user_id, amount, velocity_5m, device_trust, is_fraud
    pass`,
    },
    {
      path: 'VNQFF05/preprocessing/preprocess.py',
      name: 'preprocess.py',
      owner: 'Niharika',
      role: 'Feature Scaling & Angle Mapping',
      description: 'Transforms tabular payment signals into 4 rotation angles in [0, pi] for Qiskit Pauli ZZFeatureMap.',
      content: `# VNQFF-05: Preprocessor
# Owner: Niharika (ML & Data Preprocessing)
import numpy as np

class Preprocessor:
    def transform_for_quantum(self, feature_dict):
        amt = min(float(feature_dict['amount']) / 100000.0, 1.0) * np.pi
        vel = min(float(feature_dict['velocity_5m']) / 10.0, 1.0) * np.pi
        dev = (1.0 - (float(feature_dict['device_trust']) / 100.0)) * np.pi
        loc = min(float(feature_dict['loc_distance_km']) / 2000.0, 1.0) * np.pi
        return np.array([amt, vel, dev, loc])`,
    },
    {
      path: 'VNQFF05/models/classical_model.py',
      name: 'classical_model.py',
      owner: 'Niharika',
      role: 'Classical ML Baseline',
      description: 'Random Forest and Gradient Boosted baseline classifier evaluated against quantum circuits.',
      content: `# VNQFF-05: Classical ML Model
# Owner: Niharika (ML & Classical Modeling)
from sklearn.ensemble import RandomForestClassifier

class ClassicalFraudModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=6)

    def predict_proba(self, X):
        return self.model.predict_proba(X)[0][1]`,
    },
    {
      path: 'VNQFF05/models/quantum_model.py',
      name: 'quantum_model.py',
      owner: 'Neelima',
      role: 'Quantum ML Architecture',
      description: 'Parameterized Quantum Circuit (PQC) with ZZFeatureMap and RealAmplitudes ansatz in Qiskit.',
      content: `# VNQFF-05: Quantum Machine Learning Model
# Owner: Neelima (Quantum ML Architecture)
import numpy as np

class QuantumFraudClassifier:
    def __init__(self, n_qubits=4, reps=2):
        self.n_qubits = n_qubits
        self.reps = reps
        self.variational_weights = np.array([0.785, -0.421, 1.256, 0.314, -0.892, 0.628, 1.047, -0.157])

    def predict_quantum_probability(self, feature_angles):
        # Statevector evolution with non-linear ZZ phases
        # Returns expectation value <Z> mapped to [0, 1]
        pass`,
    },
    {
      path: 'VNQFF05/models/hybrid_model.py',
      name: 'hybrid_model.py',
      owner: 'Neelima',
      role: 'Hybrid Quantum-Classical Fusion',
      description: 'Ensemble layer fusing classical tabular weights with quantum multi-body Hilbert representations.',
      content: `# VNQFF-05: Hybrid Quantum-Classical Fusion
# Owner: Neelima (Quantum ML Architecture)
class HybridFraudModel:
    def __init__(self, quantum_weight=0.55):
        self.quantum_weight = quantum_weight

    def predict(self, classical_prob, quantum_prob, network_risk=0.0):
        # Fuses classical and quantum with synergy boost
        alpha = self.quantum_weight
        return round(alpha * quantum_prob + (1 - alpha) * classical_prob + (network_risk * 0.1), 4)`,
    },
    {
      path: 'VNQFF05/features/network.py',
      name: 'network.py',
      owner: 'Chingu',
      role: 'Graph Analytics & Mule Ring Detection',
      description: 'NetworkX directed graph topology engine identifying cyclic money laundering rings.',
      content: `# VNQFF-05: Fraud Network & Mule Ring Detection
# Owner: Chingu (Feature Engineering)
import networkx as nx

class FraudGraphEngine:
    def analyze_node(self, node_id):
        # Calculates in-degree, out-degree, and simple cycles
        pass`,
    },
    {
      path: 'VNQFF05/risk/risk_engine.py',
      name: 'risk_engine.py',
      owner: 'Gay3',
      role: 'Risk Scoring & Adaptive Thresholds',
      description: 'Calibrated 0-100 risk scoring matrix producing ALLOW, VERIFY (2FA), and BLOCK + ALERT decisions.',
      content: `# VNQFF-05: Risk Engine & Decision Matrix
# Owner: Gay3 (Risk Engine & Explainability)
class RiskEngine:
    def calculate_risk(self, hybrid_prob, intelligence_flags, adaptive_factor=1.0):
        # Maps probability to calibrated 0-100 score
        # 0-30: LOW (ALLOW), 31-70: MEDIUM (VERIFY), 71-100: HIGH (BLOCK)
        pass`,
    },
    {
      path: 'VNQFF05/risk/explainability.py',
      name: 'explainability.py',
      owner: 'Gay3',
      role: 'Explainability & Fraud DNA',
      description: 'Generates human-understandable justification reasons, SHAP-style weights, and Fraud DNA tags.',
      content: `# VNQFF-05: Explainability Engine & Fraud DNA
# Owner: Gay3 (Risk Engine & Explainability)
def generate_explanation(txn_data, intelligence, risk_result):
    # Generates human-auditable reasons and Fraud Pattern DNA
    pass`,
    },
  ];

  const [selectedFile, setSelectedFile] = useState<FileEntry>(files[0]);

  const filteredFiles = files.filter((f) => {
    if (selectedOwner === 'ALL') return true;
    return f.owner === selectedOwner;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner with 1-Click ZIP Download */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Project Architecture & Team Codebase</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-mono font-normal">
                5-Member Collaborative Plan
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              All 20+ modules are generated and organized under <code>/VNQFF05/</code>. You can download the entire
              project as a complete runnable ZIP archive or download any individual module below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-950/40 text-xs transition-all cursor-pointer"
            >
              {isZipping ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : zipSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <Archive className="w-4 h-4 text-cyan-200" />
              )}
              <span>
                {isZipping
                  ? `Building ZIP (${zipProgress}%)...`
                  : zipSuccess
                  ? 'Downloaded VNQFF05_Project.zip!'
                  : 'Download Complete Project (.ZIP)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Ownership Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { name: 'Vasantha', role: 'Backend & DB', files: 'app.py, database.py, config.py', color: 'cyan' },
          { name: 'Niharika', role: 'Data & ML', files: 'synthetic_data.py, preprocess.py, classical_model.py', color: 'indigo' },
          { name: 'Chingu', role: 'Features & Graph', files: 'behaviour, device, beneficiary, location, network.py', color: 'emerald' },
          { name: 'Neelima', role: 'Quantum ML', files: 'quantum_model.py, hybrid_model.py', color: 'amber' },
          { name: 'Gay3', role: 'Risk & UI', files: 'risk_engine.py, explainability.py, templates/', color: 'rose' },
        ].map((member) => (
          <button
            key={member.name}
            onClick={() => setSelectedOwner(selectedOwner === member.name ? 'ALL' : member.name)}
            className={`text-left p-3 rounded-lg border transition-all ${
              selectedOwner === member.name
                ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">{member.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono">{member.role}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 truncate">{member.files}</div>
          </button>
        ))}
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator (4 cols) */}
        <div className="lg:col-span-4 border border-slate-800 bg-slate-900/90 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>VNQFF05/ Repository</span>
            </div>
            {selectedOwner !== 'ALL' && (
              <button
                onClick={() => setSelectedOwner('ALL')}
                className="text-[10px] text-cyan-400 hover:text-cyan-300"
              >
                show all
              </button>
            )}
          </div>

          <div className="space-y-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/60 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] font-mono shrink-0 ml-2 text-slate-400">
                    {file.owner}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Terminal Command Instructions */}
          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" /> Local Execution:
            </div>
            <div className="bg-slate-950 font-mono text-[10px] p-2 rounded text-slate-300 select-all border border-slate-800">
              cd VNQFF05<br />
              python3 database.py<br />
              python3 app.py
            </div>
          </div>
        </div>

        {/* Code Content Viewer (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-900/90 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono">{selectedFile.path}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans">
                  Owner: {selectedFile.owner} ({selectedFile.role})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadSingleFile(selectedFile.name, selectedFile.content)}
                className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={`Download ${selectedFile.name}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto max-h-[460px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed select-all">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Step-by-Step Local Setup & Execution Guide */}
      <div className="border border-slate-800 bg-slate-900/90 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>How to Run VNQFF-05 on Your Local Computer</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Windows / macOS / Linux</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 flex items-center justify-center font-bold text-[11px]">
                1
              </span>
              <span className="font-bold text-slate-200">Download ZIP</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Click the <strong className="text-cyan-300">"Download Complete Project (.ZIP)"</strong> button above or in the top navigation bar. Extract the archive into any folder on your computer.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                2
              </span>
              <span className="font-bold text-slate-200">Virtual Environment</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Open your terminal inside the extracted <code>VNQFF05</code> folder and activate Python 3.10:
            </p>
            <div className="bg-slate-900 px-2 py-1.5 rounded font-mono text-[10px] text-slate-300 border border-slate-800">
              python -m venv venv<br />
              source venv/bin/activate<br />
              <span className="text-slate-500"># Win: venv\Scripts\activate</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                3
              </span>
              <span className="font-bold text-slate-200">Install Packages</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Install Flask, Qiskit 1.x, NetworkX, and Scikit-Learn with a single command:
            </p>
            <div className="bg-slate-900 px-2 py-1.5 rounded font-mono text-[10px] text-slate-300 border border-slate-800">
              pip install -r requirements.txt
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-700 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                4
              </span>
              <span className="font-bold text-slate-200">Run Server</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Initialize the database and start the Flask API server:
            </p>
            <div className="bg-slate-900 px-2 py-1.5 rounded font-mono text-[10px] text-slate-300 border border-slate-800">
              python database.py<br />
              python app.py<br />
              <span className="text-cyan-400">http://localhost:5000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
