import { Form, Input, Button } from "antd";
import { useCallback, useState } from "react";
import { updateUser } from "../store/authSlice.tsx";
import { useEffect } from "react";
//import {useSelector} from "react-redux";
// type {RootState} from "../store/store.tsx";
import { onFinishFailed, allTrue,
    onFinish, validatePassword, validateEmail,
    validateName, validateAvatarUrl } from "../utilits.ts";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../store/store.tsx";
type fieldType = {
    Username?: string;
    EmailAdress?: string;
    Password?: string;
    avatar?: string;
};

const EditProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = localStorage.getItem('token');
    const [password, setPassword] = useState('');
    const [username, setUserName] =useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] =useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user?.name) {
            setUserName(user.name);
        }
    }, []);


    const handleSubmit = useCallback(() => {
        const isValid = allTrue(
            () => validateName(username),
            () => validateEmail(email),
            () => validatePassword(password),
            () => validateAvatarUrl(avatar)
        );

        if (isValid && token) {
            dispatch(updateUser({email, username, password, token}))
        }

    }, [username, email, password, avatar, dispatch, token]);
    
    return(
        <Form
            layout='vertical'
            className='editProfile-window'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}

        >
            Edit profile
            <Form.Item
                <fieldType>
                name='Username'
                label='Username'
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Please, input your username!' }]}
            >
                <Input
                    style={{ width: '100%' }}
                    placeholder='Username'
                    value={username}
                    onChange={(e) => {
                        setUserName(e.target.value)
                    }}
                />
            </Form.Item>
            <Form.Item
                <fieldType>
                name='EmailAdress'
                label='Email adress'
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Please, input your email!' }]}
            >
                <Input
                    placeholder='Email adress'
                    style={{ width: '100%' }}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
            </Form.Item>
            <Form.Item
                <fieldType>
                name='Password'
                label='Password'
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Please, input your password!' }]}
            >
                <Input
                    style={{ width: '100%' }}
                    placeholder='Password'
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
            </Form.Item>
            <Form.Item
                <fieldType>
                name='avatar'
                label='Avatar'
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Please, input link on your avatar!' }]}
            >
                <Input
                    style={{ width: '100%' }}
                    placeholder='Avatar image (url)'
                    value={avatar}
                    onChange={(e) => {
                        setAvatar(e.target.value)
                    }}
                />
            </Form.Item>
            <Button
                onClick={()=> {
                    console.log(handleSubmit())
                }}
            >
                Save
            </Button>
        </Form>
    )
}

export default EditProfile