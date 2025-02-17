import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd


def get_available_platforms(game_base_url):
    """Finds all available platforms for a game."""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )
    driver.get(game_base_url)

    # Get full page source
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    platforms = []

    # Locate the dropdown menu containing platform options
    platform_select = soup.find("select", {"name": "Platforms"})
    if platform_select:
        for option in platform_select.find_all("option"):
            platform_slug = option.get(
                "value"
            ).strip()  # Get the URL-friendly platform name
            platform_name = option.text.strip()  # Get the readable platform name
            if platform_slug and platform_name:
                platforms.append((platform_name, platform_slug))

    return platforms


def get_all_metacritic_reviews(game_url, platform, review_type):
    """Scrapes all reviews for a given game, platform, and review type."""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )
    driver.get(game_url)

    # Simulate scrolling to load all reviews
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
        time.sleep(2)  # Allow time for loading

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Get full page source after scrolling
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    # Extract review data
    reviews = []
    for review in soup.find_all("div", class_="c-siteReview"):
        score = (
            review.find("div", class_="c-siteReviewScore").find("span").text.strip()
            if review.find("div", class_="c-siteReviewScore")
            and review.find("div", class_="c-siteReviewScore").find("span")
            else "No Score"
        )
        date = (
            review.find("div", class_="c-siteReviewHeader_reviewDate").text.strip()
            if review.find("div", class_="c-siteReviewHeader_reviewDate")
            else "No Date"
        )
        text = (
            review.find("div", class_="c-siteReview_quote").find("span").text.strip()
            if review.find("div", class_="c-siteReview_quote")
            and review.find("div", class_="c-siteReview_quote").find("span")
            else "No Review Text"
        )
        if review_type == "user":
            username = (
                review.find("a", class_="c-siteReviewHeader_username").text.strip()
                if review.find("a", class_="c-siteReviewHeader_username")
                else "No Username"
            )
        else:
            username = (
                review.find(
                    "a", class_="c-siteReviewHeader_publicationName"
                ).text.strip()
                if review.find("a", class_="c-siteReviewHeader_publicationName")
                else "No Username"
            )
        reviews.append(
            {
                "platform": platform,
                "review_type": review_type,
                "username": username,
                "score": score,
                "date": date,
                "review": text,
            }
        )

    return reviews


def generate_metacritic_urls(game_names):
    """Generates Metacritic base URLs for each game."""
    base_url = "https://www.metacritic.com/game/"
    return {game: f"{base_url}{game}/" for game in game_names}


def scrape_multiple_games(game_names, output_folder="metacritic_reviews"):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    game_urls = generate_metacritic_urls(game_names)

    for game, base_url in game_urls.items():
        print(f"Finding platforms for: {game}")
        platforms = get_available_platforms(f"{base_url}critic-reviews/")

        all_reviews = []
        for platform_name, platform_slug in platforms:
            critic_url = f"{base_url}critic-reviews/?platform={platform_slug}"
            user_url = f"{base_url}user-reviews/?platform={platform_slug}"

            print(f"Scraping {platform_name} - Critic Reviews for: {game}")
            try:
                reviews = get_all_metacritic_reviews(
                    critic_url, platform_name, "critic"
                )
                all_reviews.extend(reviews)
            except Exception as e:
                print(f"Error scraping {platform_name} critic reviews for {game}: {e}")

            print(f"Scraping {platform_name} - User Reviews for: {game}")
            try:
                reviews = get_all_metacritic_reviews(user_url, platform_name, "user")
                all_reviews.extend(reviews)
            except Exception as e:
                print(f"Error scraping {platform_name} user reviews for {game}: {e}")

        output_csv = os.path.join(output_folder, f"{game}.csv")
        output_xlsx = os.path.join(output_folder, f"{game}.xlsx")

        df = pd.DataFrame(all_reviews)
        df.to_csv(output_csv, index=False, encoding="utf-8")
        df.to_excel(output_xlsx, index=False)

        if df.empty:
            print(
                f"No reviews found for {game}. CSV and XLSX created with only headers."
            )

        print(f"Saved {game} reviews to {output_csv}")


game_names = ["sid-meiers-civilization-vii"]

mixed_game_names = [
    # "cyberpunk-2077",
    # "alpha-protocol",
    # "sea-of-thieves",
    # "fallout-76",
    # "total-war-rome-ii",
    # "days-gone",
    # "wildfrost",
    # "final-fantasy-xiv-online",
    # "warhammer-40000-darktide",
    # "battlefield-2",
    "wasteland-3",
]

scrape_multiple_games(mixed_game_names)
