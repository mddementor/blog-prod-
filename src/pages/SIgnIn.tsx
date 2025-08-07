import {Link, useNavigate} from "react-router-dom";
import {loginUser} from "../store/authSlice.tsx";
import {useState} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../store/store.tsx";
import { Button, Form, Input } from 'antd';
import {useSelector} from "react-redux";
import type {RootState} from "../store/store.tsx";
import {onFinish} from "../utilits.ts";
import {onFinishFailed} from "../utilits.ts";

export type fieldType = {
    username?: string;
    password?: string;
}

const SignIn: React.FC = () => {

    const dispath = useDispatch<AppDispatch>();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const isAuth = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()

    const handleLogin = () => {
        dispath(loginUser({ email, password}));
        if (isAuth){
            navigate('/')
        }
    }

    return (
        <Form className='sign-in-window'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
        >
            <p>SignIn</p>
            <label>
                <p>Email address</p>
                <Form.Item<fieldType>
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        placeholder='Email address'
                        className='email__address'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </Form.Item>
            </label>
            <label>
                <p>Password</p>
                <Form.Item<fieldType>
                    name="password"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input.Password
                        placeholder='Password'
                        className='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </Form.Item>

            </label>
            <Button
                className='login-button'
                onClick={handleLogin}
            >
                Login
            </Button>
            <div className='linkSU'>
                Dont have an account?
                <Link to='/register'>SignUp</Link>
            </div>
        </Form>
    )
};

export default SignIn;