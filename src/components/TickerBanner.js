import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactTicker } from "@guna81/react-ticker";

function TickerBanner() {
    const [bannerDataList, setBannerDataList] = useState([
        { id: 1, symbol: "USD/CAD", price: "" },
        { id: 2, symbol: "BTC", price: "" },
        { id: 3, symbol: "NVDA", price: "" },
        { id: 4, symbol: "AMD", price: "" },
        { id: 5, symbol: "PLTR", price: "" },
        { id: 6, symbol: "META", price: "" },
        { id: 7, symbol: "AAPL", price: "" },
        { id: 8, symbol: "GOOGL", price: "" },
        { id: 9, symbol: "TSLA", price: "" },
        { id: 10, symbol: "QXO", price: "" }
    ]);

    useEffect(() => {
        async function fetchTickerData() {

            const apiKey = "Y7I5R3PL5KTSMQB2";
            const forexUrl = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=USD&to_symbol=CAD&interval=5min&apikey=${apiKey}`;
            const btcUrl = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC&market=USD&interval=5min&apikey=${apiKey}`;
            let updatedBannerDataList = [...bannerDataList];

            for (let i = 0; i < bannerDataList.length; i++) {
                let bannerDataListObject = bannerDataList[i];
                let symbol = bannerDataListObject.symbol;
                let stockUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&entitlement=delayed&apikey=${apiKey}`;

                if (symbol === "USD/CAD") {
                    let forexResponse = await fetch(forexUrl);
                    let forexResult = await forexResponse.json();
                    let lastRefreshed = forexResult["Meta Data"]["4. Last Refreshed"];
                    let exchRate = forexResult["Time Series FX (5min)"][lastRefreshed]["4. close"];
                    updatedBannerDataList[i].price = parseFloat(exchRate).toFixed(2).toString();
                }
                else if (symbol === "BTC") {
                    let btcResponse = await fetch(btcUrl);
                    let btcResult = await btcResponse.json();
                    let lastRefreshed = btcResult["Meta Data"]["6. Last Refreshed"];
                    let btcPrice = btcResult["Time Series Crypto (5min)"][lastRefreshed]["4. close"];
                    updatedBannerDataList[i].price = parseFloat(btcPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else {
                    let stockResponse = await fetch(stockUrl);
                    let result = await stockResponse.json();
                    let lastRefreshed = result["Meta Data"]["3. Last Refreshed"];
                    let priceMap = result["Time Series (5min)"];
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
                    height: "50px",
                    backgroundColor: "#000000",
                    zIndex: 99
                }}
                className="mb-1"
            />
        </Container>
    );
}

export default TickerBanner;