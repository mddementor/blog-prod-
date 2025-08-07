import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit";
import type {Article} from "./postSlice.ts";
import { likeArticle, unLikeArticle } from './postSlice';

export interface fullPost {
    title: string;
    favorited: boolean;
    favoritesCount: number;
    tags: string[];
    author: string;
    date: string;
    avatar: string;
    shortDescription: string;
    text: string;
    slug: string;
    error?: string;
};

interface stateFullPost {
    post: Article| null;
    isLoading: boolean;
    error: string | null;
};

const initialState: stateFullPost = {
    post: null,
    isLoading: false,
    error: null
};

const loadFullPost = createAsyncThunk(
    'fullpost',
    async (slug: string, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const token = user?.token;

            const postPromise = await fetch(
                `https://blog-platform.kata.academy/api/articles/${slug}`,
                {
                    headers: token ? { Authorization: `Token ${token}` } : {},
                }
            );

            if (!postPromise.ok) {
                throw new Error(`Ошибка при загрузке поста ${postPromise.status}`);
            }

            const resPost = await postPromise.json();
            const article = resPost.article;

            return {
                slug: article.slug,
                title: article.title,
                favorited: article.favorited,
                favoritesCount: article.favoritesCount,
                tagList: article.tagList,
                author: article.author,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                avatar: article.author.image,
                description: article.description,
                body: article.body,
            };

        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const fullPostSlice = createSlice({
        name: "fullPost",
        initialState: initialState,
        reducers: {

        },
        extraReducers: (builder) => {

            builder.addCase(loadFullPost.pending, (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.post = null;
                })
            builder.addCase(loadFullPost.fulfilled, (state, action:PayloadAction<Article>) => {
                    state.isLoading = false;
                    state.post = action.payload;
                })
            builder.addCase(loadFullPost.rejected, (state, action: ReturnType<typeof loadFullPost.rejected>) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                });
            builder.addCase(likeArticle.fulfilled, (state, action) => {
                state.post = action.payload.article;
            });

            builder.addCase(unLikeArticle.fulfilled, (state, action) => {
                state.post = action.payload.article;
            });
        }
    })
export { loadFullPost };
export default fullPostSlice.reducer