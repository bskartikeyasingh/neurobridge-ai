import firebase_admin
from firebase_admin import credentials, auth
from pathlib import Path

# Path to firebase-admin.json
BASE_DIR = Path(__file__).resolve().parent.parent.parent
cred_path = BASE_DIR / "firebase-admin.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(str(cred_path))
    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str):
    """
    Verify Firebase ID token received from frontend.
    Returns decoded user information.
    """
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token