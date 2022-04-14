import {defineStore} from "pinia";
import axios from "axios";

const myErrorResponse = {}
let myErrorMessage = []
//const router = useRouter()

const useAuthStore = defineStore('AuthStore', {
    state() {
        return {
            authenticated: false,
            verified: false,
            user: {},
            errorFound: false,
            authErrors: {},
            registerErrors: {},
            registerMessages: {},
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.authenticated
        },
        isVerified(state) {
            return state.verified
        },
        isError(state) {
            return state.errorFound
        },
        getUser(state) {
            return state.user
        },
        getLoginErrors(state) {
            return state.authErrors
        }
    },
    actions: {
        async login(credentials) {
            this.authenticated = false
            this.verified = false
            this.user = {}
            this.authErrors = {}
            this.errorFound = false
            /*
            get a valid CSRF cookie
             */
            try {
                await axios.get('/sanctum/csrf-cookie')
                try {
                    /*
                    attempt to login
                     */
                    await axios.post('login', credentials)
                    /*
                    if successful, retrieve the user object
                     */
                    try {
                        let response = await axios.get('/api/user')
                        this.authenticated = true
                        this.user = response.data
                        if (response.data.email_verified_at) {
                            this.verified = true
                        } else {
                            this.verified = false
                        }
                    } catch (e) {
                        this.authenticated = false
                        this.verified = false
                        this.user = {}
                        this.authErrors = e.response.data.errors
                    }

                } catch (e) {
                    /*
                    deal with any errors returned via Axios
                     */
                    switch (e.response.status) {
                        case 422:
                            /*
                            A specified error(s) has been returned from Laravel
                            Set the errors to the value of the returned error bag
                             */
                            this.authErrors = e.response.data.errors
                            break
                        case 429:
                            /*
                            429 triggered if the number of erroneous logins per minute exceeds the limit set
                            in Laravel
                             */
                            myErrorMessage = ['You have made too many invalid login attempts - please try later']
                            myErrorResponse.general = myErrorMessage
                            this.authErrors = myErrorResponse
                            break
                        default:
                            /*
                            Catch all for other errors returning an error response via axios
                             */
                            myErrorMessage = ['An unknown problem has arisen - please try later']
                            myErrorResponse.email = myErrorMessage
                            this.authErrors = myErrorResponse
                            break
                    }
                    this.errorFound = true
                }
            } catch (e) {
                if (e.request) {
                    console.log("error request")
                    console.log(e.request)
                    console.log(e.message)
                    switch (e.message) {
                        case "Network Error":
                            myErrorMessage = ["There is a problem with the network. Please contact support"]
                            break
                        default:
                            myErrorMessage = ["Unexpected error accessing API. Please contact support"]
                            break
                    }
                    myErrorResponse.general = myErrorMessage
                    this.authErrors = myErrorResponse
                    this.errorFound = true
                } else {
                    myErrorMessage = ["Unexpected error accessing API. Please contact support"]
                    myErrorResponse.general = myErrorMessage
                    this.authErrors = myErrorResponse
                    this.errorFound = true
                }

            }
        },
        async logout() {
            try {
                await axios.post('/logout')
                this.authenticated = false
                this.verified = false
                this.errorFound = false
                this.user = {}
                this.errors = {}
            } catch {

            }
        },
        async registerUser(values) {
            this.authenticated = false
            this.verified = false
            this.user = {}
            this.registerErrors = {}
            this.errorFound = false
            let myErrorResponse = {}
            let myErrorMessage = []
            try {
                await axios.get('/sanctum/csrf-cookie')
                try {
                    let response = await axios.post('/register', values)
                    try {
                        let response = await axios.get('/api/user')
                        this.authenticated = true
                        this.user = response.data
                        this.registerMessages = `Congratulations, you have registered your account.
                                        We have sent a verification email to your registered email address.`
                        if (response.data.email_verified_at) {
                            this.verified = true
                        } else {
                            this.verified = false
                        }
                    } catch (e) {
                        this.authenticated = false
                        this.verified = false
                        this.user = {}
                        this.errorFound = true
                        this.authErrors = e.response.data.errors
                    }
                    //if (getVerified.value === true) {
                    //    router.push({name: "dashboard"})
                    //} else {
                    //    router.push({name: "verify-email"})
                    //}
                } catch (e) {
                    /*
                    deal with any errors returned via Axios
                     */
                    console.log(e)
                    switch (e.response.status) {
                        case 422:
                            /*
                            A specified error(s) has been returned from Laravel
                            Set the errors to the value of the returned error bag
                             */
                            this.errorFound = true
                            this.registerErrors = e.response.data.errors
                            break
                        case 429:
                            /*
                            429 triggered if the number of erroneous logins per minute exceeds the limit set
                            in Laravel
                             */
                            myErrorMessage = ['You have made too many invalid login attempts - please try later']
                            myErrorResponse.general = myErrorMessage
                            this.errorFound = true
                            this.registerErrors = myErrorResponse
                            break
                        default:
                            /*
                            Catch all for other errors returning an error response via axios
                             */
                            myErrorMessage = ['An unknown problem has arisen - please try later']
                            myErrorResponse.email = myErrorMessage
                            this.errorFound = true
                            this.registerErrors = myErrorResponse
                            break
                    }
                }
            } catch (e) {
                console.log("yup")
                console.dir(e)
                switch (e.message) {
                    case "Network Error":
                        myErrorMessage = ["There is a problem with the network. Please contact support"]
                        break
                    default:
                        myErrorMessage = ["Unexpected error accessing API. Please contact support"]
                }
                myErrorResponse.general = myErrorMessage
                this.errorFound = true
                this.registerErrors = myErrorResponse
            }
        },
    }
})
export {useAuthStore}