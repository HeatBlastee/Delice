import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { SERVER_URI } from '../App'

function useGetCurrentUser() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${SERVER_URI}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(result.data))

            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()

    }, [])
}

export default useGetCurrentUser
