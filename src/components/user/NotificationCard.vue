<template>
    <div>
        <div class="bg-white p-4 shadow overflow-hidden sm:rounded-lg">
            <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
                <p class="mt-1 text-sm text-gray-500">Please let us now which updates you would like
                    to subscribe to and your preferences as to how to receive them.</p>
            </div>
            <div class="mt-6">
                <fieldset>
                    <legend class="text-base font-medium text-gray-900">Topics</legend>
                    <div class="mt-4 space-y-4">
                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Instructor Training Courses"
                                  label-description="News concerning new instructor training courses and related topics"
                            >
                            </BaseCheckbox>
                        </div>

                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Pilates Classes"
                                  label-description="Information on existing and new Pilates classes"
                            >
                            </BaseCheckbox>
                        </div>

                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Gyrotonic Sessions"
                                  label-description="Information about Gyrotonics classes and related topics"
                            >
                            </BaseCheckbox>
                        </div>
                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Physiotherapy"
                                  label-description="Information about Physiotherapy sessions and related topics"
                            >
                            </BaseCheckbox>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="mt-6">
                    <div>
                        <legend class="text-base font-medium text-gray-900">Channels
                        </legend>
                        <p class="text-sm text-gray-500">How would you like to receive your notifications?</p>
                        <p class="text-sm text-gray-500">Please select all that apply.</p>
                    </div>
                    <div class="mt-4 space-y-4">
                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Email"
                            >
                            </BaseCheckbox>
                        </div>
                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="SMS"
                             >
                            </BaseCheckbox>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="mt-6">
                    <div>
                        <legend class="text-base font-medium text-gray-900">Opt Out
                        </legend>
                        <p class="text-sm text-gray-500">Please select this option if you want to <span class="text-sm text-red-600">opt out of receiving notifications altogether</span>.</p>
                    </div>
                    <div class="mt-4 space-y-4">
                        <div class="relative flex items-start">
                            <BaseCheckbox
                                  label="Opt out from receiving notifications"
                                  label-description="This will override all of the settings made above and
                                  you will only hear from us regarding changes to our terms of business or
                                  for statutory purposes such as data protection issues."
                            >
                            </BaseCheckbox>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<script setup>

import BaseCheckbox from "../ui/BaseCheckbox.vue";
</script>

<style scoped>

</style>