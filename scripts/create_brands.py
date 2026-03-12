import requests
import time

# ==============================
# CONFIG
# ==============================

BASE_URL = "http://localhost:8080"

LOGIN_URL = f"{BASE_URL}/api/auth/login"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"
BRAND_API = f"{BASE_URL}/api/admin/brands"

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
# CHECK EXISTING BRAND
# ==============================

def get_existing_brands():
    response = safe_get(BRAND_API)

    if response.status_code != 200:
        return []

    return response.json()


def brand_exists(name, existing_brands):
    return any(b["name"].lower() == name.lower() for b in existing_brands)


# ==============================
# CREATE BRAND
# ==============================

def create_brand(name, logo_url):
    payload = {
        "name": name,
        "logoUrl": logo_url
    }

    response = safe_post(BRAND_API, payload)

    if response.status_code not in [200, 201]:
        print(f"❌ Failed create brand: {name}")
        print(response.text)
        return None

    print(f"✅ Created brand: {name}")
    return response.json().get("id")


# ==============================
# MAIN
# ==============================

def main():
    login()

    brands = [
        {
            "name": "Nike",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
        },
        {
            "name": "Adidas",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
        },
        {
            "name": "Puma",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg"
        },
        {
            "name": "Zara",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg"
        },
        {
            "name": "H&M",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg"
        },
        {
            "name": "Uniqlo",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg"
        },
        {
            "name": "Gucci",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gucci_logo.svg/960px-Gucci_logo.svg.png"
        },
        {
            "name": "Louis Vuitton",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/7/76/Louis_Vuitton_logo_and_wordmark.svg"
        },
        {
            "name": "Dior",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/960px-Dior_Logo.svg.png"
        }
    ]

    for brand in brands:
        response = safe_post(BRAND_API, brand)

        if response.status_code in [200, 201]:
            print(f"✅ Created brand: {brand['name']}")
        else:
            print(f"❌ Failed: {brand['name']}")
            print(response.text)

        time.sleep(0.2)

    print("\n🎉 DONE! Brands seeded successfully.")


if __name__ == "__main__":
    main()