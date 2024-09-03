  <template>
    <div class="relative rounded-lg">
      <input
          :id="inputId"
          ref="input"
          v-model="inputValue"
          :class="{ 'border-error': props.error,
          'hover:border-border' : props.disabled,
         'pl-10': props.email, 'h-[40px] text-sm pt-5' : props.size === 'sm',
          'h-[46px] text-base pt-6 ' : props.size === 'md',
          'pl-[30px]' : props.searchible,
          'hover:border-secondary': !props.disabled,
        }"
          :disabled='props.disabled'
          :maxlength="props.maxlength"
          :required="props.required"
          :type="type"
          autocomplete="off"
          class="block px-2.5 pb-5 w-full border text-secondary
          bg-transparent rounded-[10px] border-1 border-border appearance-none  focus:outline-none focus:ring-0 focus:border-primary peer "
          placeholder=" "
          @focus="$emit('focus')"
          @input="moneyMask"
      />

      <label
          :class="{ 'peer-focus:text-error ': props.error, 'left-[40px]': props.email, 'peer-focus:text-primary ': !props.error, 'left-4 ': !props.email,
        'top-[16px] text-sm' : props.size === 'sm',
        'top-[16px] text-base ' : props.size === 'md',
        'pl-6' : props.searchible }"
          :for="inputId"
          class="absolute  text-[#808BA0] bg-white font-semibold duration-300 transform -translate-y-[28px] scale-75 origin-[0] left-[12px]  peer-focus:text-primary
          peer-placeholder-shown:scale-100  line-clamp-1 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-[28px]">
        {{ props.placeholder }}
      </label>

      <i v-if="props.email" class="fas fa-envelope text-lg absolute text-secondary left-3 top-[10px] z-40"></i>
      <i v-if="props.error && props.errorIcon"
         class="pi pi-exclamation-circle cursor-pointer mr-3 absolute right-0 top-4 text-[#F2376F]"></i>

      <div v-if="props.error === false ? props.showValue : false" class="absolute right-0 top-3">
        <i v-if="show" class="pi pi-eye mr-3 cursor-pointer text-secondary" @click="hideValue"></i>
        <i v-else class="pi pi-eye-slash mr-3 text-slate-700 cursor-pointer" @click="showValueHandle"></i>
      </div>

      <div v-if="props.clearable && props.modelValue.length > 0">
        <span
            :class="{ 'top-2 text-base' : props.size === 'sm', 'top-2.5 text-lg' : props.size === 'md' }"
            class="icon-Close-Square-Outline text-secondary cursor-pointer absolute right-2"
            @click="clearInputValue"
        ></span>
      </div>

      <i v-if='props.searchible'
         :class="{'text-base top-2 left-2' : props.size === 'sm', 'text-xl left-2 top-2.5' : props.size === 'md'}"
         class="icon-Search-Outline-Outline text-dark absolute  "></i>

    </div>
  </template>

  <script setup>
  import {defineModel, onMounted, reactive, ref} from 'vue'

  const inputId = `custom-input-${Math.floor(Math.random() * 10000)}`
  // eslint-disable-next-line no-undef

  const inputValue = defineModel('modelValue')

  const props = defineProps({

    modelValue: reactive({
      type: String,
      default: ''
    }),
    focus: {type: Boolean},
    placeholder: {
      type: String,
      default: 'Enter text'
    },
    type: {
      type: String,
      default: 'text'
    },
    amount: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: ''
    },
    email: {
      type: String
    },
    emailPlaceholder: {
      emailPlaceholder: String,
      default: ''
    },
    clearable: {
      default: false,
      type: Boolean
    },
    error: {
      type: Boolean,
      default: false
    },
    errorIcon: {
      type: Boolean,
      default: true
    },
    showValue: {
      type: Boolean,
      default: false
    },
    labelBackgroundColor: {
      type: String
    },
    required: Boolean,
    size: {
      type: String,
      default: 'md'
    },
    searchible: Boolean,
    disabled: Boolean
  })

  const emit = defineEmits(['clean'])
  const show = ref(props.showValue)
  const type = ref(props.type)
  const input = ref()


  const hideValue = () => {
    if (props.type === 'password') {
      type.value = 'text'
      show.value = false
    }
  }
  const showValueHandle = () => {
    type.value = 'password'
    show.value = true
  }
  const clearInputValue = () => {
    input.value.value = ''
    inputValue.value = ''
    emit('clean')
  }

  onMounted(() => {
    if (props.focus)
      input.value.focus()
  })

  function moneyMask() {
    if (props.amount) {
      let rawValue = inputValue.value.replace(/[^\d]/g, '')

      let formattedValue = Number(rawValue).toLocaleString('ru-RU')

      inputValue.value = formattedValue
    }
  }

  </script>

  <style lang="scss" scoped>
  .error-hint {
    color: #F2376F;
    font-size: 12px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  .border-error{
    border-color:#F2376F!important;
  }

  </style>