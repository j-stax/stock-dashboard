import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import LineChartData from '../utils/FAKE_DATA';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

function LineGraphExample() {
    const options = {};

    return (
        <Line options={options} data={LineChartData} />
    );
}

export default LineGraphExample;
