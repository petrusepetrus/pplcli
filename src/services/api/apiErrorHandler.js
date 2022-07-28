import {useRouter} from "vue-router";
import useAuthService from "../user/useUserService.js";
import generalUtilities from "../../utils/GeneralUtilities.js";

const {logout} = useAuthService()
const router = useRouter()
const {testIfPromise} = generalUtilities()
export default async function errorHandler(error) {

    console.log("in the error handler")
    let errorResponse = {}
    let errorMessage = []
    /*
    Trap any failed requests and provide a specific message for Network related problems.
    For the rest, default to the provided message from the request
     */
    if (typeof error !== 'undefined') {
        if (Object.hasOwn(error,'message')) {
            if (error.message === 'Network Error') {
                //errorMessage = ['There is a problem with the network. Please contact support']
                errorResponse.title = 'There is a problem with the network.'
                errorResponse.description = 'Please contact support or try again later.'
            } else {
                //errorMessage = error.message
                errorResponse.title = errorMessage
            }
        }
    }
    /*
    For requests returning html response codes, provide an appropriate message for the specific use case.
    These messages are set to the 'general' property and will be used in the form to return a message
    to BaseErrorMessage component (via vee-validate in most cases. If you don't have that bas component on your
    form then your error may not be noticed by the user.
    In the event of a 422, a validation error from the back end, use the validation error from Laravel. These will
    already be assigned the relevant field name(s) the message(s) should be displayed against.
     */
    if (typeof error.response !== 'undefined') {
        //Setup Generic Response Messages
        if (error.response.status === 401) {
            errorResponse.title = 'You are not authorised for this page'
            errorResponse.description = 'If you believe you should have access to this page please log in again and retry. Otherwise, request access'
        } else if (error.response.status === 404) {
            errorResponse.title = 'Page missing or undefined'
            errorResponse.description = 'There is no such page on this site.'
        } else if (error.response.status === 405) {
            errorResponse.title = 'Not allowed.'
            errorResponse.general = 'The function you are requesting is not allowed'
        } else if (error.response.status === 419) {
            //errorMessage = 'This sessions has expired'
            errorResponse.general.title = 'This session has expired'
            errorResponse.general.description = 'Please login again to reinstate your session.'
            //await logout
            //await router.push({name: "login"})
        } else if (error.response.status === 422) {
            // Laravel validation Message
            if (Object.hasOwn(error,'response') && Object.response.hasOwn(error,'data')) {
                if (Object.hasOwn(error.response.data,'message') && error.response.data.message.length > 0) {
                    errorResponse.title = error.response.data.message
                    let errorsList = Object.values(error.response.data.errors).flat()
                    errorResponse.description = errorsList[0]
                }
            }
        } else if (error.response.status >= 500) {
            errorMessage = 'An unknown error has occurred. Please contact support.'
            errorResponse.general = errorMessage
        }
    }
    // return the error message
    console.log("error is ", errorResponse.title + ' ' + errorResponse.description)
    return errorResponse
}
