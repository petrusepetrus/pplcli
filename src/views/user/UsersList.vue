<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-10">
            <div class="px-4 sm:px-6 lg:px-8">
                <header>
                    <div class="max-w-7xl mx-auto mb-4 ">
                        <h1 class="text-3xl font-bold leading-tight text-gray-900">Users</h1>
                    </div>
                    <div class="flex flex-wrap justify-evenly gap-2 mb-4">
                        <div class="max-w-lg  lg:max-w-xs shrink bg-white shadow sm:rounded-lg p-2">
                            <h2 class="text-lg leading-6 font-medium text-gray-900">Filter on name</h2>
                            <div class="mt-2 mb-2 max-w-xl text-sm text-gray-500">
                                <p>Enter any consecutive sequence of letters to search the name for</p>
                            </div>
                            <label for="name-query" class="sr-only">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </div>
                                <input
                                      id="name-query"
                                      v-model="userSearchName"
                                      name="name-query"
                                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      placeholder="Search name"
                                      type="search"
                                      @keyup="getUsersList"/>
                            </div>
                        </div>
                        <div class="max-w-lg  lg:max-w-xs shrink bg-white shadow sm:rounded-lg p-2">
                            <h2 class="text-lg leading-6 font-medium text-gray-900">Filter on role</h2>
                            <div class="mt-2 mb-2 max-w-xl text-sm text-gray-500">
                                <p>Select one or more roles to search for or leave blank for all</p>
                            </div>
                            <div class="max-w-lg w-full lg:max-w-xs">
                                <div v-for="userType in userTypes" :key="userType.id">
                                    <BaseCheckbox
                                          v-model="userTypeSelected[userType.id-1]"
                                          :label="userType.user_type"
                                          :checked="false"
                                          label-description="">
                                    </BaseCheckbox>
                                </div>
                            </div>
                        </div>
                        <div class="max-w-lg  lg:max-w-xs shrink bg-white shadow sm:rounded-lg p-2">
                            <h2 class="text-lg leading-6 font-medium text-gray-900">Filter on role status</h2>
                            <div class="mt-2 mb-2 max-w-xl text-sm text-gray-500">
                                <p>Select one or more role statuses you are interested in or leave blank for all</p>
                            </div>
                            <div class="max-w-lg w-full lg:max-w-xs">
                                <div v-for="userTypeStatus in userTypeStatuses" :key="userTypeStatus.id">
                                    <BaseCheckbox
                                          v-model="userTypeStatusSelected[userTypeStatus.id-1]"
                                          :label="userTypeStatus.user_type_status"
                                          label-description="">
                                    </BaseCheckbox>
                                </div>
                            </div>
                        </div>

                        <button
                              type="button"
                              class="max-h-12 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                            Add new user
                        </button>
                    </div>
                </header>
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                    <tr>
                        <th
                              scope="col"
                              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                            Name
                        </th>
                        <th
                              scope="col"
                              class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                            Email
                        </th>
                        <th
                              scope="col"
                              class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                            Phone
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Roles
                        </th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span class="sr-only">Edit</span>
                        </th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span class="sr-only">Delete</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="user in usersList" :key="user.email">
                        <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                            {{ user.name }}
                        </td>
                        <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ user.email }}</td>
                        <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                            <div v-for="phone in user.phones">
                                <div class="float-left w-5/6">
                                    <a href="tel:{{ phone.phone_number }}">{{ phone.phone_number }}</a>
                                </div>
                                <div v-if="phone.pivot.preferred_contact_number!==0" class="float-right w-1/6">
                                    <CheckCircleIcon class="h-4 w-4 text-green-400"/>
                                </div>

                            </div>
                        </td>
                        <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                            <div v-for="userType in user.user_user_type">
                                <div class="float-left w-5/6">
                                    {{ userType.user_type.user_type }}
                                </div>
                                <div
                                      class="float-right w-1/6"
                                      :class=getUserTypeStatus(userType.user_type_status.user_type_status)>
                                    {{ userType.user_type_status.user_type_status }}
                                </div>
                            </div>
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-500">{{ user.user_type }}</td>
                        <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <router-link :class="'block px-4 py-2 text-sm text-indigo-600'"
                                         :to="{name:'user-profile',params:{userID:user.id}}">
                                Edit
                                <span class="sr-only">, {{ user.name }}</span>
                            </router-link>
                        </td>
                        <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900"
                            >Delete<span class="sr-only">, {{ user.name }}</span></a
                            >
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>
        <div v-if="usersList.length>0">
            <BasePagination
                  :current_page="paginationData.current_page"
                  :last_page="paginationData.last_page"
                  :next_page_url="paginationData.next_page_url"
                  :path="paginationData.path"
                  :per_page="paginationData.per_page"
                  :prev_page_url="paginationData.prev_page_url"
                  :to="paginationData.to"
                  :from="paginationData.from"
                  :total="paginationData.total"
                  :links="paginationData.links"
                  @newPage="pageChange"
            >
            </BasePagination>
        </div>
         <BaseSpinner
               v-if="isSubmitting">
        </BaseSpinner>
        <BaseErrorMessage
              v-if="error.title"
              :error-description=error.description
              :error-title=error.title>
        </BaseErrorMessage>
        <BaseWarningMessage
              v-if="warning.title"
              :warning-title=warning.title>
        </BaseWarningMessage>
    </div>

</template>

<script setup>
/* Overview
-------------------------------------------------------------------------------
UserList provides a list and search function showing the user details for
selected users with the ability to perform basic CRUD
-------------------------------------------------------------------------------*/

/* Imports
-------------------------------------------------------------------------------*/
/* Vue
*/
import {onMounted, ref, reactive, watch} from "vue";
/* Components
*/

import router from "../../router";
/* Services
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
*/
import {CheckCircleIcon, SearchIcon} from '@heroicons/vue/solid'
import BaseRadioGroup from "../../components/ui/BaseRadioGroup.vue";
/* Stores
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
 */

/* API
load the getUserAddresses service to retrieve any existing user addresses
 */
import useUserService from "../../services/user/useUserService.js";
import BaseRadio from "../../components/ui/BaseRadio.vue";
import BasePagination from "../../components/ui/BasePagination.vue";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseSelectNew from "../../components/ui/BaseSelectNew.vue";
import BaseSelect from "../../components/ui/BaseSelect.vue";
import BaseCheckbox from "../../components/ui/BaseCheckbox.vue";
import BaseErrorMessage from "../../components/ui/BaseErrorMessage.vue";
import BaseInformationMessage from "../../components/ui/BaseInformationMessage.vue";
import BaseWarningMessage from "../../components/ui/BaseWarningMessage.vue";
/* Services and Utilties
 */
import generalUtilities from "../../utils/GeneralUtilities.js";
/*-------------------------------------------------------------------------------*/


/* Props
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/

/* Emits
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/


/* Variable Declaration and Initialisation
------------------------------------------------------------------------------- */
let usersList = ref({})
let paginationData = reactive({})
let userTypes = ref([])
let userSearchName = ref('')
let userTypeStatuses = ref([])
let userTypeSelected = ref([])
let userTypeStatusSelected = ref([])
let isSubmitting = ref(false)
let error = reactive({})
let warning = reactive({})
const {getUsers, getUserTypes, getUserTypeStatuses} = useUserService()
const {testIfPromise}=generalUtilities()
let queryParams = reactive({
    pageNumber: 1,
    recordsPerPage: 8,
    nameQuery: "",
    userTypeQuery: ""
})
/*-------------------------------------------------------------------------------*/


/* Functions
------------------------------------------------------------------------------- */
watch(userSearchName, () => {
    queryParams.pageNumber = 1
    queryParams.nameQuery = userSearchName.value
    getUsersList()
})
watch(userTypeSelected.value, () => {
    //console.log("starting")
    queryParams.pageNumber = 1
    queryParams.userTypeQuery = ""
    let blnFirstParameterAdded = false
    //console.log(blnFirstParameterAdded)
    for (let i = 0; i < userTypeSelected.value.length; i++) {
        if (userTypeSelected.value[i]) {
            //console.log(userTypes.value[i].user_type)
            if (!blnFirstParameterAdded) {
                blnFirstParameterAdded = true
                queryParams.userTypeQuery = userTypes.value[i].user_type
                //    console.log("first parameter ", queryParams.userTypeQuery)
            } else {
                queryParams.userTypeQuery = queryParams.userTypeQuery + ',' + userTypes.value[i].user_type
                //    console.log("subsequent parameter ", queryParams.userTypeQuery)
            }
        }
    }
    getUsersList()
})
watch(userTypeStatusSelected.value, () => {
    //console.log("starting")
    queryParams.pageNumber = 1
    queryParams.userTypeStatusQuery = ""
    let blnFirstParameterAdded = false
    //console.log(blnFirstParameterAdded)
    for (let i = 0; i < userTypeStatusSelected.value.length; i++) {
        //console.log("procesing " + i + " " + userTypeStatusSelected.value[i] + " " + userTypeStatuses.value[i].user_type_status)
        if (userTypeStatusSelected.value[i]) {
            console.log(userTypeStatuses.value[i].user_type_status)
            if (!blnFirstParameterAdded) {
                blnFirstParameterAdded = true
                queryParams.userTypeStatusQuery = userTypeStatuses.value[i].user_type_status
                console.log("first parameter ", queryParams.userTypeStatusQuery)
            } else {
                queryParams.userTypeStatusQuery = queryParams.userTypeStatusQuery + ',' + userTypeStatuses.value[i].user_type_status
                console.log("subsequent parameter ", queryParams.userTypeQuery)
            }
        }
    }
    getUsersList()
})

/*
refreshAddresses is run via the onMounted hook and also triggered by the v-on:refresh
event that can be emitted by the AddressCard and AddressDetails components to indicate
that a change to the user's addresses has taken place and the addresses in the userStore
should be updated and the AddressCards refreshed with hose new details
 */
const getUsersList = async () => {
    isSubmitting.value = true
    try {
        //console.log(queryParams)
        let response = await getUsers(queryParams)
        if (response.data.length === 0) {
            warning.title = "No users found"
        }else{
            warning.title=""
        }
            usersList.value = response.data
            paginationData.current_page = response.current_page
            paginationData.last_page = response.last_page
            paginationData.next_page_url = response.next_page_url
            paginationData.path = response.path
            paginationData.per_page = response.per_page
            paginationData.prev_page_url = response.prev_page_url
            paginationData.from = response.from
            paginationData.to = response.to
            paginationData.total = response.total
            paginationData.links = response.links

    } catch (e) {
        if(testIfPromise(e)){
            e.then((value) => {
                /*
                The error handler throws a promise.reject so we need to resolve the promise
                to access the error information
                 */
                error.title = value.title
                error.description = value.description
                //error.description=e
            })
        }else{
            error.title=e
        }
    }
    isSubmitting.value = false
    return {
        getUsersList
    }
}
const popstateEventAction = (event) => {
    // ... some action triggered when the back button is clicked
    //this.removePopstateEventAction();
    //console.log("something happened")
    //console.log("location: " + document.location + " state: " + JSON.stringify(event.state))
    if (event.state && event.state.replaced === false) {
        //console.log(event.state)
        //    console.log(document.location.href)
        let stringToBeSearched = document.location.search
        let searchString = "page="
        let pageNumber = stringToBeSearched.substring(stringToBeSearched.search(searchString) + searchString.length, stringToBeSearched.length)
        //console.log(stringToBeSearched.search(searchString) + ' ' + searchString.length + ' ' + stringToBeSearched.length + ' ' + pageNumber)
        queryParams.pageNumber = pageNumber
        getUsersList()
    }

}
const getUserTypeStatus = (userTypeStatus) => {
    switch (userTypeStatus) {
        case 'Active':
            return "h-4 w-4 text-green-400"
        case 'Inactive':
            return "h-4 w-4 text-red-400"
        default:
    }
}
const pageChange = async (newPage) => {
    //console.log("received", newPage)
    queryParams.pageNumber = newPage
    await getUsersList()
    if (paginationData.path) {
        try {
            await router.push({
                path: paginationData.path,
                query: {page: paginationData.current_page}
            })
        } catch (e) {
            if(testIfPromise(e)){
                e.then((value) => {
                    /*
                    The error handler throws a promise.reject so we need to resolve the promise
                    to access the error information
                     */
                    error.title = value.title
                    error.description = value.description
                    //error.description=e
                })
            }else{
                error.title=e
            }
        }
    }
}
const loadUserTypes = async () => {
    try {
        userTypes.value = await getUserTypes()
        console.log(userTypes)
    } catch (e) {
        e.then((value) => {
            /*
            The error handler throws a promise.reject so we need to resolve the promise
            to access the error information
             */
            console.log(value)
            console.log(value.title)
            console.log(value.description)
            error.title = value.title
            error.description = value.description
            console.log(error.title)
            console.log(error.description)
            process.exit()
            //error.description=e
        })
    }
}
const loadUserTypeStatuses = async () => {
    try {
        userTypeStatuses.value = await getUserTypeStatuses()
        console.log(userTypes)
    } catch (e) {
        e.then((value) => {
            /*
            The error handler throws a promise.reject so we need to resolve the promise
            to access the error information
             */
            console.log(value)
            console.log(value.title)
            console.log(value.description)
            error.title = value.title
            error.description = value.description
            process.exit()
            //error.description=e
        })
    }
}
/*
changeAddress is called by v-on:change event listener which signifies that a user
has requested to change one of their existing addresses, the address details of which
are passed back with the event in the addressToChange parameter. This is used to update
userAddress, which is bound to the AddressDetails component, and the addAddress ref is
set to true to cause the AddressDetails component to display. As well as changing a user
address, AddressCard can be used to add a new address. In the case of an addition, the
userAddress ref is set to null, which the AddressCard component takes as a signal that
it is to add an address rather than change one
/*-------------------------------------------------------------------------------*/

/* Lifecycle Hooks
---------------------------------------------------------------------------------*/
onMounted(async () => {
    isSubmitting.value = true
    await loadUserTypes()
    await loadUserTypeStatuses()
    queryParams.pageNumber = 1
    await getUsersList()
    if (paginationData.path) {
        try {
            await router.push({
                path: paginationData.path,
                query: {page: paginationData.current_page}
            })
        } catch (e) {
            if(testIfPromise(e)){
                e.then((value) => {
                    /*
                    The error handler throws a promise.reject so we need to resolve the promise
                    to access the error information
                     */
                    error.title = value.title
                    error.description = value.description
                    //error.description=e
                })
            }else{
                error.title=e
            }
        }
    }
    isSubmitting.value = false
    //console.log("I'm mounted")
    //console.log(userTypes)
    window.addEventListener('popstate', popstateEventAction);
})
/*-------------------------------------------------------------------------------*/
</script>

<style scoped>

</style>