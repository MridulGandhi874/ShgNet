from flask import Flask, request, jsonify
from flask_cors import CORS
from database import register_user, login_user

app = Flask(__name__)
CORS(app)

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    identifier = data.get("identifier")
    password = data.get("password")
    category = data.get("category")
    result, status = register_user(identifier, password, category)
    return jsonify(result), status

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    identifier = data.get("identifier")
    password = data.get("password")
    result, status = login_user(identifier, password)
    return jsonify(result), status

if __name__ == "__main__":
    app.run(debug=True)
