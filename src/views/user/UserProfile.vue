<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
        <div class="max-w-3xl mx-auto">
            <div class="py-10">
                <header>
                    <div class="max-w-7xl mx-auto mb-4 ">
                        <h1 class="text-3xl font-bold leading-tight text-gray-900">Profile</h1>
                    </div>
                </header>
                <main class="space-y-8 ">
                    <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
                        <div>
                            <PersonalInformation></PersonalInformation>
                        </div>
                    </div>
                    <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
                        <div>
                            <AddressList></AddressList>
                        </div>
                    </div>
                    <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
                        <div>
                            <PhoneList></PhoneList>
                        </div>
                    </div>
                    <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
                        <div>
                            <NotificationCard>

                            </NotificationCard>
                        </div>
                    </div>
                    <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
                        <div class="pt-8">
                            <div>
                                <h3 class="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                                <p class="mt-1 text-sm text-gray-500">Add your photo to make your profile more
                                    personal
                                </p>
                            </div>

                            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">


                                <div class="sm:col-span-6">
                                    <label for="photo" class="block text-sm font-medium text-gray-700">
                                        Photo </label>
                                    <div class="mt-1 flex items-center">
              <span class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </span>
                                        <button type="button"
                                                class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div class="sm:col-span-6">
                                    <label for="cover-photo" class="block text-sm font-medium text-gray-700"> Cover
                                        photo </label>
                                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div class="space-y-1 text-center">
                                            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor"
                                                 fill="none"
                                                 viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                      stroke-width="2" stroke-linecap="round"
                                                      stroke-linejoin="round"/>
                                            </svg>
                                            <div class="flex text-sm text-gray-600">
                                                <label for="file-upload"
                                                       class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file"
                                                           class="sr-only"/>
                                                </label>
                                                <p class="pl-1">or drag and drop</p>
                                            </div>
                                            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    </div>
</template>

<script>
import PersonalInformation from "../../components/user/PersonalInformation.vue";
import AddressInformation from "../../components/user/AddressInformation.vue";
import PhoneInformation from "../../components/user/PhoneInformation.vue";
import PhoneList from "../../components/user/PhoneList.vue";
import AddressList from "../../components/user/AddressList.vue";
import NotificationCard from "../../components/user/NotificationCard.vue";

export default {
    name: "userProfile",
    components: {NotificationCard, PhoneInformation,PhoneList, AddressList,AddressInformation, PersonalInformation}
}
</script>

<style scoped>

</style>