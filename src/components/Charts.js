import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import PriceLineChart from "./PriceLineChart";
import EbitBarChart from "./EbitBarChart";
import CapexBarChart from "./CapexBarChart";
import WorkingCapBarChart from "./WorkingCapBarChart";
import DeprecAndAmortBarChart from "./DeprecAndAmortBarChart";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Charts(props) {
    const ticker = props.ticker;
    const [priceData, setPriceData] = useState([]);
    const [ebitData, setEbitData] = useState([]);
    const [deprecAndAmortData, setDeprecAndAmortData] = useState([]);
    const [workingCapData, setWorkingCapData] = useState([]);
    const [capexData, setCapexData] = useState([]);

    useEffect( () => {
        async function fetchChartData() {
            setPriceData(props.priceData);
            setEbitData(props.ebitData);
            setDeprecAndAmortData(props.deprecAndAmortData);
            setWorkingCapData(props.workingCapData);
            setCapexData(props.capexData);
        }

        fetchChartData();
    }, [ticker]);
    
    return (
        <Container fluid className="mb-5">
            <h1 className="display-5 mb-4">{ticker} Historical Financial Data</h1>
            <Row>
                <Col>
                    <PriceLineChart ticker={ticker} data={[...priceData].reverse()} />
                </Col>
                <Col>
                    <EbitBarChart data={[...ebitData].reverse()} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DeprecAndAmortBarChart data={[...deprecAndAmortData].reverse()} />
                </Col>
                <Col>
                    <WorkingCapBarChart data={[...workingCapData].reverse()} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CapexBarChart data={[...capexData].reverse()} />
                </Col>
                <Col>
                </Col>
            </Row>
        </Container>
    );
}

export default Charts;