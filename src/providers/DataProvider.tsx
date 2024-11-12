import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setExchanges, setRawData} from '../reducers/ChatFlow';


const DataProvider: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('/assets/chatbot-stock-data.json?timestamp=' + new Date().getTime());
                if (!response){
                    throw new Error(`Error fetching data: ${response}`)
                }
                const data = await response.json();
                dispatch(setRawData(data));
                dispatch(setExchanges(data));
                console.log(data);
            } catch (error) {
                console.error('Error loading data:', error);
            }

        };

        fetchData();
    }, [dispatch]);

    return null;
};

export default DataProvider;
