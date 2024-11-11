import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import styles from './ChatMessage.module.css';
import ChatBotMessageIcon from '../../assets/chat-bot-icon.svg';

type sourceType = 'ChatBot' | 'User';

interface ChatMessageProps {
    message: string;
    source: sourceType;
    buttons?: {
        exchangeCode: string;
        label: string;
        onClick: (exchangeCode: string) => void }[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, source, buttons }) => {
    const isUser = source === 'User';

    return (
        <div className={isUser ? styles['chat-message-container-user'] : styles['chat-message-container-bot']}>
            {source === 'ChatBot' && (
                <img src={ChatBotMessageIcon} alt="Chat Icon" className={styles['chat-icon']} />
            )}
            <Paper
                elevation={2}
                className={isUser ? styles['chat-message-user'] : styles['chat-message-bot']}
            >
                <Typography variant="body2" color={isUser ? 'primary' : 'textSecondary'}>
                    {message}
                </Typography>
                {buttons && (
                    <div className={styles['button-container']}>
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                onClick={() => button.onClick?.(button.exchangeCode)}
                                variant="text"
                                size="small"
                                fullWidth
                                sx={{
                                    margin: '4px 0',
                                    backgroundColor: '#',
                                    color: '#333333',
                                    '&:hover': {
                                        backgroundColor: '#E0E0E0'
                                    }
                                }}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>
                )}
            </Paper>
        </div>
    );
};

export default ChatMessage;
