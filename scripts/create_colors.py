import requests
import time

# ==============================
# CONFIG
# ==============================

BASE_URL = "http://localhost:8080"

LOGIN_URL = f"{BASE_URL}/api/auth/login"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"
COLOR_API = f"{BASE_URL}/api/admin/colors"

EMAIL = "ad@gmail.com"
PASSWORD = "123"

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


def safe_get(url):
    response = session.get(url)

    if response.status_code == 401:
        print("⚠️ Token expired → Refreshing...")
        refresh_token()
        response = session.get(url)

    return response


# ==============================
# CHECK EXISTING COLORS
# ==============================

def get_existing_colors():
    response = safe_get(COLOR_API)

    if response.status_code != 200:
        return []

    return response.json()


def color_exists(name, existing_colors):
    return any(c["name"].lower() == name.lower() for c in existing_colors)


# ==============================
# MAIN
# ==============================

def main():
    login()

    colors = [
        {"name": "Black", "code": "#000000"},
        {"name": "White", "code": "#FFFFFF"},
        {"name": "Red", "code": "#FF0000"},
        {"name": "Blue", "code": "#0000FF"},
        {"name": "Green", "code": "#008000"},
        {"name": "Yellow", "code": "#FFFF00"},
        {"name": "Orange", "code": "#FFA500"},
        {"name": "Purple", "code": "#800080"},
        {"name": "Pink", "code": "#FFC0CB"},
        {"name": "Gray", "code": "#808080"},
        {"name": "Brown", "code": "#8B4513"},
        {"name": "Beige", "code": "#F5F5DC"},
        {"name": "Navy", "code": "#000080"},
        {"name": "Teal", "code": "#008080"},
        {"name": "Maroon", "code": "#800000"},
        {"name": "Olive", "code": "#808000"},
        {"name": "Cyan", "code": "#00FFFF"},
        {"name": "Magenta", "code": "#FF00FF"},
        {"name": "Silver", "code": "#C0C0C0"},
        {"name": "Gold", "code": "#FFD700"}
    ]

    existing_colors = get_existing_colors()

    for color in colors:
        if color_exists(color["name"], existing_colors):
            print(f"⚠️ Color already exists: {color['name']}")
            continue

        response = safe_post(COLOR_API, color)

        if response.status_code in [200, 201]:
            print(f"✅ Created color: {color['name']}")
        else:
            print(f"❌ Failed: {color['name']}")
            print(response.text)

        time.sleep(0.2)

    print("\n🎉 DONE! Colors seeded successfully.")


if __name__ == "__main__":
    main()