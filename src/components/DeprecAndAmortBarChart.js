import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React from "react";
import { Container } from "react-bootstrap";

Chart.register(CategoryScale);

function DeprecAndAmortBarChart(props) {

    const chartData = {
        labels: props.data.map((data) => data.year),
        datasets: [
            {
                label: "Depreciation and Amortization",
                data: props.data.map((data) => data.value),
                backgroundColor: "cyan"
            }
        ]
    };

    return (
        <Container>
            <Bar 
                data={chartData}
                height={"200px"}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Depreciation and Amortization"
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Year"
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "$Millions"
                            }
                        }
                    }
                }}
            />
        </Container>
    );
}

export default DeprecAndAmortBarChart;