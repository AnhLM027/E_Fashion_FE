import requests
import time
import json

# ==============================
# CONFIG
# ==============================

BASE_URL = "http://localhost:8080"

LOGIN_URL = f"{BASE_URL}/api/auth/login"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"
CATEGORY_API = f"{BASE_URL}/api/admin/categories"

EMAIL = "ad@gmail.com"
PASSWORD = "123456"

CATEGORY_FILE = "categories.json"

session = requests.Session()
session.headers.update({
    "Content-Type": "application/json"
})


# ==============================
# AUTH
# ==============================

def login():
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }

    response = session.post(LOGIN_URL, json=payload)

    if response.status_code == 200:
        print("✅ Login successful")
    else:
        print("❌ Login failed:", response.text)
        exit()


def refresh_token():
    response = session.post(REFRESH_URL)

    if response.status_code == 200:
        print("🔄 Token refreshed")
    else:
        print("❌ Refresh failed:", response.text)
        exit()


def safe_post(url, payload):
    response = session.post(url, json=payload)

    if response.status_code == 401:
        print("⚠️ Token expired → Refreshing...")
        refresh_token()
        response = session.post(url, json=payload)

    return response


# ==============================
# CREATE CATEGORY
# ==============================

def create_category(name, parent_id=None, image_url=None):
    payload = {
        "name": name,
        "imageUrl": image_url
    }

    if parent_id:
        payload["parentId"] = parent_id

    response = safe_post(CATEGORY_API, payload)

    if response.status_code not in [200, 201]:
        print(f"❌ Failed create category: {name}")
        print(response.text)
        return None

    category_id = response.json()["id"]
    print(f"✅ Created: {name}")

    return category_id


# ==============================
# RECURSIVE CREATE
# ==============================

def create_tree(node, parent_id=None):

    name = node["name"]
    image_url = node.get("imageUrl")
    children = node.get("children", [])

    new_id = create_category(name, parent_id, image_url)

    if not new_id:
        return

    for child in children:
        create_tree(child, new_id)

    time.sleep(0.05)


# ==============================
# MAIN
# ==============================

def main():

    login()

    with open(CATEGORY_FILE, "r", encoding="utf-8") as f:
        categories = json.load(f)

    for root in categories:
        create_tree(root)

    print("\n🎉 DONE! Categories created.")


if __name__ == "__main__":
    main()