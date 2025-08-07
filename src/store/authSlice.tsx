import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/user.tsx";
import { register } from "../api/user.tsx";
import type { PayloadAction } from "@reduxjs/toolkit";
import { editProfile } from "../api/user.tsx";

interface initialState {
    user: {
        email: string | null
        name: string | null
        token: string | null
        image: string | null
    }
}

const storedUser = localStorage.getItem('user');

const initialState: initialState = {
    user: storedUser ? JSON.parse(storedUser) : {
        email: null,
        name: null,
        token: null,
        image: null,
    }
}


const loginUser = createAsyncThunk(
    'loginUser',
    async ({email, password}: {email: string, password: string}, thunkAPI) => {
        try{
            const response = await login({email, password});

            return{
                name: response.user.username,
                email: response.user.email,
                token: response.user.token,
                image: response.user.image || ''
            }
        } catch (error: any){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

const registerUser = createAsyncThunk(
    'registerUser',
    async ({ email, password, userName}: {email: string, password: string, userName: string}, thunkAPI) => {
        try{
            const response = await register(email, password, userName);
            await login({email, password})
            return{
                name: response.user.username,
                email: response.user.email,
                token: response.user.token,
                image: response.user.image || null
            }
        }catch (error: unknown){
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');

        }
    }
);

const updateUser = createAsyncThunk(
    'updateUser',
    async (
        { email, username, password, token }: { email: string; username: string; password: string; token: string },
        thunkAPI
    ) => {
        try {
            const response = await editProfile(email, username, password, token);
            return {
                name: response.user.username,
                email: response.user.email,
                token: response.user.token,
                image: response.user.image || null,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);



const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        logout : (state) => {
            state.user = {
                email: null,
                name: null,
                token: null,
                image: null,
            }
            localStorage.clear()
        }
    },
    extraReducers: builder => {
        builder.addCase(loginUser.pending, (state) => {
            state.user.image = null;
            state.user.email = null;
            state.user.token  = null;
            state.user.name = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{name: string; email: string; token: string; image: string}>) => {
            state.user.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user.name = action.payload.name;
            state.user.image = action.payload.image;
            state.user.email = action.payload.email;
        });
        builder.addCase(loginUser.rejected, () => {

        });
        builder.addCase(registerUser.pending, (state)=> {
            state.user.image = null;
            state.user.email = null;
            state.user.token  = null;
            state.user.name = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<{name: string; email: string; token: string; image: string}>) =>{
            state.user.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user.name = action.payload.name;
            state.user.image = action.payload.image;
            state.user.email = action.payload.email;

        });
        builder.addCase(registerUser.rejected, () => {

        });
        builder.addCase(updateUser.pending, (state)=> {
            state.user.image = null;
            state.user.email = null;
            state.user.token  = null;
            state.user.name = null;
        });
        builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<{name: string; email: string; token: string; image: string}>)=>{
            state.user.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user.name = action.payload.name;
            state.user.image = action.payload.image;
            state.user.email = action.payload.email;
        });
    }
});
export { loginUser }
export { registerUser }
export { updateUser }
export default authSlice.reducer
export const {logout} = authSlice.actions