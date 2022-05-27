import {useAuthStore} from "../stores/AuthStore.js";


const hasRole = (rolesToBeSearchedFor) => {
    const {getUserRoles} = useAuthStore()
    const userRoles = getUserRoles
    console.log(userRoles)
    if (userRoles.length > 0) {
        let i = 0;
        let searchResult = false;
        for (i = 0; i < rolesToBeSearchedFor.length; i++) {
            let searchRole = rolesToBeSearchedFor[i];
            console.log(searchRole)
            searchResult = userRoles.some(function (elem) {
                console.log("searching for ", searchRole)
                if (elem.name === searchRole) {
                    return true
                }
            })
            if (searchResult === true) {
                break
            }
        }
        console.log(searchResult)
        return searchResult;
    }

};

const hasPermission = (permissionsToBeSearchedFor) => {
    if (userPermissions) {
        let i = 0;
        let searchResult = false;
        //alert(permissionsToBeSearchedFor.length);
        for (i = 0; i < permissionsToBeSearchedFor.length; i++) {
            let searchPermission = permissionsToBeSearchedFor[i];
            searchResult = userPermissions.some(function (elem) {
                return elem.name === searchPermission;
            });
        }
        return searchResult;
    }
};

export {hasRole, hasPermission};