<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FinInput from "@/components/ui/Inputs.vue";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import {useStaticApi} from "@/composable/useStaticApi.js";
const emit = defineEmits(["closeDialog", 'close-sidebar']);
import moment from "moment";
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
const {
  findUsers,
  userList,
  loadingUser
} = useStaticApi();


onMounted(function (){
  findUsers()
  getOrganization()
})

const toast = useToast();

const id = ref();
const createValues = reactive({
  name: "",
  inn: "",
  director: "",
  chief_accountant: "",
  address: "",
});
const rules = reactive({
  name: {required},
  inn: {required},
  director: {required},
  chief_accountant: {required}
});
const v$ = useVuelidate(rules, createValues);
async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`organization/${props.productId}`, {
        method: "PATCH",
        data: {
          name: createValues.name,
          INN: createValues.inn,
          chief_accountant_id: createValues.chief_accountant.id,
          director_id: createValues.director.id,
          address: createValues.address
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result);
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

async function getOrganization() {
  const item = props.data
  createValues.name = item.name
  createValues.inn = item.INN
  createValues.director = item.director
  createValues.chief_accountant = item.chief_accountant
  createValues.address = item.address
  id.value = item.id

  console.log(item)
  console.log(createValues)
}

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Просмотр</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">

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

    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <fin-input v-model="createValues.name" class="col-span-4" :error="v$.name.$error" placeholder="Наименование"/>
      <fin-input v-model="createValues.inn" class="col-span-4" :error="v$.inn.$error" placeholder="ИНН"/>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.director"
            :class="{ 'p-invalid': v$.director.$error }"
            :loading="loadingUser"
            :options="userList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ createValues.director?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Директор</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.chief_accountant"
            :class="{ 'p-invalid': v$.director.$error }"
            :loading="loadingUser"
            :options="userList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ createValues.chief_accountant?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Главный бухгалтер</label>
      </FloatLabel>
      <fin-input v-model="createValues.address" class="col-span-4"  placeholder="Адрес"/>
    </div>

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
