import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { updateArticle } from '../store/postSlice';
import { loadFullPost } from '../store/fullPostSlice';
import type { AppDispatch, RootState } from '../store/store';

type FormValues = {
    title: string;
    description: string;
    body: string;
};

const UpdateArticle = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { post: fullPostData, isLoading } = useSelector((s: RootState) => s.fullPost);

    const [tags, setTags] = useState<{ id: string; value: string }[]>([]);
    const [form] = Form.useForm<FormValues>();

    // 1) Загружаем пост, если его нет в сторе
    useEffect(() => {
        if (slug && !fullPostData) {
            dispatch(loadFullPost(slug));
        }
    }, [slug, fullPostData, dispatch]);

    // 2) Когда пост загрузился — заполняем форму и теги
    useEffect(() => {
        if (fullPostData) {
            form.setFieldsValue({
                title: fullPostData.title || '',
                description: fullPostData.description || '',
                body: fullPostData.body || '',
            });

            setTags(
                (fullPostData.tagList ?? []).map((t: string) => ({
                    id: uuidv4(),
                    value: t,
                }))
            );
        }
    }, [fullPostData, form]);

    const addTag = () => setTags((prev) => [...prev, { id: uuidv4(), value: '' }]);
    const removeTag = (id: string) => setTags((prev) => prev.filter((t) => t.id !== id));
    const updateTag = (id: string, value: string) =>
        setTags((prev) => prev.map((t) => (t.id === id ? { ...t, value } : t)));

    if (!slug) return <div>Article not found</div>;
    if (isLoading && !fullPostData) return <div>Loading…</div>;

    const onFinish = (values: FormValues) => {
        const cleanTags = tags.map((t) => t.value.trim()).filter(Boolean);

        // Подхват токена (и из user, и из прямого ключа — на всякий случай)
        let token: string | null = null;
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            token = user?.token || localStorage.getItem('token');
        } catch {
            token = localStorage.getItem('token');
        }

        if (!token) {
            console.error('No token found');
            return;
        }

        dispatch(
            updateArticle({
                article: {
                    title: values.title,
                    description: values.description,
                    body: values.body,
                    tagList: cleanTags,
                    slug,
                },
                token,
            })
        ).then(() => navigate('/'));
    };

    return (
        <div className="create-form">
            <h2 className="create-form--h2">Edit article</h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        { required: true, message: 'This field must be filled in.' },
                        // если нужны свои валидаторы — подключай их здесь
                        // { validator: (_, v) => validateTitle(v) ? Promise.resolve() : Promise.reject('...') }
                    ]}
                >
                    <Input placeholder="Title" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Short description"
                    rules={[
                        { required: true, message: 'This field must be filled in.' },
                        // { validator: (_, v) => validateDescription(v) ? Promise.resolve() : Promise.reject('...') }
                    ]}
                >
                    <Input placeholder="Short description" />
                </Form.Item>

                <Form.Item
                    name="body"
                    label="Text"
                    rules={[
                        { required: true, message: 'This field must be filled in.' },
                        // { validator: (_, v) => validateText(v) ? Promise.resolve() : Promise.reject('...') }
                    ]}
                >
                    <Input.TextArea className="create-form-text" placeholder="Text" rows={8} />
                </Form.Item>

                <div>
                    {tags.map((tag, index) => (
                        <div key={tag.id} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                            <Input
                                placeholder={`Tag #${index + 1}`}
                                value={tag.value}
                                onChange={(e) => updateTag(tag.id, e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Button danger onClick={() => removeTag(tag.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                    <Button type="dashed" onClick={addTag}>
                        Add tag
                    </Button>
                </div>

                <Button type="primary" htmlType="submit" disabled={!fullPostData}>
                    Edit Article!
                </Button>
            </Form>
        </div>
    );
};

export default UpdateArticle;
