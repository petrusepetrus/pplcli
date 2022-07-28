<template>
    <Combobox  v-model="selectedPeople" multiple>
        <ul v-if="selectedPeople.length > 0">
            <li v-for="person in selectedPeople" :key="person.id">
                {{ person.name }}
            </li>
        </ul>
        <ComboboxInput
              @change="query = $event.target.value"
              :displayValue="(person) => person.name"
        />
        <ComboboxOptions>
            <ComboboxOption
                  v-for="person in filteredPeople"
                  :key="person"
                  :value="person"
            >
                {{ person.name }}
            </ComboboxOption>
        </ComboboxOptions>
    </Combobox>
</template>

<script setup>
import {ref, computed,defineProps} from 'vue'
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
} from '@headlessui/vue'
const props = defineProps({
    multiple: {
        type: [Boolean],
    },
})
const people = [
    {id: 1, name: 'Durward Reynolds'},
    {id: 2, name: 'Kenton Towne'},
    {id: 3, name: 'Therese Wunsch'},
    {id: 4, name: 'Benedict Kessler'},
    {id: 5, name: 'Katelyn Rohan'},
]
const selectedPeople = ref([people[0], people[1]])
const query = ref('')

const filteredPeople = computed(() =>
      query.value === ''
            ? people
            : people.filter((person) => {
                return person.name.toLowerCase().includes(query.value.toLowerCase())
            })
)
</script>