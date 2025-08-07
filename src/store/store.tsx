import {configureStore} from "@reduxjs/toolkit";
import postsReducer from '../store/postListSlice.tsx';
import fullPostReducer from "./fullPostSlice.ts";
import user from "./authSlice.tsx";
import articlesSlice from './postSlice.ts'


const store = configureStore({
    reducer: {
        articles: articlesSlice,
        posts: postsReducer,
        fullPost: fullPostReducer,
        user: user
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;