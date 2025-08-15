import { getPosts, setPage } from "../store/postListSlice";
import { useEffect } from "react";
import type { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../store/store';
import DemoPost from "./DemoPost.tsx";
import { Pagination } from "antd";
import {useSearchParams} from "react-router-dom";

const PostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const postData = useSelector((state: RootState) => state.posts.postsData);
    const totalPost = useSelector((state: RootState) => state.posts.total);
    const page = useSelector((state: RootState) => state.posts.page);
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        const pageFromUrl = Number(searchParams.get("page"));
        dispatch(setPage(pageFromUrl));
        dispatch(getPosts(pageFromUrl));
    }, [dispatch]);

    const handleChange = (page: number) => {
        dispatch(setPage(page));
        dispatch(getPosts(page));
        setSearchParams({ page: String(page) });
    };

    return (
        <>
            <ul className='post_list'>
                {postData.map((item, index) => (
                    <li key={index} className='post_list__item'>
                        <DemoPost slug={item.slug} />
                    </li>
                ))}
            </ul>
            <div className='pagination-wrapper'>
                <Pagination
                    current={page}
                    total={totalPost}
                    onChange={handleChange}
                    showSizeChanger={false}
                />
            </div>
        </>
    );
};

export default PostList;
