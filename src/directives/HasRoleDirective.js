import {useAuthStore} from "../stores/AuthStore.js";

export default function hasRole(el, binding) {
    // assume we are not going to match,so hide the element by default
    el.style.setProperty("display", "none")
    const {getUserRoles, getUser} = useAuthStore()
    if (getUser) {
        let rolesToBeSearchedFor = binding.value
        const userRoles = getUserRoles
        if (userRoles.length > 0) {
            let i = 0
            let searchResult = false
            for (i = 0; i < rolesToBeSearchedFor.length; i++) {
                let searchRole = rolesToBeSearchedFor[i];
                searchResult = userRoles.some(function (elem) {
                    if (elem.name === searchRole) {
                        return true
                    }
                })
                if (searchResult === true) {
                    break
                }
            }
            return searchResult
        }
    }
}
