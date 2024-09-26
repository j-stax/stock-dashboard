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

    const monthMap = {
        "0": "01",
        "1": "02",
        "2": "03",
        "3": "04",
        "4": "05",
        "5": "06",
        "6": "07",
        "7": "08",
        "8": "09",
        "9": "10",
        "10": "11",
        "11": "12",
    };

    let dataArray = [];         // Container to hold relevant data
    let urlFunction = "";

    switch (type) {
        case "ebit":
            urlFunction = "INCOME_STATEMENT";
            break;
        case "deprecAndAmortization":
            urlFunction = "INCOME_STATEMENT";
            break;
        case "working capital":
            urlFunction = "BALANCE_SHEET";
            break;
        case "balance sheet":
            urlFunction = "BALANCE_SHEET";
            break;
        case "capex":
            urlFunction = "CASH_FLOW";  
            break;
        case "news":
            urlFunction = "NEWS_SENTIMENT";
            break;
        default: 
            urlFunction = "TIME_SERIES_MONTHLY_ADJUSTED";
    }

    const apiKey = "Y7I5R3PL5KTSMQB2";
    let url;

    if (urlFunction === "NEWS_SENTIMENT") {
        const date = new Date();
        const yearMonthDay = `${date.getFullYear()}${monthMap[date.getMonth()]}${date.getDate()}`;
        url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&time_from=${yearMonthDay}T1000&apikey=${apiKey}`;
    }
    else {
        url = `https://www.alphavantage.co/query?function=${urlFunction}&symbol=${ticker}&apikey=${apiKey}`;
    }

    const response = await fetch(url);  // API call

    if (response.ok) {

        try {

            const result = await response.json();
            let count = 1;

            // Price data
            if (type === "price") {
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
            else if (type === "ebit") {                 // Earnings data
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
            else if (type === "deprecAndAmortization") {       // depreciation and amortization
                const annualReports = result["annualReports"];

                for (let statement of annualReports) {
                    if (count > 5) {
                        break;
                    }

                    let newDeprecAndAmortObj = {
                        id: count,
                        year: statement["fiscalDateEnding"].substring(0, 4),
                        value: Math.round(parseInt(statement["depreciationAndAmortization"]) / 1000000)
                    };

                    dataArray.push(newDeprecAndAmortObj);
                    count += 1;
                }
            }
            else if (type === "news") {              // News headlines and URLs
                const newsFeed = result["feed"];
                const size = newsFeed.length;

                if (size === 0) {
                    return null;
                }

                try {
                    for (let i = 0; i < size; i ++) {

                        if (count > 5 || i === size) {
                            break;
                        }

                        let news = newsFeed[i];

                        const newsObj = {
                            id: count,
                            headline: news["title"].length > 100 ? news["title"].substring(0, 100) + "..." : news["title"],
                            url: news["url"]
                        };

                        dataArray.push(newsObj);
                        count += 1;
                    }
                }
                catch (exception) {
                    console.log(exception);
                    return null;
                }
            }
            else if (type === "working capital") {       // Working capital
                const annualReports = result["annualReports"];

                for (let balanceSheet of annualReports) {
                    if (count > 5) {
                        break;
                    }

                    let acctsReceivables = parseInt(balanceSheet["currentNetReceivables"]);
                    let inventory = parseInt(balanceSheet["inventory"]);
                    let acctsPayable = parseInt(balanceSheet["currentAccountsPayable"]);
                    let workingCapital = (acctsReceivables + inventory - acctsPayable) / 1000000;

                    const workingCapObj = {
                        id: count,
                        year: balanceSheet["fiscalDateEnding"].substring(0, 4),
                        value: workingCapital
                    };

                    dataArray.push(workingCapObj);
                    count += 1;
                }
            }
            else if (type === "balance sheet") {        // Cash, debt, common shares outstanding
                const annualReports = result["annualReports"];
                const cashAndCashEquiv = Math.round(parseInt(annualReports[0]["cashAndShortTermInvestments"]) / 1000000);
                const totalDebt = Math.round( (parseInt(annualReports[0]["shortTermDebt"]) + parseInt(annualReports[0]["longTermDebt"])) / 1000000);
                const shareCount = Math.round(parseInt(annualReports[0]["commonStockSharesOutstanding"]) / 1000000);

                dataArray.push(cashAndCashEquiv);
                dataArray.push(totalDebt);
                dataArray.push(shareCount);
            }
            else if (type === "capex") {       // CapEx data
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
            else {
                return null;
            }
        }
        catch (exception) {
            console.log(exception);
            return null;
        }
    }
    else {
        return response.status;
    }

    return dataArray;
}

export default FetchData;