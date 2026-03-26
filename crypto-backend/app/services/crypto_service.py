import requests

def get_coin_price(coin: str):
    try:
        coin = coin.lower().strip()

        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": coin,
            "vs_currencies": "usd"
        }

        response = requests.get(url, params=params, timeout=5)

        if response.status_code == 429:
            print("RATE LIMITED 🚫")
            return None

        if response.status_code != 200:
            return None

        data = response.json()

        if coin not in data:
            return None

        return data[coin]["usd"]

    except Exception as e:
        print("ERROR:", e)
        return None