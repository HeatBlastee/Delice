import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/dashboard/Home';

export const SERVER_URI = import.meta.env.VITE_SERVER_URI;
function App() {
  const { userData } = useSelector((state: RootState) => state.user);

  useGetCurrentUser()
  return (
    <>
      <Routes>
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
      </Routes>
      <Toaster position="bottom-right"
        reverseOrder={false} />

    </>
  )
}

export default App
