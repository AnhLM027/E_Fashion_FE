import json
import requests
import time
import uuid
import random
import re

# ==============================
# CONFIG
# ==============================

JSON_FILE = "vi-da.json"

EMAIL = "ad@gmail.com"
PASSWORD = "123456"

BASE_URL = "http://localhost:8080"

LOGIN_URL = f"{BASE_URL}/api/auth/login"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"

CATEGORY_API = f"{BASE_URL}/api/admin/categories"
BRAND_API = f"{BASE_URL}/api/admin/brands"
PRODUCT_API = f"{BASE_URL}/api/admin/products"
COLOR_API = f"{BASE_URL}/api/admin/colors"
VARIANT_API = f"{BASE_URL}/api/admin/product-variants"
VARIANT_SIZE_API = f"{BASE_URL}/api/admin/product-variant-sizes"
VARIANT_IMAGE_API_TEMPLATE = f"{BASE_URL}/api/admin/product-variants/{{variantId}}/images"

AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"]

def safe_get(url):
    response = session.get(url)

    if response.status_code == 401:
        print("⚠️ Token expired → Refreshing...")
        refresh_token()
        response = session.get(url)

    return response

def load_colors_from_api():
    response = safe_get(COLOR_API)

    if response.status_code != 200:
        print("❌ Cannot fetch colors")
        exit()

    colors = response.json()

    if not colors:
        print("❌ No colors found in DB")
        exit()

    # Build dict: { id: name }
    color_map = {c["id"]: c["name"] for c in colors}

    print(f"🎨 Loaded {len(color_map)} colors from API")

    return color_map

def load_categories_from_api():
    response = safe_get(CATEGORY_API)

    if response.status_code != 200:
        print("❌ Cannot fetch categories")
        exit()

    categories = response.json()

    if not categories:
        print("❌ No categories found in DB")
        exit()

    print(f"📂 Loaded {len(categories)} categories from API")

    return categories


def load_brands_from_api():
    response = safe_get(BRAND_API)

    if response.status_code != 200:
        print("❌ Cannot fetch brands")
        exit()

    brands = response.json()

    if not brands:
        print("❌ No brands found in DB")
        exit()

    print(f"🏷️ Loaded {len(brands)} brands from API")

    return brands

SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"]
SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44"]

BASE_PRODUCT_CODE = 1

session = requests.Session()
session.headers.update({
    "Content-Type": "application/json"
})

def detect_product_type(name):
    name = name.lower()
    if "giày" in name or "shoe" in name:
        return "SHOE"
    return "TSHIRT"


def generate_product_code(name):
    cleaned = re.sub(r'[^A-Za-z0-9]', '', name.upper())
    return cleaned[:6]


def get_sizes_by_type(product_type):
    if product_type == "SHOE":
        return SHOE_SIZES
    return SHIRT_SIZES


def get_price_by_size(base_price, size):
    # Size càng lớn càng đắt
    size_price_map = {
        "S": 0,
        "M": 0,
        "L": 10000,
        "XL": 20000,
        "XXL": 30000,
        "38": 0,
        "39": 10000,
        "40": 20000,
        "41": 30000,
        "42": 40000,
        "43": 50000,
        "44": 60000,
    }

    return base_price + size_price_map.get(size, 0)

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
# LOAD JSON
# ==============================

with open(JSON_FILE, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

products = raw_data["data"]
print(f"Found {len(products)} products")

def get_leaf_nodes(categories):
    leaves = []

    def dfs(node, depth=0):
        children = node.get("children", [])

        if not children and depth > 0:
            leaves.append(node)
        else:
            for child in children:
                dfs(child, depth + 1)

    for root in categories:
        dfs(root)

    return leaves

# ==============================
# MAIN FLOW
# ==============================

login()

import json

data = json.load(open("..\\scripts\\categories.json", "r", encoding="utf-8"))
# api_categories = load_categories_from_api()
# print(api_categories[0])
CATEGORIES = get_leaf_nodes(data)
BRANDS = load_brands_from_api()
COLOR_MAP = load_colors_from_api()

# print(CATEGORIES)

# for leaf in CATEGORIES:
#     print(leaf["name"], leaf["slug"])

DESCRIPTION = """### TÊN SẢN PHẨM
Quần Jeans Nam Hiệu Ứng Giặt Mài Aristino AJN2110S0
### MÃ RÚT GỌN
AJN2110S0
### FORM DÁNG
Dáng ôm / Slim fit
### THIẾT KẾ
Quần jeans phom slim fit với độ ôm vừa vặn giúp tôn dáng đôi chân mà vẫn thoải mái vận động.
Quần có túi xẻ 2 bên và túi sau tiện lợi.
Nút quần được thiết kế mang biểu tượng "Mặt trời huyền thoại" toả sáng với 12 tia rực rỡ.
### CHẤT LIỆU
99% Cotton giúp quần mềm mại, xốp nhẹ và thoáng khí  
1% Spandex tạo sự co giãn
### MÀU SẮC
Xám 38
### SIZE
29/30/31/32/33/34/35
### SẢN XUẤT
Việt Nam
### HƯỚNG DẪN GIẶT ỦI
Giặt: Giặt bằng nước lạnh hoặc nước ấm nhẹ (dưới 30°C). Giặt riêng biệt với các màu sắc khác để tránh bị phai màu.
Phơi: Phơi ở nơi thoáng mát, tránh ánh nắng trực tiếp để không làm phai màu và giữ độ bền của vải.
Ủi: Ủi ở nhiệt độ thấp hoặc sử dụng chế độ ủi vải polyester trên bàn là để tránh làm hỏng bề mặt vải.
Chất tẩy: Hạn chế sử dụng chất tẩy mạnh. Sử dụng chất tẩy nhẹ nếu cần để bảo vệ vải và giữ độ mới lâu dài.
### LƯU Ý
Lưu ý: Hình ảnh chỉ mang tính chất minh họa. Sản phẩm thực tế có thể khác về màu sắc so với hình ảnh minh họa do ánh sáng khi chụp ảnh hoặc do màn hình hiển thị trên thiết bị của khách hàng.
"""


for idx, item in enumerate(products, start=1):

    # ================= PRODUCT =================
    product_type = detect_product_type(item["title"])
    random_category = random.choice(CATEGORIES)
    random_brand = random.choice(BRANDS)

    CATEGORY_ID = random_category["id"]
    BRAND_ID = random_brand["id"]

    product_payload = {
        "name": item["title"],
        "description": DESCRIPTION,
        "categoryId": CATEGORY_ID,
        "brandId": BRAND_ID,
        "thumbnailUrl": item["thumbnail"],
        "isActive": True
    }

    product_response = safe_post(PRODUCT_API, product_payload)

    if product_response.status_code not in [200, 201]:
        print(f"❌ Failed create product: {item['title']}")
        continue

    product_id = product_response.json()["id"]
    print(f"✅ [{idx}] Product created: {item['title']}")

    # ================= RANDOM VARIANTS =================

    product_type = detect_product_type(item["title"])
    available_sizes = get_sizes_by_type(product_type)

    num_variants = random.randint(1, 3)  # mỗi product có 1-3 color variant

    for v_index in range(num_variants):

        color_id = random.choice(list(COLOR_MAP.keys()))
        color_code = COLOR_MAP[color_id]

        variant_payload = {
            "productId": product_id,
            "colorId": color_id,
            "isActive": True
        }

        variant_response = safe_post(VARIANT_API, variant_payload)

        if variant_response.status_code not in [200, 201]:
            print("❌ Failed create variant")
            continue

        variant_id = variant_response.json()["id"]
        print(f"   ➜ Variant {v_index+1} created")
        
        # ================= IMAGES (MOVE HERE) =================
        images = item.get("images", [])
        image_api_url = VARIANT_IMAGE_API_TEMPLATE.format(variantId=variant_id)

        for i, image_url in enumerate(images):
            image_payload = {
                "imageUrl": image_url,
                "isPrimary": i == 0,
                "sortOrder": i
            }

            image_response = safe_post(image_api_url, image_payload)

            if image_response.status_code in [200, 201]:
                print(f"   ➜ Image {i+1} created")
            else:
                print(f"   ❌ Failed image {i+1}")

            time.sleep(0.05)

        # Random 1 số variant hết hàng
        variant_out_of_stock = random.random() < 0.2  # 20% chance hết hàng

        num_sizes = random.randint(1, len(available_sizes))
        selected_sizes = random.sample(available_sizes, num_sizes)

        for s_index, size_name in enumerate(selected_sizes, start=1):

            base_price = item.get("price", 199000)
            original_price = get_price_by_size(base_price, size_name)

            discount_percent = random.randint(0, 15)
            sale_price = int(original_price * (100 - discount_percent) / 100)

            stock = 0 if variant_out_of_stock else random.randint(5, 100)

            # product_code = generate_product_code(item["title"])

            sku = f"{product_type}-{color_code}-{size_name}-{str(idx).zfill(3)}{str(s_index).zfill(2)}"

            size_payload = {
                "productVariantId": variant_id,
                "sizeName": size_name,
                "sku": sku,
                "originalPrice": original_price,
                "salePrice": sale_price,
                "stock": stock
            }

            size_response = safe_post(VARIANT_SIZE_API, size_payload)

            if size_response.status_code in [200, 201]:
                print(f"      ➜ Size {size_name} | SKU: {sku} | Stock: {stock}")
            else:
                print(f"      ❌ Failed create size {size_name}")
                print("         ➜ Status:", size_response.status_code)
                print("         ➜ Response:", size_response.text)

    time.sleep(0.2)

print("🎉 Done!")