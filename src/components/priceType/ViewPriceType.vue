<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import moment from "moment";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {data} from "autoprefixer";
import Select from "primevue/dropdown";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const id = ref();
const viewValues = reactive({
  name: '',
  organization: "",
  currency: "",
  comments: "",
  responsiblePerson: "",
});
const rules = reactive({
  name: {required},
  currency: {required},
});
const v$ = useVuelidate(rules, viewValues);
const {
  findCurrency,
    findEmployee,
  currency,
  loading,
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`priceType/${props.productId}`, {
        method: "PATCH",
        data: {
          currency_id: viewValues.currency.code,
          description: viewValues.comments,
          name: viewValues.name
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result.id);
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
  try {
    const res = await useAxios(`/priceType/${props.productId}`);
    viewValues.name = res.result.name
    viewValues.currency = {
      name: res.result.currency.name,
      code: res.result.currency.id
    }

    viewValues.comments = res.result.description
    id.value = res.result.id
  } catch (e) {
    console.log(e);
  }
}


onMounted(function (){
  getGood()
  findOrganization()
  findCurrency()
  findEmployee()
})

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Просмотр типа цен</div>
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
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <fin-input v-model="viewValues.name" class="col-span-4" :error="v$.name.$error" placeholder="Наименование"/>

      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="viewValues.currency"
            :class="{ 'p-invalid': v$.currency.$error }"
            @click="findCurrency"
            :loading="loading"
            :options="currency"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ viewValues.currency?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Валюта</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="viewValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
    </div>

  </div>
  <Toast/>
</template>

<style lang="scss" scoped>
.text-qs-id {
  font-family: Manrope, sans-serif;
  font-size: 20px;
  line-height: 20px;
  color: #141C30;
  font-weight: 600;
}

.dissipation-qs-id {
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
