import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactTicker } from "@guna81/react-ticker";

function TickerBanner() {
    const [bannerDataList, setBannerDataList] = useState([
        { id: 1, symbol: "NVDA", price: "" },
        { id: 2, symbol: "AMD", price: "" },
        { id: 3, symbol: "TSLA", price: "" },
        { id: 4, symbol: "UBER", price: "" },
        { id: 5, symbol: "AAPL", price: "" },
        { id: 6, symbol: "PLTR", price: "" },
        { id: 7, symbol: "META", price: "" },
        { id: 8, symbol: "GOOGL", price: "" },
        { id: 9, symbol: "AMZN", price: "" },
        { id: 10, symbol: "MSFT", price: "" },
        { id: 11, symbol: "USD/CAD", price: "" },
        { id: 12, symbol: "USD/JPY", price: "" },
        { id: 13, symbol: "EUR/CAD", price: "" },
        { id: 14, symbol: "GBP/CAD", price: "" },
        { id: 15, symbol: "BTC", price: "" }
    ]);

    async function getExchangeRate(pair, apiKey) {
        const numer = pair.substring(0, 3);
        const denom = pair.substring(4);
        const forexUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_symbol=${numer}&to_symbol=${denom}&interval=5min&apikey=${apiKey}`;
        const forexResponse = await fetch(forexUrl);
        if (forexResponse.ok) {
            const forexResult = await forexResponse.json();
            // const lastRefreshed = forexResult["Meta Data"]["4. Last Refreshed"];
            let exchRate = forexResult["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
            exchRate = parseFloat(exchRate).toFixed(3).toString();
            return exchRate;
        }   
        return null;
    }

    useEffect(() => {
        async function fetchTickerData() {
            const apiKey = "ZMU4WUWQX0PWD2YJ";
            const btcUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${apiKey}`;
            let updatedBannerDataList = [...bannerDataList];

            for (let i = 0; i < bannerDataList.length; i++) {
                let bannerDataListObject = bannerDataList[i];
                let symbol = bannerDataListObject.symbol;
                let stockUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
                let lastRefreshed = "";

                switch (symbol) {
                    case "USD/CAD":
                        updatedBannerDataList[i].price = await getExchangeRate(symbol, apiKey);
                        break;

                    case "USD/JPY":
                        updatedBannerDataList[i].price = await getExchangeRate(symbol, apiKey);
                        break;

                    case "EUR/CAD":
                        updatedBannerDataList[i].price = await getExchangeRate(symbol, apiKey);
                        break;

                    case "GBP/CAD":
                        updatedBannerDataList[i].price = await getExchangeRate(symbol, apiKey);
                        break;

                    case "BTC":
                        let btcResponse = await fetch(btcUrl);
                        let btcResult = await btcResponse.json();
                        lastRefreshed = btcResult["Realtime Currency Exchange Rate"];
                        let btcPrice = btcResult["5. Exchange Rate"];
                        updatedBannerDataList[i].price = parseInt(btcPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        break;

                    default:
                        let stockResponse = await fetch(stockUrl);
                        let result = await stockResponse.json();
                        lastRefreshed = result["Meta Data"]["3. Last Refreshed"];
                        let priceMap = result["Time Series (Daily)"];
                        let price = priceMap[lastRefreshed]["4. close"];
                        updatedBannerDataList[i].price = parseFloat(price).toFixed(2).toString();
                }
            };
            setBannerDataList(updatedBannerDataList);
        }
        
        // setInterval(fetchTickerData, 10000);
        fetchTickerData();
    }, []); 

    const renderItem = (item) => {
        return (
            <p
                style={{
                    whitespace: "nowrap",
                    color: "#39FF14",
                    fontSize: "18px",
                    paddingTop: "12px",
                }}
            >
                {`${item.symbol} ${item.price}`}
            </p>
        );
    };

    return (
        <Container>
            <ReactTicker 
                data={bannerDataList}
                component={renderItem}
                speed={55}
                keyName="_id"
                tickerStyle={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#000000",
                    zIndex: 99
                }}
                className="mb-1"
            />
        </Container>
    );
}

export default TickerBanner;