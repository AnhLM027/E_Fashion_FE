import requests
import time

# ==============================
# CONFIG
# ==============================

BASE_URL = "http://localhost:8080"

LOGIN_URL = f"{BASE_URL}/api/auth/login"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"
CATEGORY_API = f"{BASE_URL}/api/admin/categories"

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
        print("Status:", response.status_code)
        print("Response:", response.text)
        return None

    category_id = response.json()["id"]
    print(f"✅ Created: {name}")
    return category_id


# ==============================
# RECURSIVE TREE
# ==============================

def create_tree(parent_id, tree_dict):
    for name, data in tree_dict.items():
        image_url = data.get("imageUrl")
        children = data.get("children", {})

        new_id = create_category(name, parent_id, image_url)

        if new_id and children:
            create_tree(new_id, children)

        time.sleep(0.1)


# ==============================
# MAIN
# ==============================

def main():
    login()

    category_tree = {

        "Nam": {
            "imageUrl": "https://tiemchupanh.com/wp-content/uploads/2023/12/TCA_7104.jpg",
            "children": {
                "Quần áo": {
                    "imageUrl": "https://images.unsplash.com/photo-1516826957135-700dedea698c",
                    "children": {
                        "Áo": {
                            "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                            "children": {
                                "Áo thun": {"imageUrl": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a", "children": {}},
                                "Áo sơ mi": {"imageUrl": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c", "children": {}},
                                "Áo polo": {"imageUrl": "https://images.unsplash.com/photo-1622445275576-721325763afe", "children": {}},
                                "Áo len": {"imageUrl": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf", "children": {}},
                            }
                        },
                        "Quần": {
                            "imageUrl": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
                            "children": {
                                "Quần jean": {"imageUrl": "https://images.unsplash.com/photo-1542272604-787c3835535d", "children": {}},
                                "Quần short": {"imageUrl": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7", "children": {}},
                                "Quần kaki": {"imageUrl": "https://images.unsplash.com/photo-1506629905607-d405f1d1c9b1", "children": {}},
                            }
                        }
                    }
                },
                "Giày dép": {
                    "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                    "children": {
                        "Thể thao": {
                            "imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
                            "children": {
                                "Sneaker": {"imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519", "children": {}}
                            }
                        },
                        "Thời trang": {
                            "imageUrl": "https://images.unsplash.com/photo-1608256246200-53e8b47b5a08",
                            "children": {
                                "Boot": {"imageUrl": "https://images.unsplash.com/photo-1608256246200-53e8b47b5a08", "children": {}}
                            }
                        }
                    }
                }
            }
        },

        "Nữ": {
            "imageUrl": "https://cafefcdn.com/203337114487263232/2022/1/5/photo-1-1641349267968282067556.jpg",
            "children": {
                "Quần áo": {
                    "imageUrl": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
                    "children": {
                        "Áo": {
                            "imageUrl": "https://images.unsplash.com/photo-1520975928316-4f8b5f7b6f4a",
                            "children": {
                                "Áo thun": {"imageUrl": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b", "children": {}},
                                "Áo kiểu": {"imageUrl": "https://images.unsplash.com/photo-1503342217505-b0a15cf70489", "children": {}},
                            }
                        },
                        "Váy": {
                            "imageUrl": "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
                            "children": {
                                "Váy ngắn": {"imageUrl": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e", "children": {}},
                                "Váy dài": {"imageUrl": "https://images.unsplash.com/photo-1520974735194-8a8d0f9d0f02", "children": {}},
                            }
                        }
                    }
                },
                "Giày dép": {
                    "imageUrl": "https://images.unsplash.com/photo-1519741497674-611481863552",
                    "children": {
                        "Cao gót": {
                            "imageUrl": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
                            "children": {
                                "Giày cao gót": {"imageUrl": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2", "children": {}}
                            }
                        }
                    }
                }
            }
        },

        "Unisex": {
            "imageUrl": "https://canifa.com/blog/wp-content/uploads/2024/08/ao-thun-unisex-la-gi-5.webp",
            "children": {
                "Thời trang chung": {
                    "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                    "children": {
                        "Áo thun": {"imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", "children": {}},
                        "Hoodie": {"imageUrl": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf", "children": {}},
                    }
                },
                "Giày dép": {
                    "imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
                    "children": {
                        "Sneaker": {"imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519", "children": {}}
                    }
                }
            }
        },

        "Trẻ em": {
            "imageUrl": "https://down-vn.img.susercontent.com/file/sg-11134201-7rd63-m6wkugq8kt2h20.webp",
            "children": {
                "Quần áo trẻ em": {
                    "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba",
                    "children": {
                        "Áo thun": {"imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba", "children": {}},
                        "Hoodie": {"imageUrl": "https://images.unsplash.com/photo-1544441893-675973e31985", "children": {}},
                    }
                },
                "Giày dép trẻ em": {
                    "imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
                    "children": {
                        "Sneaker": {"imageUrl": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519", "children": {}}
                    }
                }
            }
        },
    }

    for root_name, data in category_tree.items():
        root_image = data.get("imageUrl")
        children = data.get("children", {})

        root_id = create_category(root_name, image_url=root_image)

        if root_id:
            create_tree(root_id, children)

        time.sleep(0.2)

    print("\n🎉 DONE! Category tree created.")


if __name__ == "__main__":
    main()
    
    
