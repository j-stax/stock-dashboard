import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React from "react";
import { Container } from "react-bootstrap";

Chart.register(CategoryScale);

function PriceLineChart(props) {

    const chartData = {
        labels: props.data.map((data) => data.date),
        datasets: [
            {
                label: "Price",
                data: props.data.map((data) => data.value),
                borderColor: "black"
            }
        ]
    };

    return (
        <Container>
            <Line 
                data={chartData}
                height={"200px"}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${props.ticker} Stock Chart (TTM)`
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Month"
                                // color: some color
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Price"
                                // color: some color
                            }
                        }
                    }
                }}
            />
        </Container>
    );
}

export default PriceLineChart;