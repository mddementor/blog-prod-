import { useSelector, useDispatch } from "react-redux";
import type {TypedUseSelectorHook} from  "react-redux"
import type { AppDispatch, RootState } from "./store/store.tsx";
import type {FormProps} from "antd";
import type {fieldType} from "./pages/SIgnIn.tsx";

export interface Article {
    title: string,
    description: string,
    body: string,
    tagList: string[],
    slug: string
}

export interface UpdateArticlePayload {
    title: string;
    description: string;
    body: string;
    tagList: string[];
    slug: string;
}


export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getDatePost = (isoDate: string) => {
    const months = ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
    const date = new Date(isoDate);
    return `${ months[(date.getMonth())]} ${date.getDate()}, ${date.getFullYear()}`
};

export const validateEmail = (str: string) => {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    return EMAIL_REGEXP.test(str)
};

export const validateName = (str: string) => {
    const USERNAME_REGEXP = 3 <= str.length && str.length <= 20;
    return USERNAME_REGEXP;
};

export const validatePassword = (str: string) => {
    const validPass =  6 <= str.length && str.length <= 40;
    return validPass;
};

export const validateAvatarUrl = (url: string): boolean => {
    if (!url) return false;

    const IMAGE_EXT_REGEXP = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

    try {
        new URL(url);
    } catch {
        return false;
    }

    if (!IMAGE_EXT_REGEXP.test(url)) {
        return false;
    }

    return true;
};

export const allTrue = (...funcs: Array<()=> boolean>): boolean => {
    return funcs.every((fn)=> typeof fn === 'function' && fn())
};

export const onFinish: FormProps<fieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

export const onFinishFailed: FormProps<fieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const validateTitle = (value: string) => {
    return value.trim() !== ''
};

export const validateDescription = (value: string) => {
    return value.trim() !== ''
};

export const validateText = (value: string) => {
    return value.trim() !== ''
};

// export type article = {
//         slug: string,
//         "title": string,
//         "description": string,
//         "body": string,
//         "tags": string[],
//         "createdAt": string,
//         "updatedAt": string,
//         "favorited": boolean,
//         "favoritesCount": number,
//         "author": {
//         "bio": string,
//             "image": string,
//             "username": string,
//             "following": boolean
//     }
// }
