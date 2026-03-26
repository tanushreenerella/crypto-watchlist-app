import requests
import logging

logging.basicConfig(level=logging.INFO)

URL = "https://api.coingecko.com/api/v3/simple/price"

def get_coin_price(coin: str):
    for attempt in range(3):   # retry 3 times
        try:
            logging.info(f"Attempt {attempt+1} for {coin}")

            response = requests.get(
                URL,
                params={"ids": coin, "vs_currencies": "usd"},
                timeout=5
            )

            data = response.json()
            return data[coin]["usd"]

        except requests.exceptions.Timeout:
            logging.warning("Retrying due to timeout...")

    logging.error("Failed after retries")
    return None