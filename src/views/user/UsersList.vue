<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Users</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all the users in your account including their name, title, email and role.</p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button type="button" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">Add user</button>
            </div>
        </div>
        <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Title</th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Email</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="user in usersList" :key="user.email">
                    <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                        {{ user.name }}
                        <dl class="font-normal lg:hidden">
                            <dt class="sr-only">Title</dt>
                            <dd class="mt-1 truncate text-gray-700">{{ user.title }}</dd>
                            <dt class="sr-only sm:hidden">Email</dt>
                            <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ user.email }}</dd>
                        </dl>
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ user.phone_number }}</td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ user.email }}</td>
                    <td class="px-3 py-4 text-sm text-gray-500">{{ user.phone_number }}</td>
                    <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900"
                        >Edit<span class="sr-only">, {{ user.name }}</span></a
                        >
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>



    <BasePagination v-on:newPage="pageChange"
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
    >

    </BasePagination>
    <BaseSpinner v-if="isSubmitting">

    </BaseSpinner>
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
import {onMounted, ref, reactive} from "vue";
/* Components
*/
import router from "../../router";
/* Services
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
*/

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
let isSubmitting = ref(false)
const {getUsers} = useUserService()
let queryParams = {
    pageNumber: 1,
    recordsPerPage: 6,
    nameQuery: "",
    includeType: "current"
}
console.log(queryParams)
/*-------------------------------------------------------------------------------*/


/* Functions
------------------------------------------------------------------------------- */
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

        if(paginationData.path){
                  try {
                      console.log("router " + paginationData.path + " " + paginationData.current_page)
                      await router.push({
                          path: paginationData.path,
                          query: {page: paginationData.current_page}
                      })
                  }catch(e){
                      console.log(e)
                  }
        }
    } catch (e) {
        console.log(e)
    }
    isSubmitting.value = false
    return {
        getUsersList
    }
}
const popstateEventAction=(event)=> {
    // ... some action triggered when the back button is clicked
    //this.removePopstateEventAction();
    //console.log("something happened")
    console.log("location: " + document.location + " state: " + JSON.stringify(event.state))
    //if(event.state && event.state.replaced===true){
        //console.log(event.state)
    //    console.log(document.location.href)
    //    console.log(JSON.stringify(event.state))
    //}

}
const pageChange = async (newPage) => {
    //console.log("received", newPage)
    queryParams.pageNumber = newPage
    await getUsersList()
    //if(paginationData.path){
    //    router.push({
    //        path:paginationData.path,
    //        query:{page:newPage}
    //    })
    //}
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
    await getUsersList()
    isSubmitting.value = false
    console.log("I'm mounted")
    window.addEventListener('popstate', popstateEventAction );
})
/*-------------------------------------------------------------------------------*/
</script>

<style scoped>

</style>