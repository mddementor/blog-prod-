import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Header from "./components/Header.tsx";
import "../src/styles/index.scss";
import PostList from "./components/postList.tsx";
import FullPost from "./pages/FullPost.tsx";
import SignIn from "./pages/SIgnIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import CreateArticle from "./pages/CreateArticle.tsx";
import EditProfile from "./pages/editProfile.tsx";
import UpdateArticle from './pages/editArticle.tsx';

function App() {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path="/" element={<PostList/>} />
            <Route path="/articles/:slug" element={<FullPost />} />
            <Route path='articles/:slug/edit' element={<UpdateArticle/>}/>
            <Route path='/login' element={<SignIn />} />
            <Route path='/register' element={<SignUp />} />
            <Route path='/createArticle' element={<CreateArticle />} />
            <Route path='editProfile' element={<EditProfile/>} />
        </Routes>

    </BrowserRouter>
  )
}

export default App
