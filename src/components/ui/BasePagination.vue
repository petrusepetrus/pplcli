<template>
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
            <a v-on:click.prevent="handleClick('prev')" href="#"
               class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous </a>
            <a v-on:click.prevent="handleClick('next')" href="#"
               class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next </a>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ from }}</span>
                    to
                    <span class="font-medium">{{ to }}</span>
                    of
                    <span class="font-medium">{{ total }}</span>
                    results
                </p>
            </div>
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <div v-for="link in links" :key="link">
                        <a v-if="link.label.search('Previous')!==-1" v-on:click.prevent="handleClick('prev')" href="#"
                           class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >

                            <span class="sr-only">Previous</span>
                            <!-- Heroicon name: solid/chevron-left -->
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                 fill="currentColor"
                                 aria-hidden="true">
                                <path fill-rule="evenodd"
                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <a v-else-if="link.label.search('Next')!==-1" v-on:click.prevent="handleClick('next')" href="#"
                           class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span class="sr-only">Next</span>
                            <!-- Heroicon name: solid/chevron-right -->
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </a>

                        <a v-else v-on:click.prevent="handleClick(link.label)" href="#"
                           :class="link.active===true?'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                           :'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium'"
                        >
                            {{ link.label }}
                        </a>
                    </div>
                    <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                    <!--class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"-->

                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['newPage'])
const props = defineProps({
    current_page: {
        type: [String, Number],
    },
    last_page:{
        type: [String, Number],
    },
    from:{
        type: [String, Number
        ],
    },
    next_page_url: {
        type: [String, Number
        ],
    },
    path: {
        type: [String, Number],
    },
    per_page: {
        type: [String, Number],
    },
    prev_page_url: {
        type: [String, Number],
    },
    to: {
        type: [String, Number],
    },
    total: {
        type: [String, Number],
    },
    links: {
        type: Object,
    }
})

const handleClick = (page) => {
    let newPage=0
    if (page === 'prev') {
        if (parseInt(props.current_page) === 1) {
            console.log("beginning ", page)
            return
        } else {
            newPage = parseInt(props.current_page) - 1
        }
    } else if (page === 'next') {
        console.log('next')
        if (parseInt(props.current_page) === parseInt(props.last_page)) {
            console.log("end ", props.last_page)
            return
        } else {
            console.log(parseInt(props.last_page))
            newPage = parseInt(props.current_page) + 1
        }

    } else {
        if(parseInt(props.current_page)===parseInt(page)){
            console.log("same ", page)
            return
        }else{
            newPage = parseInt(page)
        }
    }
    console.log("handling ", newPage)
    emit('newPage',newPage)
}
</script>

<style scoped>

</style>