async function FetchData(ticker, type) {
    let dateMap = {
        "01": "J",
        "02": "F",
        "03": "M",
        "04": "A",
        "05": "M",
        "06": "J",
        "07": "J",
        "08": "A",
        "09": "S",
        "10": "O",
        "11": "N",
        "12": "D"
    };
    
    let dataArray = [];
    let urlFunction = "";
       
    switch (type) {
        case "ebit":
            urlFunction = "INCOME_STATEMENT";
            break;
        case "working capital":
            urlFunction = "BALANCE_SHEET";
            break;
        case "capex":
            urlFunction = "CASH_FLOW";
            break;
        default: 
            urlFunction = "TIME_SERIES_MONTHLY_ADJUSTED";
    }

    const apiKey = "Y7I5R3PL5KTSMQB2";
    const url = `https://www.alphavantage.co/query?function=${urlFunction}&symbol=${ticker}&apikey=${apiKey}`;
    const response = await fetch(url);

    if (response.ok) {
        const result = await response.json();
        let count = 1;

        try {
            // Price data
            if (result["Monthly Adjusted Time Series"]) {
                const priceData = result["Monthly Adjusted Time Series"];

                for (let month in priceData) {

                    if (count > 12) {
                        break;
                    }

                    const newPriceObj = {
                        id: count,
                        date: dateMap[month.substring(5, 7)],
                        value: parseFloat(priceData[month]["5. adjusted close"]).toFixed(2)
                    };

                    dataArray.push(newPriceObj);
                    count += 1;
                }
            }
            else if (result["annualReports"][0]["totalAssets"]) {       // Working capital data + common shares outstanding
                const annualReports = result["annualReports"];

                for (let balanceSheet of annualReports) {
                    if (count > 5) {
                        break;
                    }

                    let acctsReceivables = parseInt(balanceSheet["currentNetReceivables"]);
                    let inventory = parseInt(balanceSheet["inventory"]);
                    let acctsPayable = parseInt(balanceSheet["currentAccountsPayable"]);
                    let workingCapital = (acctsReceivables + inventory - acctsPayable) / 1000000;
                    let shareCount = Math.round(parseInt(balanceSheet["commonStockSharesOutstanding"]) / 1000000);

                    const balanceSheetObj = {
                        id: count,
                        year: balanceSheet["fiscalDateEnding"].substring(0, 4),
                        value: workingCapital,
                        shares: shareCount
                    };

                    dataArray.push(balanceSheetObj);
                    count += 1;
                }
            }
            else if (result["annualReports"][0]["capitalExpenditures"]) {       // CapEx data
                const annualReports = result["annualReports"];

                for (let statement of annualReports) {
                    if (count > 5) {
                        break;
                    }

                    const capexObj = {
                        id: count,
                        year: statement["fiscalDateEnding"].substring(0, 4),
                        value: parseInt(statement["capitalExpenditures"]) / 1000000
                    };

                    dataArray.push(capexObj);
                    count += 1;
                };
            }
            else if (result["annualReports"]) {                 // Earnings data
                const annualReports = result["annualReports"];

                for (let statement of annualReports) {
                    if (count > 5) {
                        break;
                    }

                    const newEbitObj = {
                        id: count,
                        year: statement["fiscalDateEnding"].substring(0, 4),
                        value: parseInt(statement["ebit"]) / 1000000
                    };

                    dataArray.push(newEbitObj);
                    count += 1;
                }
            }
            else {
                return null;
            }
        }
        catch (exception) {
            return null;
        }
    }
    else {
        return response.status;
    }

    return dataArray;
}

export default FetchData;