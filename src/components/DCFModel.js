import Table from "react-bootstrap/Table";
import { Container } from "react-bootstrap";
import { useState } from "react";

function DCFModel(props) {

    const [assumps, setAssumps] = useState({});
    const [yearZeroVals, setYearZeroVals] = useState({ 
        cash: props.cash,
        debt: props.debt,
        numShares: props.shares,
    });
    const [forecastVals, setForecastVals] = useState({});

    function handleAssumpChange(event) {
        const name = event.target.name;
        const value = parseInt(event.target.value);
        setAssumps(values => ({...values, [name]: value}));
    }

    function handleYearZeroChange(event) {
        const name = event.target.name;
        const value = parseInt(event.target.value);
        setYearZeroVals(values => ({...values, [name]: value}));
    }

    function handleForecastChange(event) {
        const name = event.target.id;
        const value = parseInt(event.target.value);
        setForecastVals(values => ({...values, [name]: value}));
    }

    function generateForecast(rowClass, year) {

        switch(rowClass) {
            case ("ebit"):
                const growtRate = parseFloat(assumps.growthRate/100);
                const ebitYearX = Math.round(yearZeroVals.ebit * (1 + growtRate) ** year);
                
                return ebitYearX;

            case ("taxes"):
                const taxRate = parseFloat(assumps.taxRate/100);
                const ebitForTaxes = "ebit" + year;
                const taxYearX = Math.round(forecastVals[ebitForTaxes] * taxRate);
                
                return taxYearX;

            case ("ebiat"):
                const ebitForEbiat = "ebit" + year;
                const taxesForEbiat = "taxes" + year;
                
                return forecastVals[ebitForEbiat] - forecastVals[taxesForEbiat];
            
            case ("fcf"):
                const ebiatIndex = "ebiat" + year;
                const deprecAndAmortIndex = "deprecAndAmort" + year;
                const chngInWorkingCapIndex = "chngInWorkingCap" + year;
                const capexIndex = "capex" + year;
                const fcfYearX = forecastVals[ebiatIndex] + forecastVals[deprecAndAmortIndex] 
                                    - forecastVals[chngInWorkingCapIndex] - forecastVals[capexIndex];

                return fcfYearX;

            case ("discountFactor"):
                let discFactor = 0;
                if (!assumps.discRate) {
                    return discFactor;
                }
                const discountRate = parseFloat(assumps.discRate/100);
                discFactor = (1 / ((1 + discountRate)**year)).toFixed(4);
                
                return discFactor;
            
            case ("discountFactor6"):
                let discFactor6 = 0;
                if (!assumps.terminalRate) {
                    return discFactor6;
                }
                const terminalRate = parseFloat(assumps.terminalRate/100);
                discFactor6 = 1 / (1 + terminalRate)**year;
                return discFactor6.toFixed(4);


            case ("pvCashFlow"):
                const discFactorIdx = "discountFactor" + year;
                const fcfIndex = "fcf" + year;
                const pvCashFlowYearX = Math.round(forecastVals[fcfIndex] * forecastVals[discFactorIdx]);
                
                return pvCashFlowYearX;

            case ("fcfTotal"):
                let fcfTot = yearZeroVals.fcf;
                for (let i = 6; i > 0 ; i--) {
                    let fcfIdx = "pvCashFlow" + i;
                    fcfTot += forecastVals[fcfIdx];
                }
               
                return fcfTot;

            case ("shareholderVal"):
                let shareholderValue = 0;
                if (yearZeroVals.fcfTotal > 0) {
                    shareholderValue = yearZeroVals.fcfTotal - yearZeroVals.debt + yearZeroVals.cash;
                    return shareholderValue;
                }
                return shareholderValue;

            case ("sharePrice"):
                if (yearZeroVals.numShares) {
                    return (yearZeroVals.shareholderVal * 1000000) / (yearZeroVals.numShares * 1000000)
                }
                return 0;
                
            default:
                const key = rowClass + year;
                const val = forecastVals[key] ? forecastVals[key] : 0;
                return parseInt(val);
        }       
    }

    return (
        <Container className="mt-5">
            <h2 className="display-5">DCF Model</h2>
            <Table striped bordered size="sm" className="w-50 mt-3">
                <thead>
                    <tr>
                        <th colSpan={2}>Assumptions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-75">EBIT growth rate</td>
                        <td className="text-center">
                            <input
                                className="w-50 text-center me-1"
                                type="text"
                                id="growthRate"
                                name="growthRate"
                                value={assumps.growthRate || 0} 
                                onChange={handleAssumpChange} 
                            />%
                        </td>
                    </tr>
                    <tr>
                        <td>Tax rate</td>
                        <td className="text-center">
                            <input
                                className="w-50 text-center me-1"
                                type="text"
                                id="taxRate"
                                name="taxRate"
                                value={assumps.taxRate || 0} 
                                onChange={handleAssumpChange} 
                            />%
                        </td>
                    </tr>
                    <tr>
                        <td>Discount Rate</td>
                        <td className="text-center">
                            <input
                                className="w-50 text-center me-1"
                                type="text"
                                id="discRate"
                                name="discRate"
                                value={assumps.discRate || 0} 
                                onChange={handleAssumpChange} 
                            />%
                        </td>
                    </tr>
                    <tr>
                        <td>Terminal Rate</td>
                        <td className="text-center">
                            <input
                                className="w-50 text-center me-1"
                                type="text"
                                id="terminalRate"
                                name="terminalRate"
                                value={assumps.terminalRate || 0} 
                                onChange={handleAssumpChange} 
                            />%
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Table responsive="sm" striped bordered className="table caption-top">
                <caption><strong>Valuation ($Millions)</strong></caption>
                <thead>
                    <tr className="text-center">
                        <th className="w-25 text-start">Year</th>
                        <th>0</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EBIT</td>
                        <td className="text-center">
                            <input 
                                type="text" 
                                className="w-75 text-end"
                                id="ebit" 
                                name="ebit"
                                value={yearZeroVals.ebit || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    disabled
                                    type="text"
                                    className="w-75 text-end"
                                    id={"ebit" + (index+1)}
                                    name={"ebit" + (index+1)}
                                    value={forecastVals["ebit" + (index+1)] = generateForecast("ebit", index+1) || 0}
                                    onChange={handleForecastChange} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>&#8722; taxes</td>   
                        <td className="text-center">
                            <input 
                                disabled
                                type="text" 
                                className="w-75 text-end"
                                id="taxes" 
                                name="taxes"
                                value={yearZeroVals.taxes = Math.round(yearZeroVals.ebit * parseFloat(assumps.taxRate/100) || 0)}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    disabled
                                    type="text"
                                    className="w-75 text-end"
                                    id={"taxes" + (index+1)}
                                    name={"taxes" + (index+1)}
                                    value={forecastVals["taxes" + (index+1)]= generateForecast("taxes", index+1) || 0} 
                                    onChange={handleForecastChange} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>&#61; EBIAT</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text" 
                                className="w-75 text-end"
                                id="ebiat" 
                                name="ebiat"
                                value={yearZeroVals.ebiat = parseInt(yearZeroVals.ebit) - parseInt(yearZeroVals.taxes) || 0}
                                onChange={handleYearZeroChange} />
                        </td> 
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    disabled
                                    type="text"
                                    className="w-75 text-end"
                                    id={"ebiat" + (index+1)}
                                    name={"ebiat" + (index+1)}
                                    value={forecastVals["ebiat" + (index+1)] = generateForecast("ebiat", index+1) || 0}
                                    onChange={handleForecastChange} />
                            </td>
                        ))}  
                    </tr>
                    <tr>
                        <td>&#43; depreciation and amortization</td>
                        <td className="text-center">
                            <input 
                                type="text" 
                                className="w-75 text-end"
                                id="deprecAndAmort" 
                                name="deprecAndAmort"
                                value={yearZeroVals.deprecAndAmort = parseInt(yearZeroVals.deprecAndAmort) || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    type="text"
                                    className="w-75 text-end"
                                    id={"deprecAndAmort" + (index+1)}
                                    name={"deprecAndAmort" + (index+1)}
                                    value={forecastVals["deprecAndAmort" + (index+1)] = generateForecast("deprecAndAmort", index+1)}
                                    onChange={handleForecastChange} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>&#8722; change in working capital</td>
                        <td className="text-center">
                            <input 
                                type="text" 
                                className="w-75 text-end"
                                id="chngInWorkingCap" 
                                name="chngInWorkingCap"
                                value={yearZeroVals.chngInWorkingCap = parseInt(yearZeroVals.chngInWorkingCap) || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    type="text"
                                    className="w-75 text-end"
                                    id={"chngInWorkingCap" + (index+1)}
                                    name={"chngInWorkingCap" + (index+1)}
                                    value={forecastVals["chngInWorkingCap" + (index+1)] = parseInt(forecastVals["chngInWorkingCap" + (index+1)]) || 0}
                                    onChange={handleForecastChange} />
                            </td>        
                        ))}
                    </tr>
                    <tr>
                        <td>&#8722; capital expenditures</td>
                        <td className="text-center">
                            <input 
                                type="text" 
                                className="w-75 text-end"
                                id="capex" 
                                name="capex"
                                value={yearZeroVals.capex = parseInt(yearZeroVals.capex) || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    type="text"
                                    className="w-75 text-end"
                                    id={"capex" + (index+1)}
                                    name={"capex" + (index+1)}
                                    value={forecastVals["capex" + (index+1)] = generateForecast("capex", index+1) || 0}
                                    onChange={handleForecastChange} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>&#61; free cash flow</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text" 
                                className="w-75 text-end"
                                id="fcf" 
                                name="fcf"
                                value={yearZeroVals.fcf = yearZeroVals.ebiat + yearZeroVals.deprecAndAmort
                                            - yearZeroVals.chngInWorkingCap - yearZeroVals.capex}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    disabled
                                    type="text"
                                    className="w-75 text-end"
                                    id={"fcf" + (index+1)}
                                    name={"fcf" + (index+1)}
                                    value={forecastVals["fcf" + (index+1)] = generateForecast("fcf", index+1)}
                                    onChange={handleForecastChange} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>Discount factor</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text"
                                className="w-75 text-end"
                                id="discountFactor"
                                name="discountFactor"
                                value={parseFloat(1).toFixed(2)} />
                        </td>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    type="text"
                                    className="w-75 text-end"
                                    id={"discountFactor" + (index+1)}
                                    name={"discountFactor" + (index+1)}
                                    value={forecastVals["discountFactor" + (index+1)] = generateForecast("discountFactor", index+1)}
                                    onChange={forecastVals["discountFactor" + (index+1)]} />
                            </td>
                        ))}
                        <td className="text-center">*
                            <input 
                                type="text"
                                className="w-75 text-end"
                                id="discountFactor6"
                                name="discountFactor6"
                                value={forecastVals.discountFactor6 = generateForecast("discountFactor6", 6) }
                                onChange={handleForecastChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Present value of free cash flow</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text"
                                className="w-75 text-end"
                                id="pvCashFlow"
                                name="pvCashFlow"
                                value={yearZeroVals.fcf}
                                onChange={handleYearZeroChange} />
                        </td>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <td key={index} className="text-center">
                                <input
                                    disabled
                                    type="text"
                                    className="w-75 text-end"
                                    id={"pvCashFlow" + (index+1)}
                                    name={"pvCashFlow" + (index+1)}
                                    value={forecastVals["pvCashFlow" + (index+1)] = generateForecast("pvCashFlow", index+1)} 
                                /> 
                            </td>
                        ))}
                        <td className="text-center">
                            <input 
                                disabled
                                type="text"
                                className="w-75 text-end"
                                id="pvCashFlow6"
                                name="pvCashFlow6"
                                value={forecastVals.pvCashFlow6 = Math.round(forecastVals.fcf6 * forecastVals.discountFactor6)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Cumulative PV of free cash flow</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text"
                                className="w-75 text-end"
                                id="fcfTotal"
                                name="fcfTotal"
                                value={yearZeroVals.fcfTotal = generateForecast("fcfTotal", 1)}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>&#8722; debt</td>
                        <td className="text-center">
                            <input
                                type="text"
                                className="w-75 text-end"
                                id="debt"
                                name="debt"
                                value={yearZeroVals.debt = yearZeroVals.debt || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>&#43; cash</td>
                        <td className="text-center">
                            <input
                                type="text"
                                className="w-75 text-end"
                                id="cash"
                                name="cash"
                                value={yearZeroVals.cash = yearZeroVals.cash || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>Shareholder value</td>
                        <td className="text-center">
                            <input
                                disabled
                                type="text"
                                className="w-75 text-end"
                                id="shareholderVal"
                                name="shareholderVal"
                                value={yearZeroVals.shareholderVal = generateForecast("shareholderVal", 0)}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>No. of shares outstanding (Millions)</td>
                        <td className="text-center">
                            <input
                                type="text"
                                className="w-75 text-end"
                                id="numShares"
                                name="numShares"
                                value={yearZeroVals.numShares || 0}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Implied share price</strong></td>
                        <td className="text-center">
                            <input
                                type="text"
                                className="w-75 text-end"
                                id="sharePrice"
                                name="sharePrice"
                                value={yearZeroVals.sharePrice = generateForecast("sharePrice", 0)}
                                onChange={handleYearZeroChange} />
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div>
                <p className="fs-6">* Year 6 discount factor uses the terminal rate = expected discount rate - terminal growth rate</p>
            </div>
        </Container>
    );
}

export default DCFModel;