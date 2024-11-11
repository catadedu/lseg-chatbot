import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SourceType} from "../utils/types";
import {WELCOME_MESSAGE} from "../utils/constants";

interface Stock {
    code: string;
    stockName: string;
    price: number;
}

interface StockExchange {
    code: string;
    stockExchange: string;
    topStocks: Stock[];
}

interface ChatState {
    rawData: any | null;
    selectedExchange: StockExchange | null;
    selectedStock: Stock | null;
    messageQueue: Message[];
    exchanges: string[];
}

const initialMessage:Message = {
    message: WELCOME_MESSAGE,
    source: SourceType.CHAT_BOT
}

const initialState: ChatState = {
    rawData: null,
    selectedExchange: null,
    selectedStock: null,
    messageQueue: [initialMessage],
    exchanges: []
}

interface Message {
    message: string;
    source: SourceType;
    buttons?: {
        exchangeCode: string;
        label: string; onClick: () => void }[];
}


const chatFlow = createSlice({
    name: 'defaultChatFlow',
    initialState,
    reducers: {
        setRawData: (state, action: PayloadAction<StockExchange[]>) => {
            state.rawData = action.payload;
        },
        setExchanges: (state, action: PayloadAction<StockExchange[]>) => {
            state.exchanges = action.payload.map(exchange => exchange.stockExchange);
            const exchangeButtonsMessage: Message = {
                message: 'Please select a Stock Exchange:',
                source: SourceType.CHAT_BOT,
                buttons: state.exchanges.map((exchange) => ({
                    label: exchange,
                    exchangeCode: exchange,
                    onClick: () => {}
                }))
            };

            const messageExists = state.messageQueue.some(
                (msg) => msg.message === exchangeButtonsMessage.message
            );

            if (!messageExists){
                state.messageQueue.push(exchangeButtonsMessage);
            }
            console.log('setExchanges:');
        },
        selectExchange: (state, action: PayloadAction<StockExchange>) => {
            state.selectedExchange = action.payload;
            console.log('selectExchange');
            state.messageQueue.push({
                message: `${action.payload}`,
                source: SourceType.USER
            });

        },
        selectStock: (state, action: PayloadAction<Stock>) => {
            console.log('selectStock');
            state.selectedStock = action.payload;
            state.messageQueue.push({
                message: `${action.payload.stockName}`,
                source: SourceType.USER
            });
        },
        addMessage: (state, action:PayloadAction<Message>) => {
            state.messageQueue.push(action.payload);
        },
        resetChat: (state) => {
            state.selectedExchange =null;
            state.selectedStock = null;
            state.messageQueue = [];
        }
    }
});

export const {setRawData, setExchanges, selectExchange, selectStock, addMessage, resetChat } = chatFlow.actions;
export default chatFlow.reducer;