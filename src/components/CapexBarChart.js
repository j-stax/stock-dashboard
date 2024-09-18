import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React from "react";
import { Container } from "react-bootstrap";

Chart.register(CategoryScale);

function CapexBarChart(props) {

    const chartData = {
        labels: props.data.map((data) => data.year),
        datasets: [
            {
                label: "CAPEX $Millions",
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
                            text: "CAPEX"
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

export default CapexBarChart;