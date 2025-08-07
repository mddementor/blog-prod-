import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store.tsx";
import { logout } from '../store/authSlice.tsx';
import type { AppDispatch } from "../store/store.tsx";
import { Button } from 'antd'
import defaultAvatar from '../assets/avatar-default-symbolic-svgrepo-com (1).svg'

const Header: React.FC = () => {
    const auth = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();
    const isAuth = !!localStorage.getItem('token');
    const userJSON = localStorage.getItem('user');
    const user = userJSON ? JSON.parse(userJSON) : null;

    return (
        <header className='header'>
            <div className='header-item'>
                Realworld Blog
            </div>
            {
                !isAuth ?
                    <div className='nav-auth'>
                        <Link to='/login' className='sign_in_link'>
                            SignIn
                        </Link>
                        <Link to='/register' className='sign_up_link'>
                            SignUp
                        </Link>
                    </div>
                    :
                    <div className='nav-bar'>
                        <Link to='/createArticle'
                              className='createArticle'
                        >
                            Create article
                        </Link>
                        <div className='user-info' style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to='/editProfile'
                                  className='editProfile'
                            >
                                {user?.name}
                            </Link>
                            <img
                                src={`${auth.user?.image}  ${user?.image} || ${defaultAvatar}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    marginLeft: '20px',
                                    marginRight: '20px',
                                    borderRadius: '50%',
                                    border: '0',
                                }}
                                alt="User profile avatar"
                            />
                        </div>
                        <Button onClick={() => {
                            dispatch(logout())
                        }}>
                            LogOut
                        </Button>
                    </div>
            }
        </header>
    )
};

export default Header;