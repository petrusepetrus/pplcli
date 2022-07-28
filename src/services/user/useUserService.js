import axios from "axios";
import errorHandler from "../api/apiErrorHandler.js";

export default function useUserService() {
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
            return Promise.reject (errorMessage)
        }
    );
    const getUser=async(payload)=>{
        console.log(payload)
        let response= await apiClient.get('/user/' + payload)
        console.log(response.data)
        return response
    }
    /*
    Users
     */
    const getUsers=async(payload)=>{
        console.log(payload)
        let response= await apiClient.get('/users/?page=' + payload.pageNumber,{
            params:payload
        })
        return response.data
    }
    /*
    Addresses
     */
    const addUserAddress = async(payload,userID) => {
        let response= await apiClient.post('/store-address/user/'+ userID ,payload)
        return response.data
    }
    const updateUserProfile = async ( payload, userID) => {
        console.log("updating user")
        await apiClient.put("/user/" + userID, payload)
        console.log("finished updating user")
    }
    const updateUserAddress = async(payload,userID,addressID) => {
        let response= await apiClient.post('/update-address/user/'+ userID + '/address/' + addressID,payload)
        return response.data
    }

    const deleteUserAddress = async(userID,addressID) => {
        let response= await apiClient.delete('/delete-address/user/'+ userID + '/address/' + addressID )
        return response.data
    }

    const getUserAddresses = async(payload)=>{
        let response=await apiClient.get('/user-addresses/' + payload + '/')
        return response.data
    }

    const getAvailableAddressTypes = async(userID) => {
        let response= await apiClient.get('/available-address-types/user/' + userID)
        return response.data
    }
    /*
    Phone numbers
     */
    const addUserPhone = async(payload,userID) => {
        let response= await apiClient.post('/store-phone/user/'+ userID ,payload)
        return response.data
    }

    const updateUserPhone = async(payload,userID,phoneID) => {
        let response= await apiClient.post('/update-phone/user/'+ userID + '/phone/' + phoneID,payload)
        return response.data
    }

    const deleteUserPhone = async(userID,phoneID) => {
        let response= await apiClient.delete('/delete-phone/user/'+ userID + '/phone/' + phoneID )
        return response.data
    }

    const getUserPhones = async(payload)=>{
        console.log(payload)
        let response=await apiClient.get('/user-phones/' + payload + '/')
        console.log(response.data)
        return response.data
    }

    const getAvailablePhoneTypes = async(userID) => {
        let response= await apiClient.get('/available-phone-types/user/' + userID)
        return response.data
    }
    /*
    userTypes
     */
    const getUserTypes = async() => {
        let response= await apiClient.get('/user-types')
        return response.data
    }
    const getUserUserTypes = async(userID) => {
        let response= await apiClient.get('/user-types/user/' + userID)
        console.log(response.data)
        return response.data
    }
    const getAvailableUserTypes = async(userID) => {
        let response= await apiClient.get('/available-user-types/user/' + userID)
        return response.data
    }
    const getUserTypeStatuses = async() => {
        let response= await apiClient.get('/user-type-status')
        return response.data
    }
    const updateUserTypes=async(payload, userID)=>{
        let response=await apiClient.post('/update-user-types/user/'+ userID,payload)
        return response.data
    }

    return{
        getUser,
        getUsers,
        updateUserProfile,
        getUserTypes,
        getUserUserTypes,
        getAvailableUserTypes,
        getUserTypeStatuses,
        updateUserTypes,
        addUserAddress,
        updateUserAddress,
        deleteUserAddress,
        getUserAddresses,
        getAvailableAddressTypes,
        addUserPhone,
        updateUserPhone,
        deleteUserPhone,
        getUserPhones,
        getAvailablePhoneTypes,
    }
}