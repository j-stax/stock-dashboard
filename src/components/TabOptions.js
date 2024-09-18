import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import StockDashboard from "./Dashboard";

function TabOptions() {
    return (
        <Tabs
            defaultActiveKey="dashboard"
            id="tabOptions"
            className='mb-3'
        >
            <Tab eventKey="dashboard" title="Stock Dashboard">
                <StockDashboard />
            </Tab>
            <Tab eventKey="tab-2" title="Tab 2">
                This is Tab 2
            </Tab>
            <Tab eventKey="tab-3" title="Tab 3">
                This is Tab 3
            </Tab>
        </Tabs>
    );
}

export default TabOptions;