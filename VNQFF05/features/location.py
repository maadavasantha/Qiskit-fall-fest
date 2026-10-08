"""
VNQFF-05: Geolocation & Impossible Travel Anomaly
Owner: Chingu (Feature Engineering)
Computes distance and impossible travel velocity from normal user centroid.
"""
import math

CITY_COORDINATES = {
    'Hyderabad': (17.3850, 78.4867),
    'Bengaluru': (12.9716, 77.5946),
    'Mumbai': (19.0760, 72.8777),
    'Delhi': (28.7041, 77.1025),
    'Chennai': (13.0827, 80.2707),
    'Pune': (18.5204, 73.8567),
    'Kolkata': (22.5726, 88.3639),
    'Dubai': (25.2048, 55.2708),
    'London': (51.5074, -0.1278),
    'Lagos': (6.5244, 3.3792)
}

def haversine_km(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def evaluate_location_anomaly(current_location, home_location='Hyderabad', time_diff_minutes=60):
    current_coord = CITY_COORDINATES.get(current_location, (28.6139, 77.2090))
    home_coord = CITY_COORDINATES.get(home_location, (17.3850, 78.4867))
    
    distance_km = haversine_km(home_coord, current_coord)
    speed_kmh = (distance_km / max(time_diff_minutes, 5)) * 60.0
    
    # Impossible travel speed (> 900 km/h commercial airliner speed without enough buffer)
    is_impossible_travel = speed_kmh > 850.0 and distance_km > 300.0
    is_anomalous_location = distance_km > 400.0
    
    return {
        'distance_km': round(distance_km, 2),
        'travel_speed_kmh': round(speed_kmh, 1),
        'is_impossible_travel': is_impossible_travel,
        'is_anomalous_location': is_anomalous_location
    }
