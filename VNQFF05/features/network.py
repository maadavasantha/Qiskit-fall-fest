"""
VNQFF-05: Network & Fraud Graph Analysis
Owner: Chingu (Feature Engineering)
Detects money mule relay accounts, cyclic laundering rings, and community clusters.
"""
import networkx as nx

class FraudGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._seed_default_graph()
        
    def _seed_default_graph(self):
        # Known synthetic money movement paths
        edges = [
            ('U1001', 'B201', {'weight': 2500, 'flagged': False}),
            ('U1002', 'B201', {'weight': 1400, 'flagged': False}),
            ('U1001', 'B204', {'weight': 85000, 'flagged': True}),
            ('B204', 'B305', {'weight': 82000, 'flagged': True}),
            ('B305', 'U1009', {'weight': 80000, 'flagged': True}),
            ('U1009', 'B204', {'weight': 79000, 'flagged': True}), # Cyclic ring!
            ('U1003', 'B202', {'weight': 4500, 'flagged': False}),
            ('U1004', 'B305', {'weight': 40000, 'flagged': True}),
        ]
        self.graph.add_edges_from([(u, v, d) for u, v, d in edges])

    def analyze_node(self, node_id):
        if not self.graph.has_node(node_id):
            return {
                'in_degree': 0,
                'out_degree': 0,
                'is_mule_candidate': False,
                'is_in_fraud_ring': False,
                'network_risk_score': 0.05
            }
            
        in_deg = self.graph.in_degree(node_id)
        out_deg = self.graph.out_degree(node_id)
        
        # Mule detection: balanced high in and out flow (pass-through account)
        is_mule = (in_deg >= 1 and out_deg >= 1) and (abs(in_deg - out_deg) <= 1)
        
        # Fraud ring: part of any simple cycle
        cycles = list(nx.simple_cycles(self.graph))
        is_in_ring = any(node_id in cycle for cycle in cycles)
        
        network_risk = 0.85 if is_in_ring else (0.65 if is_mule else 0.10)
        
        return {
            'in_degree': in_deg,
            'out_degree': out_deg,
            'is_mule_candidate': is_mule,
            'is_in_fraud_ring': is_in_ring,
            'network_risk_score': network_risk
        }

    def get_graph_data(self):
        """Export nodes and links for frontend visualizer"""
        nodes = []
        for n in self.graph.nodes():
            is_ben = n.startswith('B')
            nodes.append({
                'id': n,
                'label': n,
                'type': 'beneficiary' if is_ben else 'user',
                'flagged': n in ['B204', 'B305', 'U1009']
            })
            
        links = []
        for u, v, d in self.graph.edges(data=True):
            links.append({
                'source': u,
                'target': v,
                'weight': d.get('weight', 1000),
                'flagged': d.get('flagged', False)
            })
            
        return {'nodes': nodes, 'links': links}
