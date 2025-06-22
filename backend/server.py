from flask import Flask, request, jsonify
from flask_cors import CORS
from database import (
    create_user, verify_user, get_ngo_admins,
    remove_ngo_admin, get_deleted_ngo_admins, restore_ngo_admin,
    get_shg_leaders, remove_shg_leader,
    get_deleted_shg_leaders, restore_shg_leader, users
)

app = Flask(__name__)
CORS(app)

# =============================
# AUTH ROUTES
# =============================

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["username", "identifier", "password", "roles"]
    if not all(field in data and data[field] for field in required):
        return jsonify({"message": "All fields are required."}), 400

    try:
        create_user(data)
    except ValueError as ve:
        return jsonify({"message": str(ve)}), 409

    return jsonify({"message": "Registered successfully."}), 200


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid or missing JSON in request."}), 400

        identifier = data.get("identifier")
        password = data.get("password")
        selected_role = data.get("role")

        if not identifier or not password:
            return jsonify({"message": "Missing credentials."}), 400

        user_result, error = verify_user(identifier, password)
        if error:
            return jsonify({"message": error}), 401

        if not selected_role:
            return jsonify({
                "message": "Login successful. Please select a role.",
                "user": user_result
            }), 200

        if selected_role not in user_result.get("roles", []):
            return jsonify({"message": "Selected role not assigned to user."}), 403

        # Role access check
        if selected_role == "ngo_admin":
            from database import ngo_admins
            if ngo_admins.find_one({"identifier": identifier}) is None:
                return jsonify({"message": "NGO Admin role access removed by Super Admin."}), 403

        if selected_role == "shg_leader":
            from database import shg_leaders
            if shg_leaders.find_one({"identifier": identifier}) is None:
                return jsonify({"message": "SHG Leader role access removed by Super Admin."}), 403

        # ✅ Fetch updated profile_filled from DB
        user_doc = users.find_one({"identifier": identifier})
        profile_filled = user_doc.get("profile_filled", False)

        return jsonify({
            "message": f"Login successful as {selected_role}.",
            "user": {
                "username": user_result["username"],
                "identifier": user_result["identifier"],
                "roles": [selected_role],
                "profile_filled": profile_filled  # ✅ return correct value
            }
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server error: {str(e)}"}), 500


# =============================
# NGO ADMIN ROUTES
# =============================

@app.route("/ngo-admins", methods=["GET"])
def get_admins():
    return jsonify(get_ngo_admins()), 200

@app.route("/ngo-admins/<identifier>", methods=["DELETE"])
def delete_admin(identifier):
    remove_ngo_admin(identifier)
    return jsonify({"message": "NGO Admin deleted successfully."}), 200

@app.route("/deleted-ngo-admins", methods=["GET"])
def deleted_admins():
    return jsonify(get_deleted_ngo_admins()), 200

@app.route("/restore-ngo-admin/<identifier>", methods=["POST"])
def restore_admin(identifier):
    restore_ngo_admin(identifier)
    return jsonify({"message": "NGO Admin restored successfully."}), 200

# =============================
# SHG LEADER ROUTES
# =============================

@app.route("/shg-leaders", methods=["GET"])
def shg_leaders_list():
    return jsonify(get_shg_leaders()), 200

@app.route("/shg-leaders", methods=["DELETE"])
def delete_shg_leader():
    identifier = request.args.get("identifier")
    if not identifier:
        return jsonify({"message": "Identifier is required."}), 400
    remove_shg_leader(identifier)
    return jsonify({"message": "SHG Leader deleted."}), 200

@app.route("/deleted-shg-leaders", methods=["GET"])
def deleted_shg_leaders():
    return jsonify(get_deleted_shg_leaders()), 200

@app.route("/restore-shg-leader", methods=["POST"])
def restore_shg_leader_route():
    data = request.get_json()
    identifier = data.get("identifier")
    if not identifier:
        return jsonify({"message": "Identifier is required."}), 400
    restore_shg_leader(identifier)
    return jsonify({"message": "SHG Leader restored."}), 200

# =============================
# PROFILE ROUTES
# =============================

@app.route("/save-profile", methods=["POST"])
def save_profile():
    data = request.get_json()
    identifier = data.get("identifier")
    profile = data.get("profile")

    if not identifier or not profile:
        return jsonify({"message": "Invalid data"}), 400

    users.update_one(
        {"identifier": identifier},
        {"$set": {"profile": profile, "profile_filled": True}}  # ✅ set true
    )
    return jsonify({"message": "Profile saved"}), 200


@app.route("/update-ngo-profile", methods=["POST"])
def update_ngo_profile():
    data = request.get_json()
    identifier = data.get("identifier")
    profile = data.get("profile")

    if not identifier or not profile:
        return jsonify({"message": "Invalid data"}), 400

    result = users.update_one(
        {"identifier": identifier},
        {"$set": {
            "profile": profile,
            "profile_filled": True   # ✅ forcefully set this
        }}
    )

    if result.matched_count == 0:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "Profile updated successfully"}), 200


# =============================
# SERVER TEST
# =============================

@app.route("/")
def home():
    return "SHGNet backend is running."

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
