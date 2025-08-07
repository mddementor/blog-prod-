import type {Article, UpdateArticlePayload} from "../utilits.ts";

const baseURL = 'https://blog-platform.kata.academy/api';

export const create = async (article: Article, token: string):Promise<void> => {
    try{
        const response = await fetch(`${baseURL}/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ article })
        });
        if(!response.ok){
            const errorData = await response.json();
            console.error('Ошибка при создании статьи:', errorData);
            throw new Error('Не удалось создать статью');
        }

        const data = await response.json();
        console.log('Статья успешно создана:', data);
        return data
    }catch (error){
        console.log(error)
    }
};

export const update = async (article: UpdateArticlePayload, token: string) => {
    try{
        const response = await fetch(`${baseURL}/articles/${article.slug}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ article })
        });
        if(!response.ok){
            const errorData = await response.json();
            console.error('Ошибка при создании статьи:', errorData);
            throw new Error('Не удалось создать статью');
        }

        const data = await response.json();
        console.log('Статья успешно обновлена:', data);
        return data
    }catch(error){
        console.log(error)
    }
};

export const deleteArticle = async (slug: string, token: string) => {
    try{
        const response =await fetch(`${baseURL}/articles/${slug}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },

        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка при удалении статьи:', errorData);
            throw new Error('Не удалось удалить статью');
        }

        console.log('Статья успешно удалена');
        return true;

    }catch (error){
        console.log(error)
        return false
    }
};