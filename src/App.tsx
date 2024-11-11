import React, {useState} from 'react';
import logo from './assets/lseg-logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import ChatMainComponent from "./components/chat/ChatMainComponent";
import DataProvider from "./providers/DataProvider";
import {Provider} from "react-redux";
import {ChatStore} from "./reducers/ChatStore";

function App() {

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const openChatModal = () => {
        setIsChatModalOpen(true);
    }

    return (
        <div className="app">
            <header className="app-header">
                <div className="launch-button-container">
                    <Button className="launch-button" variant="text" color="info" onClick={openChatModal}>
                        <img src={logo} className="app-logo" alt="lseg-logo"/>
                    </Button>
                </div>
            </header>
            <footer>
                <div className="chat-container">
                    {isChatModalOpen &&
                        <Provider store={ChatStore}>
                            <DataProvider/>
                            <ChatMainComponent/>
                        </Provider>}
                </div>
            </footer>
        </div>
    );
}

export default App;
