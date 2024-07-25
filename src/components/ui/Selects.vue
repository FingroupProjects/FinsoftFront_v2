<template>
  <div class="relative rounded-lg">
    <Dropdown
        :id="selectId"
        v-model="selectedValue"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        :placeholder="placeholder"
        :disabled="disabled"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :scroll-height="scrollHeight"
        :class="['block w-full border text-secondary bg-transparent rounded-2xl border-1 border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary', inputClass]"
        :style="inputStyle"
        :show-clear="showClear"
        :append-to="appendTo"
        :loading="loading"
        :clear-icon="clearIcon"
        :dropdown-icon="dropdownIcon"
        :filter-icon="filterIcon"
        :loading-icon="loadingIcon"
        :virtual-scroller-options="virtualScrollerOptions"
        :auto-option-focus="autoOptionFocus"
        :auto-filter-focus="autoFilterFocus"
        :select-on-focus="selectOnFocus"
        :focus-on-hover="focusOnHover"
        :highlight-on-select="highlightOnSelect"
        :checkmark="checkmark"
        :filter-message="filterMessage"
        :selection-message="selectionMessage"
        :empty-selection-message="emptySelectionMessage"
        :empty-filter-message="emptyFilterMessage"
        :empty-message="emptyMessage"
        tabindex="tabindex"
        aria-label="ariaLabel"
        aria-labelledby="ariaLabelledby"
    />
    <i v-if="showClear && selectedValue" class="fas fa-times cursor-pointer absolute right-2 top-3 text-secondary" @click="clearSelection"></i>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  modelValue: [String, Number],
  options: Array,
  optionLabel: [String, Function],
  optionValue: [String, Function],
  optionDisabled: [String, Function],
  placeholder: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  filter: Boolean,
  filterPlaceholder: String,
  scrollHeight: {
    type: String,
    default: '14rem'
  },
  showClear: Boolean,
  inputId: String,
  inputClass: [String, Object],
  inputStyle: Object,
  appendTo: {
    type: [String, Object],
    default: 'body'
  },
  loading: Boolean,
  clearIcon: String,
  dropdownIcon: String,
  filterIcon: String,
  loadingIcon: String,
  virtualScrollerOptions: Object,
  autoOptionFocus: Boolean,
  autoFilterFocus: Boolean,
  selectOnFocus: Boolean,
  focusOnHover: Boolean,
  highlightOnSelect: Boolean,
  checkmark: Boolean,
  filterMessage: String,
  selectionMessage: String,
  emptySelectionMessage: String,
  emptyFilterMessage: String,
  emptyMessage: String,
  tabindex: Number,
  ariaLabel: String,
  ariaLabelledby: String
})

const emit = defineEmits(['update:modelValue', 'clear'])

const selectedValue = ref(props.modelValue)

const clearSelection = () => {
  selectedValue.value = null
  emit('update:modelValue', null)
  emit('clear')
}
</script>

<style scoped>

</style>
