"""
VNQFF-05: Authentication & Session Module
Owner: Vasantha (Backend Foundation)
Manages user and security officer session authentication.
"""
from functools import wraps

def mock_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Clean authentication decorator for security routes
        return f(*args, **kwargs)
    return decorated_function
