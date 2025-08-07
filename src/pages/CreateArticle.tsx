import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { validateTitle, validateDescription, validateText } from "../utilits.ts";
import { createArticle } from "../store/postSlice.ts";
import type {AppDispatch} from "../store/store.tsx";
import {useNavigate} from "react-router-dom";

interface ArticleCreate {
    title: string;
    description: string;
    body: string;
    tagList: string[];
    slug?: string;
}



const CreateArticle = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState('');
    const [short, setShort] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState<{ id: string; value: string }[]>([]);

    const addTag = () => {
        setTags([...tags, { id: uuidv4(), value: '' }]);
    };

    const removeTag = (id: string) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    const updateTag = (id: string, newValue: string) => {
        setTags(tags.map(tag => tag.id === id ? { ...tag, value: newValue } : tag));
    };

    return (
        <div className='create-form'>
            <h2 className='create-form--h2'>Create new article</h2>
            <Form
                layout='vertical'
                onFinish={() => {
                    const cleanTags = tags.map(tag => tag.value.trim()).filter(tag => tag !== '');
                    const token = localStorage.getItem('token');
                    dispatch(createArticle({
                        article: {
                            title,
                            description: short,
                            body: text,
                            tagList: cleanTags,
                            slug: '',
                        } as ArticleCreate,
                        token: token!
                    })).then(()=> navigate('/'))
                }}
            >
                <Form.Item
                    name='Title'
                    label='Title'
                    rules={[
                        { required: true },
                        {
                            validator: (_, value) =>
                                validateTitle(value)
                                    ? Promise.resolve()
                                    : Promise.reject('This field must be filled in.')
                        }
                    ]}
                >
                    <Input
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name='Short description'
                    label='Short description'
                    rules={[
                        { required: true },
                        {
                            validator: (_, value) =>
                                validateDescription(value)
                                    ? Promise.resolve()
                                    : Promise.reject('This field must be filled in.')
                        }
                    ]}
                >
                    <Input
                        placeholder='Short description'
                        value={short}
                        onChange={(e) => setShort(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name='Text'
                    label='Text'
                    rules={[
                        { required: true },
                        {
                            validator: (_, value) =>
                                validateText(value)
                                    ? Promise.resolve()
                                    : Promise.reject('This field must be filled in.')
                        }
                    ]}
                >
                    <Input.TextArea
                        className='create-form-text'
                        placeholder='Text'
                        rows={6}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Form.Item>

                <div>

                    {tags.map((tag, index) => (
                        <div key={tag.id} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <Input
                                placeholder={`Tag #${index + 1}`}
                                value={tag.value}
                                onChange={(e) => updateTag(tag.id, e.target.value)}
                                style={{ width: '200px' }}
                            />
                            <Button danger onClick={() => removeTag(tag.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                    <Button type='dashed' onClick={addTag}>Add tag</Button>
                </div>

                <Button type='primary' htmlType='submit' style={{ marginTop: '16px' }}>
                    Create Article!
                </Button>
            </Form>
        </div>
    );
};

export default CreateArticle;
