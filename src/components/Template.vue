<template>

</template>

<script>
/* Overview
-------------------------------------------------------------------------------
The AddressInformation component manages
- the presentation of the user address details via the AddressCard components
- the addition of new addresses for a user
- changing a user's address details
-------------------------------------------------------------------------------*/



/* Imports
-------------------------------------------------------------------------------*/

/* Vue
*/

/* Components
*/

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
/*-------------------------------------------------------------------------------*/


/* Props
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/

/* Emits
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/


/* Variable Declaration and Initialisation
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/


/* Functions
------------------------------------------------------------------------------- */
/*
refreshAddresses is run via the onMounted hook and also triggered by the v-on:refresh
event that can be emitted by the AddressCard and AddressDetails components to indicate
that a change to the user's addresses has taken place and the addresses in the userStore
should be updated and the AddressCards refreshed with hose new details
 */

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

/*-------------------------------------------------------------------------------*/

</script>

<style scoped>

</style>