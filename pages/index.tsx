import PullRequestTable from "./PullRequestTable";
import React, {useEffect, useState, useRef} from "react";
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { getResultsFromGithubUrl, getTotalResultsFromGithubUrl, validateUrl } from '../services/github.service';
import {
    headerStyles,
    spinnerStyles,
    paginateButtonWrapperStyles,
    paginateButtonStyles,
    errorMessageStyles,
    inputStyles,
    wrapperStyles
} from '../styles/main.style';

function App() {
    let [url, setUrl] = useState('');
    let [loading, setLoading] = useState(true);
    let [results, setResults] = useState([]);
    let inputRef = useRef(null);
    let [page, setPage] = useState(1);
    let [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setResults(await getResultsFromGithubUrl(url, page));
            const totalResultCount = await getTotalResultsFromGithubUrl(url);
            setTotalPages(Math.ceil(totalResultCount/30));
            setLoading(false);
        }

        fetchData();
    }, [url])

    const handleChange = async (newPage: number) => {
        setLoading(true);
        setResults(await getResultsFromGithubUrl(url, newPage));
        setLoading(false);
        setPage(newPage);
    };

    const fetchNewResults = () => {
        setUrl(inputRef.current.value);
        setPage(1);
    }

    const GithubInput = () => {
        return <div style={wrapperStyles as React.CSSProperties}>
            <input placeholder={'Please Enter the Github URL'} ref={inputRef} style={inputStyles}></input>
            <Button variant="contained" color="primary" onClick={fetchNewResults}>Huzzah!</Button>
        </div>
    }

    const getContent = () => {
        const isValidUrl = validateUrl(url);
        if (url === '') {
            return null;
        }
        else if (!isValidUrl) {
            return <div style={errorMessageStyles}>Invalid Github Repository URL</div>;
        } else if (loading) {
            return <div style={spinnerStyles}>
                <FontAwesomeIcon icon={faSpinner} spin={true} />
            </div>;
        } else {
            return <div>
                <div style={paginateButtonWrapperStyles}>
                    {page === totalPages ? null : <Button variant="contained"
                            color="secondary"
                            style={paginateButtonStyles}
                            onClick={() => handleChange(page+1)}>Next results</Button>}
                    {page > 1 ? <Button variant="contained"
                            color="secondary"
                            style={paginateButtonStyles}
                            onClick={() => handleChange(page-1)}>Previous results</Button> : null}
                </div>
                <PullRequestTable results={results} />
            </div>;
        }
    }

    return <>
        <h1 style={headerStyles}>
            Github Pull Requests
        </h1>
        <div>
            {GithubInput()}
        </div>
        {getContent()}
    </>
}

export default App
