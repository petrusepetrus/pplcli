export default function errorHandler(error) {

    console.log("in the error handler")
    let errorResponse = {}
    let errorMessage = []
    /*
    Trap any failed requests and provide a specific message for Network related problems.
    For the rest, default to the provided message from the request
     */
    if (typeof error !== 'undefined') {
        if (error.hasOwnProperty('message')) {
            if (error.message === 'Network Error') {
                errorMessage = ['There is a problem with the network. Please contact support']
                errorResponse.general = errorMessage
            } else {
                errorMessage = error.message
                errorResponse.general = errorMessage
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
            errorMessage = 'You are not authorised for this page'
            errorResponse.general = errorMessage
        } else if (error.response.status === 404) {
            errorMessage = 'This page is missing or undefined'
            errorResponse.general = errorMessage
        } else if (error.response.status === 405) {
            errorMessage = 'This function is not allowed'
            errorResponse.general = errorMessage
        } else if (error.response.status === 422) {
            // Laravel validation Message
            if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data')) {
                if (error.response.data.hasOwnProperty('message') && error.response.data.message.length > 0) {
                    errorResponse = error.response.data.errors
                }
            }
        } else if (error.response.status >= 500) {
            errorMessage = 'An unknown error has occurred. Please contact support.'
            errorResponse.general = errorMessage
        }
    }
    // return the error message
    console.log("error is ", errorResponse)
    return errorResponse
}
