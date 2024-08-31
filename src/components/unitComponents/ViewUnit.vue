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
  findCurrency,
  currency,
  loading,
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

onMounted(function (){
  findCurrency()
  findOrganization()
})

const toast = useToast();

const id = ref();
const createValues = reactive({
  name: ""
});
const rules = reactive({

  name: {required},
});
const v$ = useVuelidate(rules, createValues);


async function saveFn() {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const res = await useAxios(`unit/${props.productId}`, {
        method: "PATCH",
        data: {
          name: createValues.name
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

async function getGood() {
  const item = props.data

  createValues.name = item.name

  id.value = item.id
}

onMounted(async () => {
  await getGood()
});


const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
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
