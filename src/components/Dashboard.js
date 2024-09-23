import {useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Spinner } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PriceLineChart from "./PriceLineChart";
import EbitBarChart from "./EbitBarChart";
import WorkingCapBarChart from "./WorkingCapBarChart";
import CapexBarChart from "./CapexBarChart";
import FetchData from "../utils/API";
import DCFModel from "./DCFModel";
import TickerBanner from "./TickerBanner";
import NewsList from "./NewsList";

function Dashboard() {
    const [tickerInput, setTickerInput] = useState("NVDA");
    const [priceData, setPriceData] = useState([]);
    const [ebitData, setEbitData] = useState([]);
    const [balanceSheetData, setBalanceSheetData] = useState([]);
    const [capexData, setCapexData] = useState([]);
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
        async function getStockData() {
            try {
                setIsLoading(true);            
                const priceDataResponse = await FetchData(tickerInput, "price");
                const ebitDataResponse = await FetchData(tickerInput, "ebit");
                const balanceSheetDataResponse = await FetchData(tickerInput, "balance sheet");
                const capexDataResponse = await FetchData(tickerInput, "capex");   

                setIsLoading(false);
                if (priceDataResponse && ebitDataResponse) {
                    setPriceData(priceDataResponse);
                    setEbitData(ebitDataResponse);
                    setBalanceSheetData(balanceSheetDataResponse);
                    setCapexData(capexDataResponse);
                    setResponseOk(true);
                }
                else {
                    alert(`Error: Check ticker symbol.`);
                }
            }
            catch (exception) {
                alert(`Catch Error: check ticker symbol.`);
                console.log(exception);             
            }
        }

        getStockData();
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
                    <Container className="mb-5">
                        <h1 className="display-5 mb-4">Financial Data</h1>
                        <Row>
                            <Col>
                                <PriceLineChart ticker={tickerInput} data={[...priceData].reverse()} />
                            </Col>
                            <Col>
                                <EbitBarChart ticker={tickerInput} data={[...ebitData].reverse()} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <WorkingCapBarChart ticker={tickerInput} data={[...balanceSheetData].reverse()} />
                            </Col>
                            <Col>
                                <CapexBarChart ticker={tickerInput} data={[...capexData].reverse()} />
                            </Col>
                        </Row>
                    </Container>
                    <NewsList ticker={tickerInput} />
                    <DCFModel cash={balanceSheetData[0].cash} debt={balanceSheetData[0].debt} shares={balanceSheetData[0].shares} />
                </>
            }
        </Container>
    );
}

export default Dashboard;
