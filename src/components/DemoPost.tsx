import { useSelector } from "react-redux";
import { useAppDispatch } from "../utilits.ts";
import { likeArticle, unLikeArticle } from "../store/postSlice.ts";
import { getDatePost } from "../utilits.ts";
import type {RootState} from "../store/store.tsx";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from "react-router-dom";
import type {Article} from "../store/postSlice.ts";

const DemoPost = ({ slug }: { slug: string }) => {
    const dispatch = useAppDispatch();

    const post = useSelector((state: RootState) =>
        state.posts.postsData.find((p) => p.slug === slug)
    );

    if (!post) return null;

    const handleLike = () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = user?.token;
        if (!token) return;

        if (post.favorited) {
            dispatch(unLikeArticle({ article: post as Article, token }));
        } else {
            dispatch(likeArticle({ article: post as Article, token }));
        }
    };


    return (
        <div className='demoPost'>
            <section className='main__demo'>
                <div className='post_title'>
                    <Link to={`/articles/${post.slug}`}>{post.title}</Link>
                    <button
                        className='likes_button'
                        onClick={handleLike}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}
                    >
                        {post.favorited ? (
                            <HeartFilled style={{ color: 'red', fontSize: 20 }} />
                        ) : (
                            <HeartOutlined style={{ color: 'gray', fontSize: 20 }} />
                        )}
                        <span style={{ marginLeft: '4px' }}>{post.favoritesCount}</span>
                    </button>
                </div>

                <div className='tags'>
                    {post.tagList.map((tag: string, index: number) => (
                        <span className='tag' key={index}>
              {tag}
            </span>
                    ))}
                </div>

                <div className='demo_description'>{post.description}</div>
            </section>

            <section className='post-info'>
                <div>
                    {post.author.username}
                    <br />
                    {getDatePost(post.createdAt)}
                </div>
                <img className='user_image' src={post.author.image} alt='avatar' />
            </section>
        </div>
    );
};

export default DemoPost;