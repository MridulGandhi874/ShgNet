from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["shgnet"]
users_collection = db["users"]

@app.route("/")
def home():
    return "SHGNet API is running."

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    identifier = data.get("identifier")
    password = data.get("password")
    category = data.get("category")

    if identifier == "admin@dragonflora.org":
        return jsonify({"message": "Cannot register as Super Admin."}), 403

    if not username or not identifier or not password or not category:
        return jsonify({"message": "All fields are required."}), 400

    if users_collection.find_one({"identifier": identifier}):
        return jsonify({"message": "User already exists."}), 409

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "username": username,
        "identifier": identifier,
        "password": hashed_password,
        "category": category
    })

    return jsonify({"message": "Registered successfully."}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    identifier = data.get("identifier")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"message": "Email or password missing."}), 400

    # Hardcoded Super Admin login (secure)
    if identifier == "admin@dragonflora.org" and password == "admin@123":
        return jsonify({
            "message": "Super Admin logged in.",
            "user": {
                "username": "Super Admin",
                "identifier": identifier,
                "category": "super_admin"
            }
        }), 200

    user = users_collection.find_one({"identifier": identifier})
    if not user:
        return jsonify({"message": "User not found."}), 404

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"message": "Incorrect password."}), 401

    return jsonify({
        "message": "Login successful.",
        "user": {
            "username": user["username"],
            "identifier": user["identifier"],
            "category": user["category"]
        }
    }), 200

@app.errorhandler(Exception)
def handle_errors(e):
    if isinstance(e, HTTPException):
        return jsonify({"message": e.description}), e.code
    return jsonify({"message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
