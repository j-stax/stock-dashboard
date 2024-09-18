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

function Dashboard() {
    const [tickerInput, setTickerInput] = useState("PLTR");
    const [priceData, setPriceData] = useState([]);
    const [ebitData, setEbitData] = useState([]);
    const [workingCapData, setWorkingCapData] = useState([]);
    const [capexData, setCapexData] = useState([]);
    const [responseOk, setResponseOk] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setResponseOk(false);
        setTickerInput(event.target.ticker.value.trim().toUpperCase());
    }

    useEffect( () => {
        async function getStockData() {
            try {
                if (tickerInput) {
                    setIsLoading(true);            
                    const priceDataResponse = await FetchData(tickerInput, "price");
                    const ebitDataResponse = await FetchData(tickerInput, "ebit");
                    const workingCapDataResponse = await FetchData(tickerInput, "working capital");
                    const capexDataResponse = await FetchData(tickerInput, "capex");

                    setIsLoading(false);
                    if (priceDataResponse !== null) {
                        setPriceData(priceDataResponse);
                        setEbitData(ebitDataResponse);
                        setWorkingCapData(workingCapDataResponse);
                        setCapexData(capexDataResponse);
                        setResponseOk(true);
                    }
                    else {
                        alert(`Error: check ticker symbol.`);
                    }
                }    
                else {
                    alert("Enter a ticker.");
                }
            }
            catch (exception) {
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
                                <WorkingCapBarChart ticker={tickerInput} data={[...workingCapData].reverse()} />
                            </Col>
                            <Col>
                                <CapexBarChart ticker={tickerInput} data={[...capexData].reverse()} />
                            </Col>
                        </Row>
                    </Container>
                    <DCFModel shares={workingCapData[0].shares} />
                </>
            }
        </Container>
    );
}

export default Dashboard;