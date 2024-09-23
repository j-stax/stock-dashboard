import FetchData from "../utils/API";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

function NewsList(props) {
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        async function fetchNews() {
            const newsDataResponse = await FetchData(props.ticker, "news");
            if (newsDataResponse) {
                setNewsData(newsDataResponse);
            }
            else {
                alert("Error fetching news data.");
                console.log("Error fetching news data.");
            }
        }

        fetchNews();
    }, [props.ticker]);

    return (
        <Container>
            <h1 className="display-5 mb-3">Latest News</h1>
            <ul>
                {newsData.map(news => 
                    <li key={news.id}>
                        <a href={news.url} target="_blank" rel="noopener noreferrer">{news.headline}</a>
                    </li>)}
            </ul>
        </Container>
    );
}

export default NewsList;