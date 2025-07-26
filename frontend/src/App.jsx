import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from './store/useAuthStore';

import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import MainHomePage from './pages/MainHomePage';
import Subscriptions from './pages/Subscription';
import Movies from './pages/Movies/Movies';
import TVShows from './pages/TVShows/TVShows';
import HomePage from './pages/HomePage';
import ChatButton from './components/ChatButton';
import Payment from './pages/Payment';
import TVShowDetails from './pages/TDetails/TDetails';
import MovieDetails from './pages/MDetails/MDetails';

const App  = () => {
  const {authUser,checkAuth,subscribed,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme}=useThemeStore();

  console.log({onlineUsers});

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div>
      <Navbar />
      <ChatButton/>
      <Routes>
        <Route path='/' element={authUser?<MainHomePage/>:<Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to="/"/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser?<ProfilePage/> :<Navigate to="/login"/>}/>
        <Route path='/MainHomePage' element={authUser?<MainHomePage/> :<Navigate to="/login"/>}/>
        <Route path='/Subscriptions' element={authUser?<Subscriptions/> :<Navigate to="/login"/>}/>
        <Route path='/Movies' element={authUser?<Movies/> :<Navigate to="/login"/>}/>
        <Route path='/TVShows' element={authUser?<TVShows/> :<Navigate to="/login"/>}/>
        
        <Route
          path="/tvshows/:id"
          element={
            authUser ? (
              subscribed ? (
                <TVShowDetails />
              ) : (
                <Navigate to="/Subscriptions" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/movies/:id"
          element={
            authUser ? (
              subscribed ? (
                <MovieDetails  />
              ) : (
                <Navigate to="/Subscriptions" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path='/HomePage' element={authUser?<HomePage/> :<Navigate to="/login"/>}/>
        <Route path='/Payment' element={authUser?<Payment/> :<Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App