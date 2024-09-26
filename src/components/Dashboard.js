import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Spinner } from "react-bootstrap";
import Charts from "./Charts";
import FetchData from "../utils/API";
import DCFModel from "./DCFModel";
import TickerBanner from "./TickerBanner";
import NewsList from "./NewsList";

function Dashboard() {
    const [tickerInput, setTickerInput] = useState("NVDA");
    const [balanceSheetData, setBalanceSheetData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [ebitData, setEbitData] = useState([]);
    const [workingCapData, setWorkingCapData] = useState([]);
    const [capexData, setCapexData] = useState([]);
    const [deprecAndAmortData, setDeprecAndAmortData] = useState([]);
    const [responseOk, setResponseOk] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setResponseOk(false);
        const input = event.target.ticker.value.trim().toUpperCase();
        const tickerInputPrev = tickerInput;
        if ((input.length !== 0) && (input !== tickerInput) && (input !== tickerInputPrev)) {
            setTickerInput(input);
        }
        else {
            alert("Enter a new ticker.");
        }
    }

    useEffect( () => {
        async function fetchStockData() {
            setIsLoading(true);            
            const priceDataResponse = await FetchData(tickerInput, "price");
            const ebitDataResponse = await FetchData(tickerInput, "ebit");
            const deprecAndAmortResponse = await FetchData(tickerInput, "deprecAndAmortization");
            const workingCapDataResponse = await FetchData(tickerInput, "working capital");
            const capexDataResponse = await FetchData(tickerInput, "capex");
            const balanceSheetDataResponse = await FetchData(tickerInput, "balance sheet");
            setIsLoading(false);

            if (priceDataResponse && balanceSheetDataResponse ) {
                setPriceData(priceDataResponse);
                setEbitData(ebitDataResponse);
                setDeprecAndAmortData(deprecAndAmortResponse);
                setCapexData(capexDataResponse);
                setWorkingCapData(workingCapDataResponse);
                setBalanceSheetData(balanceSheetDataResponse);
                setResponseOk(true);
            }
            else {
                alert(`Error fetching data. Check ticker symbol.`);
            }
        }

        fetchStockData();
    },  [tickerInput]);

    return (
        <Container>
            <TickerBanner />
            <Form onSubmit={handleSubmit} className="mt-5 text-center">
                <Form.Control 
                    type="text" 
                    id="ticker" 
                    placeholder="Enter ticker (e.g., PLTR)"
                    autoFocus
                    className="w-25 d-inline mt-5 mb-5 text-uppercase" />
                <Button type="submit" className="ms-2">Search</Button>
            </Form>
            {isLoading && 
                <div className="text-center mt-5">
                    <Spinner animation="border" role="status" className="">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
            {responseOk && 
                <>
                    <Charts 
                        ticker={tickerInput} 
                        priceData={priceData} 
                        ebitData={ebitData} 
                        deprecAndAmortData={deprecAndAmortData} 
                        capexData={capexData} 
                        workingCapData={workingCapData} />
                    <NewsList ticker={tickerInput} />
                    <DCFModel cash={balanceSheetData[0]} debt={balanceSheetData[1]} shares={balanceSheetData[2]} />
                </>
            }
        </Container>
    );
}

export default Dashboard;
