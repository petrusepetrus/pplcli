import axios from "axios";
import errorHandler from "../errors/useErrorHandler";

export default function useAPIService() {
    /*
    The base axios structure for the call to the laravel back end.
        withCredentials: true is required to handle the CSRF token to/from sanctum
     */
    const apiClient = axios.create({
        baseURL: 'http://localhost:8000' + "/api",
        withCredentials: true,
    })
    /*
    Add a response interceptor to provide generic handling of success/fails
     */
   apiClient.interceptors.response.use(
        (response) => {
            /*
            All good. Return the received response from Axios.
             */
            return response;
        },
        function (error) {
            let errorMessage=errorHandler(error)
            console.log(errorMessage)
            return Promise.reject (errorMessage)
        }
    );
    return{
        apiClient,
    }
}