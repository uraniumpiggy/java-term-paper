import './App.css';
import {Route, Routes} from 'react-router-dom';
import Auth from './pages/Auth';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import { AccountPage } from './pages/AccountPage';
import { MainGrid } from './pages/MainGrid';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostPage } from './pages/PostPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route path='/' element={<MainPage/>}>
            <Route path='account' element={<AccountPage/>}></Route>
            <Route path='myposts' element={<CreatePostPage/>}></Route>
            <Route path='posts/:id' element={<PostPage/>}></Route>
            <Route path='' element={<MainGrid/>}></Route>
            <Route path='admin' element={<AdminPage/>}></Route>
          </Route>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/registration' element={<Register/>}/>
        </Routes>
      
    </div>
  );
}

export default App;
