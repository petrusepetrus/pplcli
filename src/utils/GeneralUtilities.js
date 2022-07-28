export default function generalUtilities() {
    const testIfPromise = (testObject) => {
        if (
            testObject !== null &&
            typeof testObject === 'object' &&
            typeof testObject.then === 'function' &&
            typeof testObject.catch === 'function'
        ) {
            return true;
        } else {
            return false;
        }
    }
    return {
        testIfPromise
    }
}