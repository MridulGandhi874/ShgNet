from pymongo import MongoClient
import bcrypt

client = MongoClient("mongodb://localhost:27017/")
db = client["shgnet"]

# Collections
users = db["users"]
ngo_admins = db["ngo_admins"]
deleted_ngo_admins = db["deleted_ngo_admins"]
shg_leaders = db["shg_leaders"]
deleted_shg_leaders = db["deleted_shg_leaders"]

# --------------------------------------
# USER CREATION / REGISTRATION
# --------------------------------------

def get_user_by_identifier(identifier):
    return users.find_one({"identifier": identifier})

def create_user(user_data):
    identifier = user_data["identifier"]
    username = user_data["username"]
    roles = user_data.get("roles", [])
    password = user_data["password"]

    if isinstance(password, str):
        password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    if isinstance(roles, str):
        roles = [roles]

    existing_user = users.find_one({"identifier": identifier})

    if existing_user:
        existing_roles = existing_user.get("roles", [])
        new_roles = [role for role in roles if role not in existing_roles]

        if not new_roles:
            raise ValueError("You already have these role(s).")

        updated_roles = list(set(existing_roles + new_roles))

        users.update_one(
            {"identifier": identifier},
            {
                "$set": {
                    "roles": updated_roles,
                    "username": username,
                    "password": password
                }
            }
        )
    else:
        users.insert_one({
            "identifier": identifier,
            "username": username,
            "password": password,
            "roles": roles,
            "profile_filled": False  # <- important
        })
        new_roles = roles

    for role in new_roles:
        if role == "ngo_admin" and not ngo_admins.find_one({"identifier": identifier}):
            ngo_admins.insert_one({"username": username, "identifier": identifier})
        elif role == "shg_leader" and not shg_leaders.find_one({"identifier": identifier}):
            shg_leaders.insert_one({"username": username, "identifier": identifier})

# --------------------------------------
# USER LOGIN / VERIFICATION
# --------------------------------------

def verify_user(identifier, password):
    if identifier == "admin@dragonflora.org" and password == "admin@123":
        return {
            "username": "Super Admin",
            "identifier": identifier,
            "roles": ["super_admin"],
            "profile_filled": True
        }, None

    user = users.find_one({"identifier": identifier})
    if not user:
        return None, "User not found."

    stored_password = user["password"]
    if isinstance(stored_password, str):
        stored_password = stored_password.encode("utf-8")

    if not bcrypt.checkpw(password.encode("utf-8"), stored_password):
        return None, "Incorrect password."

    valid_roles = []
    for role in user.get("roles", []):
        if role == "ngo_admin" and ngo_admins.find_one({"identifier": identifier}):
            valid_roles.append("ngo_admin")
        elif role == "shg_leader" and shg_leaders.find_one({"identifier": identifier}):
            valid_roles.append("shg_leader")
        elif role == "shg_member":
            valid_roles.append("shg_member")

    if not valid_roles:
        return None, "This account is inactive for all roles."

    return {
        "username": user["username"],
        "identifier": user["identifier"],
        "roles": valid_roles,
        "profile_filled": user.get("profile_filled", False)
    }, None

def verify_user_with_role(identifier, password, selected_role):
    user_info, error = verify_user(identifier, password)
    if error:
        return None, error

    if selected_role not in user_info["roles"]:
        return None, f"You are not registered as {selected_role}."

    return {
        **user_info,
        "active_role": selected_role
    }, None

# --------------------------------------
# NGO ADMIN FUNCTIONS
# --------------------------------------

def get_ngo_admins():
    return list(ngo_admins.find({}, {"_id": 0}))

def remove_ngo_admin(identifier):
    admin = ngo_admins.find_one({"identifier": identifier})
    if admin:
        deleted_ngo_admins.insert_one(admin)
        ngo_admins.delete_one({"identifier": identifier})

def get_deleted_ngo_admins():
    return list(deleted_ngo_admins.find({}, {"_id": 0}))

def restore_ngo_admin(identifier):
    admin = deleted_ngo_admins.find_one({"identifier": identifier})
    if admin:
        ngo_admins.insert_one(admin)
        deleted_ngo_admins.delete_one({"identifier": identifier})

# --------------------------------------
# SHG LEADER FUNCTIONS
# --------------------------------------

def get_shg_leaders():
    return list(shg_leaders.find({}, {"_id": 0}))

def remove_shg_leader(identifier):
    leader = shg_leaders.find_one({"identifier": identifier})
    if leader:
        deleted_shg_leaders.insert_one(leader)
        shg_leaders.delete_one({"identifier": identifier})

def get_deleted_shg_leaders():
    return list(deleted_shg_leaders.find({}, {"_id": 0}))

def restore_shg_leader(identifier):
    leader = deleted_shg_leaders.find_one({"identifier": identifier})
    if leader:
        shg_leaders.insert_one(leader)
        deleted_shg_leaders.delete_one({"identifier": identifier})
