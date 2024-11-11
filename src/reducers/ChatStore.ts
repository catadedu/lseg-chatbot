import {configureStore} from '@reduxjs/toolkit';
import chatReducer from './ChatFlow';


export const ChatStore = configureStore({
    reducer: {
        chat: chatReducer
    }
})

export type RootState = ReturnType<typeof ChatStore.getState>
export type AppDispatch = typeof ChatStore.dispatch;

