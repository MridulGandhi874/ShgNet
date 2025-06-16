from pymongo import MongoClient
import bcrypt
import re

client = MongoClient("mongodb://localhost:27017/")
db = client["shgnet_db"]
users = db["users"]

def is_email(identifier):
    return re.match(r"[^@]+@[^@]+\.[^@]+", identifier)

def is_phone(identifier):
    return re.match(r"^[6-9]\d{9}$", identifier)

def register_user(identifier, password, category):
    if not (identifier and password and category):
        return {"error": "Missing fields"}, 400

    if not (is_email(identifier) or is_phone(identifier)):
        return {"error": "Invalid email or phone"}, 400

    if users.find_one({"identifier": identifier}):
        return {"error": "User already exists"}, 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users.insert_one({
        "identifier": identifier,
        "password": hashed,
        "category": category,
        "otp_verified": False
    })
    return {"message": "User registered. Proceed to OTP verification."}, 201

def login_user(identifier, password):
    user = users.find_one({"identifier": identifier})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        if user["otp_verified"]:
            return {"message": "Login successful"}, 200
        else:
            return {"message": "OTP not verified"}, 401
    return {"error": "Invalid credentials"}, 401
