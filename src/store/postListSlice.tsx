import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { likeArticle, unLikeArticle } from "./postSlice.ts";

export interface article {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
        username: string;
        image: string;
    };
}

interface PostsState {
    postsData: article[];
    isLoading: boolean;
    error: string | null;
    page: number;
    total: number;
}

const savedPage = Number(localStorage.getItem("currentPage")) || 1;

const initialState: PostsState = {
    postsData: [],
    isLoading: false,
    error: '',
    page: savedPage,
    total: 0,
}

const getPosts = createAsyncThunk(
    'fetchPosts',
    async (page: number) => {
        const offset = (page - 1) * 5;
        const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=5&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении постов: ${response.status}`);
        }
        const postsAnd = await response.json();
        return {
            postData: postsAnd.articles,
            total: postsAnd.articlesCount,
            page
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
            localStorage.setItem("currentPage", String(action.payload));
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(getPosts.fulfilled, (state, action: PayloadAction<{ postData: article[]; total: number; page: number } | undefined>) => {
                if (action.payload) {
                    state.postsData = action.payload.postData;
                    state.total = action.payload.total;
                    state.page = action.payload.page;
                }
                state.isLoading = false;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.error = action.error.message || 'Unknown error';
                state.isLoading = false;
            })
            .addCase(likeArticle.fulfilled, (state, action) => {
                const updated = action.payload.article;
                const index = state.postsData.findIndex(post => post.slug === updated.slug);
                if (index !== -1) {
                    state.postsData[index] = {
                        ...state.postsData[index],
                        favorited: updated.favorited,
                        favoritesCount: updated.favoritesCount,
                    };
                }
            })
            .addCase(unLikeArticle.fulfilled, (state, action) => {
                const updated = action.payload.article;
                const index = state.postsData.findIndex(post => post.slug === updated.slug);
                if (index !== -1) {
                    state.postsData[index] = {
                        ...state.postsData[index],
                        favorited: updated.favorited,
                        favoritesCount: updated.favoritesCount,
                    };
                }
            });
    }
});

export { getPosts };
export default postsSlice.reducer;
export const { setPage } = postsSlice.actions;
