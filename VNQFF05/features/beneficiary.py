"""
VNQFF-05: Beneficiary Trust Intelligence
Owner: Chingu (Feature Engineering)
Analyzes beneficiary reputation, dispute history, and KYC flag status.
"""

def evaluate_beneficiary_trust(beneficiary_id, flagged_beneficiaries=None, known_for_user=None):
    flagged = flagged_beneficiaries or ['B204', 'B305', 'B_MULE_501', 'B_MULE_502']
    known = known_for_user or ['B201', 'B202']
    
    if beneficiary_id in flagged:
        return {
            'beneficiary_trust': 15.0,
            'is_new_beneficiary': True,
            'is_flagged_mule': True,
            'risk_level': 'HIGH'
        }
        
    if beneficiary_id in known:
        return {
            'beneficiary_trust': 92.0,
            'is_new_beneficiary': False,
            'is_flagged_mule': False,
            'risk_level': 'LOW'
        }
        
    return {
        'beneficiary_trust': 50.0,
        'is_new_beneficiary': True,
        'is_flagged_mule': False,
        'risk_level': 'MEDIUM'
    }
