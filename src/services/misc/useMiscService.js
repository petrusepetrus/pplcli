import axios from "axios";
import errorHandler from "../api/apiErrorHandler.js";

export default function useMiscService() {
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
    const getCountries = async() => {
        let response= await apiClient.get('/countries')
        return response.data
    }
    const getAddressTypes = async() => {
        let response= await apiClient.get('/address-types')
        return response.data
    }
    const getPhoneTypes = async() => {
        let response= await apiClient.get('/phone-types')
        return response.data
    }

    return{
        getCountries,
        getAddressTypes,
        getPhoneTypes
    }
}