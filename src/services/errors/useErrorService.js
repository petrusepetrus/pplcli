import testIfPromise from '../../utils/GeneralUtilities.js'
export default function useErrorService(){
    const errorMessageHandler=async(errorReturned,generalError)=>{
        if(testIfPromise(errorReturned)){
            errorReturned.then((error) => {
                /*
                The error handler throws a promise.reject so we need to resolve the promise
                to access the error information
                 */
                generalError.title = error.title
                generalError.description = error.description
                //error.description=e
            })
        }else{
            generalError.title=errorReturned
        }
    }
    return {
        errorMessageHandler,
    }
}