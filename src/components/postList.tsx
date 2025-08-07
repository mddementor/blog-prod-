import { getPosts } from "../store/postListSlice";
import { useEffect } from "react";
import type { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../store/store';
import DemoPost from "./DemoPost.tsx";
import { Pagination } from "antd";
import { setPage } from "../store/postListSlice";

const PostList =  () => {
    //const user = useSelector((state: RootState)  => state.user)
    const dispatch = useDispatch<AppDispatch>();

    const postData = useSelector(( state: RootState) => state.posts.postsData);

    const totalPost = useSelector((state: RootState)=> state.posts.total);


    useEffect(() => {
        dispatch(getPosts(1))
    }, [dispatch]);

    const handleChange = (page: number) => {
        dispatch(setPage(page))
        dispatch(getPosts(page))

    }
    return(
        <>
            <ul className='post_list'>
                {postData.map((item, index) => (
                    <li key={index} className='post_list__item'>
                        <DemoPost slug={item.slug}/>
                    </li>
                ))}
            </ul>
            <div className='pagination-wrapper'>
                <Pagination
                    defaultCurrent={1}
                    total={totalPost}
                    onChange={handleChange}
                    showSizeChanger={false}
                />
            </div>
        </>
    )
};

export default PostList;