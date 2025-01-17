<script setup>
import {computed, watch, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FinInput from "@/components/ui/Inputs.vue";
import CounterpartyAgreements from "@/components/counterparty/CounterpartyAgreements.vue";
import Checkbox from "primevue/checkbox";

const phoneError = ref(false);
const emailError = ref(false);
const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  productId: {
    required: true,
  },
  openModalClose: {
    type: Boolean,
    default: false
  },
  data: Object
});


const roleList = ref([
  {
    name: 'Клиент',
    id: 1
  },
  {
    name: 'Поставщик',
    id: 2
  },
  {
    name: 'Прочие',
    id: 3
  },
])
const toast = useToast();

const id = ref();
const createValues = reactive({
  name: "",
  address: "",
  phone: "",
  email: "",
  roles: []
});

const rules = reactive({
  name: {required},
  phone: {required}
});

const fv$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = true
  createValues.roles = createValues.roles.map(role => role.id);
  if (result) {
    try {
      const res = await useAxios(`counterparty/${props.productId}`, {
        method: "PATCH",
        data: {
          name: createValues.name,
          address: createValues.address,
          phone: createValues.phone,
          email: createValues.email,
          roles: createValues.roles
        },
      });

      toast.add({
        severity: "success",
        summary: "Обновлено",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result);
      await getGood()
    } catch (e) {
      console.log(e);
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: e.response.data.message,
        life: 3000,
      });
    }
  }
}

 async function getGood() {
   const item = props.data
    createValues.name = item.name
    createValues.address = item.address
    createValues.phone = item.phone
    createValues.email = item.email
    createValues.roles = item.roles
    console.log('Getter Data',createValues)
    id.value = item.id
}

const formatPhoneNumber = (event) => {
  let input = event.target.value;

  input = input.replace(/[^\d+]/g, '');

  if (input.length > 13) {
    input = input.slice(0, 13);
  }

  const phoneRegex = /^\+?\d{10,13}$/;

  if (!phoneRegex.test(input)) {
    phoneError.value = true;
  } else {
    phoneError.value = false;
  }

  createValues.phone = input;
};

const validateEmail = (event) => {
  const email = event.target.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)) {
    emailError.value = true;
  } else {
    emailError.value = false;
  }
};

  const selectedRoleIds = computed({
    get() {
      return createValues.roles.map(role => role.id);
    },
    set(newRoleIds) {
      createValues.roles = newRoleIds.map(id => ({ id }));
    }
  });

onMounted( async() => {
   await getGood()

});


</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title"> Просмотр контрагента</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №{{ id }}
        </div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-save"
            @click="saveFn"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
        <fin-button
            icon="pi pi-times"
            @click="emit('close-sidebar')"
            label="Закрыть"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="grid grid-cols-10 mt-[30px] gap-[26px]">
      <div class="form w-full col-span-12 grid grid-cols-12 gap-[16px] relative create-goods">
        <fin-input :class="{ 'p-invalid': fv$.name.$error }" placeholder="Наименование" class="col-span-5" v-model="createValues.name"/>
        <fin-input  placeholder="Адрес" class="col-span-5" v-model="createValues.address"/>
        <fin-input
            @input="formatPhoneNumber"
            :class="{ 'p-invalid': phoneError || fv$.phone.$error }"
            placeholder="Телефон"
            class="col-span-5"
            v-model="createValues.phone"
        />
        <fin-input
            placeholder="Почта"
            class="col-span-5"
            v-model="createValues.email"
            @input="validateEmail"
            :class="{ 'p-invalid': emailError }"
        />
        <div class="form col-span-6 grid grid-cols-3 gap-[16px]">
          <div v-for="category in roleList" :key="category.id" class="flex items-center">
            <Checkbox
                v-model="selectedRoleIds"
                :value="category.id"
                name="category"
            />
            <label :for="category.id" class="ml-2">{{ category.name }}</label>
          </div>
        </div>


      </div>
    </div>
  <CounterpartyAgreements :productId="props.productId" :data="props.data"></CounterpartyAgreements>

  </div>

  <Toast/>
</template>

<style lang="scss" scoped>
.text-qs-code {
  font-family: Manrope, sans-serif;
  font-size: 20px;
  line-height: 20px;
  color: #141C30;
  font-weight: 600;
}

.dissipation-qs-code {
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
  color: #808BA0;
  font-weight: 600;
}

.img-goods {
  width: 261px !important;
  height: 207px !important;
  position: relative;
  z-index: 333;
}

</style>
