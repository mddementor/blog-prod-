import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UpdateArticlePayload } from "../utilits.ts";
//import type { article } from "../utilits.ts";

export interface Article {
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
        bio: string | null;
        image: string;
        following: boolean;
    };
}

export interface ArticleCreate {
    title: string;
    description: string;
    body: string;
    tagList: string[];
    slug?: string;
}

interface ArticleState {
    articles: Article[];
    loading: boolean;
    error: string | null;
}

const initialState: ArticleState = {
    articles: [],
    loading: false,
    error: null,
};

const baseURL = 'https://blog-platform.kata.academy/api';

async function createArticleAPI(articleCreate: ArticleCreate, token: string) {
    const response = await fetch(`${baseURL}/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ article: articleCreate }),  
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Ошибка при создании статьи');
    }
    return await response.json();
}


async function updateArticleAPI(article: UpdateArticlePayload, token: string) {
    const response = await fetch(`${baseURL}/articles/${article.slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ article }),
    });

    if (response.status === 204) {
        return { article: { slug: article.slug } };
    }

    if (!response.ok) {

        let errorMessage = 'Ошибка при обновлении статьи';
        try {
            const errorData = await response.json();
            if (errorData.errors) {
                errorMessage = JSON.stringify(errorData.errors);
            }
        } catch (e) {
            console.log(e)
        }

        throw new Error(errorMessage);
    }

    return await response.json(); // ✅ только если точно не 204
}

async function deleteArticleAPI(slug: string, token: string) {
    const response = await fetch(`${baseURL}/articles/${slug}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Ошибка при удалении статьи');
    }
    return true;
}

async function favoriteArticle (article: Article, token: string){
    const response = await fetch(`${baseURL}/articles/${article.slug}/favorite`,{
        method: "POST",
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Ошибка при удалении статьи');
    }
    const data = await response.json();

    return data
}

async function unFavoriteArticle (article: Article, token: string){
    const response = await fetch(`${baseURL}/articles/${article.slug}/favorite`,{
        method: "DELETE",
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Ошибка при удалении статьи');
    }
    const data = await response.json();

    return data
}

export const createArticle = createAsyncThunk(
    'articles/create',
    async ({ article, token }: { article: ArticleCreate; token: string }, { rejectWithValue }) => {
        try {
            const data = await createArticleAPI(article, token);
            return data.article;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateArticle = createAsyncThunk(
    'articles/update',
    async ({ article, token }: { article: UpdateArticlePayload; token: string }, { rejectWithValue }) => {
        try {
            const data = await updateArticleAPI(article, token);
            return data.article;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteArticle = createAsyncThunk(
    'articles/delete',
    async ({ slug, token }: { slug: string; token: string }, { rejectWithValue }) => {
        try {
            await deleteArticleAPI(slug, token);
            return slug;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const likeArticle = createAsyncThunk(
    'articles/favorite',
    async ({article, token}: {article: Article, token: string}, thunkAPI)=>{
        try{
           const response = await favoriteArticle(article, token);
           return { article: response.article };
        }catch (e: any){
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)
export const unLikeArticle = createAsyncThunk(
    'articles/unFavorite',
    async ({article, token}: {article: Article, token: string}, thunkAPI)=>{
        try{
            const response = await unFavoriteArticle(article, token);
            return { article: response.article };
        }catch (e: any){
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(createArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(createArticle.fulfilled, (state, action: PayloadAction<Article>) => {
            state.loading = false;
            state.articles.push(action.payload);
        });

        builder.addCase(createArticle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(updateArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
            state.loading = false;
            const index = state.articles.findIndex((a) => a.slug === action.payload.slug);
            if (index !== -1) state.articles[index] = action.payload;
        });

        builder.addCase(updateArticle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(deleteArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.articles = state.articles.filter((a) => a.slug !== action.payload);
        });

        builder.addCase(deleteArticle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(likeArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(likeArticle.fulfilled, (state, action) => {
            state.loading = false;
            const updated = action.payload.article;
            state.articles = state.articles.map(article =>
                article.slug === updated.slug ? updated : article
            );

        });

        builder.addCase(likeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder.addCase(unLikeArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            });

        builder.addCase(unLikeArticle.fulfilled, (state, action) => {
            state.loading = false;
            const updated = action.payload.article;
            state.articles = state.articles.map(article =>
                article.slug === updated.slug ? updated : article
            );

        });

        builder.addCase(unLikeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default articlesSlice.reducer;
