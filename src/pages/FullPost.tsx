import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteArticle, likeArticle, unLikeArticle} from "../store/postSlice.ts";
import {loadFullPost} from "../store/fullPostSlice";
import { useAppDispatch, useAppSelector } from "../utilits.ts";
import {getDatePost} from "../utilits.ts";
import { Button } from "antd";
import {useNavigate} from "react-router-dom";
import {Modal} from "antd";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const FullPost = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const fullPost  = useAppSelector((state) => state.fullPost.post);
    const navigate = useNavigate();

    const [like, setLike] = useState(false);
    useEffect(() => {
        if(slug){
            dispatch(loadFullPost(slug))
        }
    }, [slug, dispatch]);

    const isOwner = localStorage.getItem('user');
    if(!isOwner){
        return
    }
    const isOwnerParse =    JSON.parse(isOwner);


    const handleLike = () => {
        if (!isOwnerParse) return;
        const token = isOwnerParse.token

        if (fullPost && fullPost.favorited) {
            dispatch(unLikeArticle({ article: fullPost, token }));
            setLike(false);

        } else {
            dispatch(likeArticle({ article: fullPost, token }));
            setLike(true);
        }
        setLike(!like)
    };

    if(fullPost) {
        return (
            <div className='fullPost'>
                <Modal
                    open={isOpen}
                    title="Are you sure you want to delete this post?"
                    onCancel={() => setIsOpen(false)}
                    onOk={() => {
                        if (slug) {
                            dispatch(deleteArticle({ slug, token: isOwnerParse.token }));
                            setIsOpen(false);
                            navigate('/');
                        }
                    }}
                >
                    <p>This action cannot be undone.</p>
                </Modal>

                <header
                    className='fullPost-header'
                >
                    <div className='left-head'>
                        {fullPost.title}
                        <div style={{margin: '12px 0', display: 'flex', alignItems: 'center'}}>
                            <button
                                onClick={handleLike}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                }}
                            >
                                {fullPost.favorited ? (
                                    <HeartFilled style={{color: 'red', fontSize: 20}}/>
                                ) : (
                                    <HeartOutlined style={{color: 'gray', fontSize: 20}}/>
                                )}
                                <span style={{marginLeft: '6px'}}>{fullPost.favoritesCount}</span>
                            </button>
                        </div>

                        <p className='tags'>
                            {fullPost.tagList && fullPost.tagList.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className='tag'
                                >
                               {tag}
                           </span>
                            ))}
                        </p>

                    </div>
                    <div className='rigth-head'>
                        {fullPost.author.username}<br/>
                        {getDatePost(fullPost.createdAt)}
                        <img
                            alt='avatar'
                            className='avatar'
                            src={fullPost.author.image}

                        />
                    </div>
                </header>
                <div>
                    {fullPost.description}
                    {
                        isOwnerParse !== null &&
                        isOwnerParse.name === fullPost.author.username ?
                            <>
                                <Button
                                    onClick={()=> {
                                        navigate(`/articles/${slug}/edit`)
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsOpen(true)
                                    }}
                                >
                                    Delete
                                </Button>
                            </>:
                            <></>
                    }
                </div>
                <br/>

                {fullPost.body}

            </div>
        )
    }
};
export default FullPost;