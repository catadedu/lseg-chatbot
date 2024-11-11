import styles from './ChatMainComponent.module.css';
import ChatBotMessageIcon from '../../assets/chat-bot-icon.svg';
import ChatBotTitleIcon from '../../assets/chat-bot-icon-title.svg';
import React, {useState} from 'react';
import {RootState} from "../../reducers/ChatStore";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";
import ChatMessage from "../message/ChatMessage";
import {useDispatch, useSelector} from "react-redux";
import {addMessage, resetChat, selectExchange, selectStock} from "../../reducers/ChatFlow";
import {BUTTONS, WELCOME_BACK_MESSAGE} from "../../utils/constants";
import {SourceType} from "../../utils/types";

const ChatMainComponent: React.FC = () => {
    const [isChatModalOpen, setIsChatModalOpen] = useState(true);
    const [inputText, setInputText] = useState('');

    const dispatch = useDispatch();
    const rawData = useSelector((state: RootState) => state.chat.rawData);
    const exchanges = useSelector((state: RootState) => state.chat.exchanges);
    const selectedExchange = useSelector((state: RootState) => state.chat.selectedExchange);
    const selectedStock = useSelector((state: RootState) => state.chat.selectedStock);
    const messageQueue = useSelector((state: RootState) => state.chat.messageQueue);
    const [waitingForSelection, setWaitingForSelection] = useState<'exchange' | 'stock' | 'none'>('none');

    const closeChatModal = () => {
        setIsChatModalOpen(false);
    }

    const handleExchangeSelect = (exchangeCode: string) => {
        console.log(`Selected exchange: ${exchangeCode}`);
        // @ts-ignore
        dispatch(selectExchange(exchangeCode));
        setWaitingForSelection('stock');

        const selectedExchange = rawData.find((exchange: any) => exchange.stockExchange === exchangeCode);
        if (!selectedExchange) return;

        dispatch(addMessage({
            message: `Please select a stock.`,
            source: SourceType.CHAT_BOT,
            buttons: selectedExchange.topStocks.map((stock: { stockName: any; }) => ({
                label: stock.stockName,
                onClick: () => {
                    console.log('Selected Stock:', stock.stockName);
                }
            }))
        }));

    };

    const handleStockSelect = (stock: any) => {
        dispatch(selectStock(stock));
        setWaitingForSelection('none');
        dispatch(addMessage({
            message: `Stock Price of ${stock.stockName} is ${stock.price}. Please select an option.`,
            source: SourceType.CHAT_BOT,
            buttons: [
                {label: BUTTONS.MAIN_MENU, onClick: () => handleResetChat(), exchangeCode: ''},
                {label: BUTTONS.GO_BACK, onClick: closeChatModal, exchangeCode: ''},
            ]
        }));

    };

    const handleResetChat = () => {
        dispatch(resetChat());
        setWaitingForSelection('exchange');
        dispatch(addMessage({
            message: WELCOME_BACK_MESSAGE,
            source: SourceType.CHAT_BOT,
            buttons: exchanges.map((exchange) => ({
                exchangeCode: '',
                label: exchange,
                onClick: () => handleExchangeSelect(exchange)
            }))
        }));
    };

    const handleButtonClick = (button: any) => {
        if (selectedExchange == null) {
            const exchange = exchanges.find(e => e === button.label);
            if (exchange) handleExchangeSelect(exchange);
        } else {
            // @ts-ignore
            const exchange = rawData.find((ex) => ex.stockExchange === selectedExchange);
            const stock = exchange.topStocks.find((stock: { stockName: any; }) => stock.stockName === button.label);
            if (button && button.label === BUTTONS.MAIN_MENU) {
                console.log('Going Back to Main Menu');
                handleResetChat();
                return;
            }

            if (button && button.label === BUTTONS.GO_BACK) {
                console.log('Going Back to selecting a stock.');
                handleStockSelect(selectedStock);
                return;
            }

            if (exchange) {
                // @ts-ignore
                if (stock) handleStockSelect(stock);
            }
        }
    };

    return (
        <Dialog
            open={isChatModalOpen}
            onClose={closeChatModal}
            PaperProps={{
                className: styles['chat-dialog-dimensions'],
            }}
            hideBackdrop
            sx={{
                position: 'fixed',
                inset: 'auto 0px 0px auto',
                margin: 0
            }}
        >
            <DialogTitle className={styles['chat-dialog-title']}>
                <img src={ChatBotTitleIcon} alt="Chat Icon" className={styles['chat-icon']} />
                LSEG chatbot
                <IconButton
                    aria-label="close"
                    onClick={closeChatModal}
                    sx={{position: 'absolute', right: 8, top: 8, color: 'white',}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {messageQueue.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg.message}
                        source={msg.source}
                        buttons={msg.buttons?.map(button => ({
                            ...button,
                            onClick: () => handleButtonClick(button)
                        }))}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <TextField
                    label='Please pick an option'
                    variant='outlined'
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    sx={{width: '100%'}}
                    InputProps={{
                        startAdornment: null,
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button variant="text">
                                    <SendIcon className={styles['send-icon']}/>
                                </Button>
                            </InputAdornment>
                        )
                    }}
                />
            </DialogActions>
        </Dialog>
    )
}

export default ChatMainComponent;