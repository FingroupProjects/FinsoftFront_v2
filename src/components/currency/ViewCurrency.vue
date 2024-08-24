<script setup>
import {computed, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import emptyImg from '@/assets/img/emptyImg.svg';
import QsCodeAdd from "@/components/goodsComponents/QsCodeAdd.vue";
import KitGoods from "@/components/goodsComponents/KitGoods.vue";
import Carousel from "primevue/carousel";
import ExchangeRates from "@/components/currency/ExchangeRates.vue";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const goodGroupList = ref([]);
const listUnit = ref([]);
const locationList = ref([]);
const id = ref();
const imageRefs = ref([]);
const createValues = reactive({
  name: "",
  symbol_code: "",
  digital_code: "",
  multiplicity: ""
});
const rules = reactive({
  name: {required},
  symbol_code: {required},
  digital_code: {required},
  multiplicity: {required},
});
const fileInput = ref()
const imagePreview = ref([])
const imgURL = import.meta.env.VITE_IMG_URL;

const v$ = useVuelidate(rules, createValues);


async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`currency/${props.productId}`, {
        method: "PATCH",
        data: {
          digital_code: createValues.digital_code,
          symbol_code: createValues.symbol_code,
          name: createValues.name,
          multiplicity: createValues.multiplicity
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
    const res = await useAxios(`/currency/${props.productId}`);
    createValues.name = res.result.name
    createValues.digital_code = res.result.digital_code
    createValues.symbol_code = res.result.symbol_code
    createValues.multiplicity = res.result.multiplicity
    
    id.value = res.result.id
  } catch (e) {
    console.log(e);
  }
}

getGood()

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title"> Просмотр товара</div>
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
        <fin-input placeholder="Название" class="col-span-5" v-model="createValues.name"/>
        <fin-input placeholder="Символьный код" class="col-span-5" v-model="createValues.symbol_code"/>
        <fin-input placeholder="Цифровой код" class="col-span-5" v-model="createValues.digital_code"/>
        <fin-input placeholder="Кратность" class="col-span-5" v-model="createValues.multiplicity"/>
      </div>
    </div>

  </div>
  <exchange-rates :product-id="props.productId" :multiplicity="createValues.multiplicity" />
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
