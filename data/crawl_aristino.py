from seleniumbase import SB
import json
import time
import re

BASE_URL = "https://aristino.com"
COLLECTION_URL = "https://aristino.com/collections/vi-da"

products_data = []

def convert_price(price_text):
    numbers = re.sub(r"[^\d]", "", price_text)
    return int(numbers) if numbers else 0

with SB(browser="chrome", headless=False) as sb:
    sb.open(COLLECTION_URL)
    sb.wait_for_element(".grid-products")

    print("🔄 Đang scroll load sản phẩm...")

    # Scroll load hết sản phẩm
    last_height = sb.execute_script("return document.body.scrollHeight")
    while True:
        sb.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = sb.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    print("✅ Đã load xong")

    # ✅ CHỈ LẤY LINK trước
    product_links = []
    items = sb.find_elements(".pro-loop--title a")

    for item in items:
        link = item.get_attribute("href")
        if link and link not in product_links:
            product_links.append(link)

    print(f"📦 Tổng link sản phẩm: {len(product_links)}")

    # 🔥 Duyệt từng link (KHÔNG bị stale)
    for index, link in enumerate(product_links):
        try:
            print(f"🔎 Đang crawl ({index+1}/{len(product_links)})")

            sb.open(link)
            sb.wait_for_element(".productdetail--row")

            title = sb.find_element("css selector", "h1").text.strip()

            price_text = sb.find_element("css selector", ".pr-price .price").text.strip()
            price = convert_price(price_text)

            image_elements = sb.find_elements("css selector", ".pr-gallery--item a")
            images = []

            for img in image_elements:
                img_url = img.get_attribute("href")
                if img_url and img_url not in images:
                    images.append(img_url)

            products_data.append({
                "title": title,
                "price": price,
                "price_text": price_text,
                "thumbnail": images[0] if images else None,
                "images": images,
                "link": link
            })

        except Exception as e:
            print("❌ Lỗi:", e)

# 🔥 Lưu JSON
output_data = {
    "brand": "Aristino",
    "collection": "vi-da",
    "total": len(products_data),
    "data": products_data
}

with open("vi-da.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=4)

print("🎉 Đã lưu file vi-da.json")
