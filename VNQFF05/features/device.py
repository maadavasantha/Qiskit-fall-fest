"""
VNQFF-05: Device Trust Intelligence
Owner: Chingu (Feature Engineering)
Assesses hardware fingerprints, known devices, emulators, and device risk score.
"""

def evaluate_device_trust(device_id, known_devices_for_user):
    """
    Returns device trust score (0 - 100) and whether it's an unrecognized hardware ID.
    """
    if not device_id:
        return {'device_trust': 20.0, 'is_new_device': True, 'risk_label': 'HIGH'}
        
    if device_id in known_devices_for_user:
        return {'device_trust': 95.0, 'is_new_device': False, 'risk_label': 'LOW'}
    
    # Heuristic for suspicious emulator or rogue device IDs
    if any(keyword in device_id.upper() for keyword in ['ROGUE', 'EMU', 'ROOT', 'CLONE', 'TOR']):
        return {'device_trust': 10.0, 'is_new_device': True, 'risk_label': 'CRITICAL'}
        
    return {'device_trust': 45.0, 'is_new_device': True, 'risk_label': 'MEDIUM'}
