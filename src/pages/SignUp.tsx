import { Link, useNavigate } from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../store/store.tsx";
import { Button, Form, Input, Checkbox, } from 'antd';
import {onFinishFailed, validateName, validateEmail, validatePassword} from "../utilits.ts";
import {registerUser} from "../store/authSlice.tsx";

type fieldType = {
    username?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    agreement?: boolean;
};



const SignUp = () => {
    const dispatch: AppDispatch = useDispatch()
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [agreement, setAgreement] = useState(false);
    const navigate = useNavigate();

    return (
        <Form
            className='register-window'
            onFinish={(values: Required<Pick<fieldType, 'username' | 'email' | 'password'>>) => {
                const { username, email, password } = values;
                dispatch(registerUser({
                    userName: username,
                    email,
                    password
                })).then(() => navigate('/'));
            }}
            onFinishFailed={onFinishFailed}
            layout='vertical'
        >
            <div>Create new account</div>
            <Form.Item<fieldType>
                className='input-Sign-Up'
                name='username'
                label='Username'
                rules={[{ required: true},
                    {
                        validator: (_, value)=> {
                            return validateName(value)
                            ? Promise.resolve()
                            : Promise.reject('Username must be 3–20 characters and only letters/numbers')
                        }
                    }
                ]}
            >

                <Input
                    placeholder='Username'
                    value={userName}
                    onChange={(e)=>{setUserName(e.target.value)}}
                />
            </Form.Item>
            <Form.Item<fieldType>
                className='input-Sign-Up'
                name='email'
                label='Email address'
                rules={[{ required: true},
                    {
                        validator: (_, value)=> {
                            return validateEmail(value)
                                ? Promise.resolve()
                                : Promise.reject('The email must be a valid mailing address.')
                        }
                    }
                ]}
            >
                <Input
                    placeholder='Email address'
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                />
            </Form.Item>
            <Form.Item<fieldType>
                className='input-Sign-Up'
                name='password'
                label='Password'
                rules={[{ required: true},
                    {
                        validator: (_, value)=> {
                            return validatePassword(value)
                                ? Promise.resolve()
                                : Promise.reject('The password must be between 6 and 40 characters (inclusive)')
                        }
                    }
                ]}
            >
                <Input
                    placeholder='Password'
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
            </Form.Item>
            <Form.Item<fieldType>
                className='input-Sign-Up'
                name='repeatPassword'
                label='RepeatPassword'
                dependencies={[password]}
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords must match.'));
                        }
                    })
                ]}
            >
                <Input
                    placeholder='Repeat Password'
                    value={rePassword}
                    onChange={(e)=>{setRePassword(e.target.value)}}
                />
            </Form.Item>
            <Form.Item<fieldType>
            >
                <Checkbox
                    className='check'
                    checked={agreement}

                    onChange={()=> {setAgreement(!agreement)}}
                >
                    I agree to the processing of my personal information
                </Checkbox>
            </Form.Item>
            <Button type='primary' htmlType='submit'
                    onClick={() => {
                        registerUser({email, password, userName})
                    }}
            >
                Create
            </Button>
            <section>
                Already have an account? <Link to='/login'>Sign In.</Link>
            </section>
        </Form>
    )
};

export default SignUp;