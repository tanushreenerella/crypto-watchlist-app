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

        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        if response.status_code != 200:
            return None

        data = response.json()

        if coin not in data:
            return None

        return data[coin]["usd"]

    except Exception as e:
        print("ERROR FETCHING COIN:", e)
        return None