import FetchData from "../utils/API";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

function NewsList(props) {
    const [newsData, setNewsData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchNews() {
            const newsDataResponse = await FetchData(props.ticker, "news");
            if (newsDataResponse) {
                setNewsData(newsDataResponse);
            }
            else {
                setErrorMessage("API returned no recent news.");
                console.log("Fetching news data returned null.");
            }
        }

        fetchNews();
    }, [props.ticker]);

    return (
        <Container>
            <h1 className="display-5 mb-3">Latest News</h1>
            {errorMessage.length > 0 
                ? <Alert variant="info" className="w-25">{errorMessage}</Alert> : 
                ( <ul>
                    {newsData.map(news => 
                        <li key={news.id}>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">{news.headline}</a>
                        </li>)}
                    </ul>
                )
            }
            
        </Container>
    );
}

export default NewsList;