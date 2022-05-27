import axios from "axios";
import errorHandler from "../errors/useErrorHandler";
import {useAuthStore} from "../../stores/AuthStore";
import {storeToRefs} from 'pinia'

export default function useAuthService() {
    /*
    The base axios structure for the call to the laravel back end.
        withCredentials: true is required to handle the CSRF token to/from sanctum
     */
    const authClient = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
    })
    /*
    Add a response interceptor to provide generic handling of success/fails
     */
    authClient.interceptors.response.use(
        (response) => {
            /*
            Trap the error whereby an already authenticated user is trying to log in again.
            Force the logout and make them re-enter their credentials
             */
            if(response.status===200 && response.data.error==="Already authenticated."){
                logout()
                const errorResponse={}
                let errorMessage = ['There has been a problem with your authentication. Please sign in again.']
                errorResponse.general = errorMessage
                return Promise.reject (errorResponse)
            }
            /*
            Otherwise, all good. Return the received response from Axios.
             */
            return response;
        },
        function (error) {
            let errorMessage=errorHandler(error)
            console.log(errorMessage)
            return Promise.reject (errorMessage)
        }
    );


    /*
    call the login end point
     */
    const login = async (payload) => {
        await authClient.get('/sanctum/csrf-cookie')
        await authClient.post('login', payload)

        return await callUserAPI()
    }
    /*
    logout
     */
    const logout = () => {
        const authStore = useAuthStore()
        const {user,verified,authenticated} = storeToRefs(authStore)
        user.value = {}
        authenticated.value = false
        verified.value=false
        return authClient.post('/logout')
    }
    /*
    register new user
     */
    const registerUser = async (payload) => {
        await authClient.get('/sanctum/csrf-cookie')
        return authClient.post('/register', payload)
    }
    /*
    set password
     */
    const resetPassword = async (payload) => {
        await authClient.get('/sanctum/csrf-cookie')
        return await authClient.post('/reset-password', payload)
    }
    /*
    call the get user endpoint
    */
    const callUserAPI = async() => {
        const authStore = useAuthStore()
        const {user,verified,authenticated,userRoles} = storeToRefs(authStore)
        //let response= await authClient.get('/api/user')
        let response= await authClient.get('/api/auth')

        console.log(response.data.data)
        authStore.user.id=response.data.data.id
        authStore.user.first_name=response.data.data.first_name
        authStore.user.last_name=response.data.data.last_name
        authStore.user.name=response.data.data.name
        authStore.user.email=response.data.data.email
        authStore.user.avatar =response.data.data.avatar
        authStore.user.email_verified_at=response.data.data.email_verified_at
        authStore.authenticated = true
        authStore.verified = !!response.data.data.email_verified_at;
        authStore.userRoles=response.data.data.roles
        authStore.userPermissions=response.data.data.permissions
        //response= await apiClient.get('/user-roles/' + authStore.user.id + '/')
        //authStore.userRoles=response.data
        return authStore.user
    }

    const getUserRoles = async(userID)=>{
        let response=await apiClient.get('/user-roles/' + userID + '/')
        return response.data
    }

    const sendVerificationEmail = async (userId) => {
        console.log("send verification email")
        await authClient.get('/sanctum/csrf-cookie')
        await authClient.post('email/verification-notification', userId)
        await callUserAPI()
    }
    const sendResetEmail = async (credentials) => {
        await authClient.get('/sanctum/csrf-cookie')
        await authClient.post('/forgot-password', credentials)
    }
    const updateUser=async(payload)=>{
        console.log("updating user")
        await authClient.put("/user/profile-information", payload)
        await callUserAPI()
        console.log("finished updating user")
    }
    return{
        login,
        logout,
        resetPassword,
        registerUser,
        callUserAPI,
        sendVerificationEmail,
        sendResetEmail,
        updateUser
    }
}