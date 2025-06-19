from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["shgnet"]
users = db["users"]
ngo_admins = db["ngo_admins"]

def get_user_by_identifier(identifier):
    return users.find_one({"identifier": identifier})

def create_user(user_data):
    users.insert_one(user_data)

def get_ngo_admins():
    return list(ngo_admins.find({}, {"_id": 0}))

def add_ngo_admin(username, identifier):
    ngo_admins.insert_one({"username": username, "identifier": identifier})

def remove_ngo_admin(identifier):
    ngo_admins.delete_one({"identifier": identifier})
