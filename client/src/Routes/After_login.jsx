import React from 'react'
import { useAuth } from '../context/authContext';
import MainHeader from '../components/MainHeader';
import { redirect } from 'react-router-dom';
export default function After_login() {
  const { isAuthorized ,user} = useAuth();
 
  return (
    <> <MainHeader />
    <div className="h-screen flex items-center justify-center  bg-gradient-to-br from-sky-50 to-sky-200 text-2xl">
      <div><h1>hello you are logged in sucsusfully</h1>
      
        <p>isAuthorized: {isAuthorized? "true" : "false"}</p>
        <p>user id: {user.id}</p>
        <p>user name: {user.name}</p>
        <p>isAdmin: {user.isAdmin? "true" : "false"}</p>
      </div>
    </div>
    </>
  )
}
