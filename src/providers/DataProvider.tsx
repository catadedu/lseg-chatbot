import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setExchanges, setRawData} from '../reducers/ChatFlow';

const DataProvider: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/assets/chatbot-stock-data.json?timestamp=' + new Date().getTime());
            const data = await response.json();
            dispatch(setRawData(data));
            dispatch(setExchanges(data));
            console.log(data);
        };

        fetchData();
    }, [dispatch]);

    return null;
};

export default DataProvider;
