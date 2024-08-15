<script setup>
import {reactive, ref} from "vue";
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

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const goodGroupList = ref([]);
const productsInfo = ref();
const listUnit = ref([]);
const locationList = ref([]);
const goodNumber = ref()
const createValues = reactive({
  nameProduct: '',
  vendorCode: "",
  selectLocation: "",
  selectedGoodGroup: "",
  selectUnit: "",
  comments: "",
});
const rules = reactive({
  nameProduct: {required},
  vendorCode: {required},
  // selectLocation: {required},
  selectedGoodGroup: {required},
  selectUnit: {required},
});
const fileInput = ref()
const imagePreview = ref()
const imageRef = ref(null)


const v$ = useVuelidate(rules, createValues);

async function unitList() {
  try {
    const res = await useAxios(`/unit`);
    return listUnit.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

unitList()

async function locationGet() {
  try {
    const res = await useAxios(`/location`);
    return locationList.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

locationGet()

async function goodGroupGet() {
  try {
    const res = await useAxios(`/good-group`);
    return goodGroupList.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

goodGroupGet()

async function saveFn() {
  const result = await v$.value.$validate();
  const formData = new FormData()
  formData.append('name', createValues.nameProduct)
  formData.append('vendor_code', createValues.vendorCode)
  formData.append('unit_id', createValues.selectUnit.id)
  formData.append('good_group_id', createValues.selectedGoodGroup.id)
  formData.append('goods', productsInfo.value)
  if (imageRef.value !== null) {
    formData.append('main_image', imageRef.value)
  }
  console.log(formData)
  if (result) {
    try {
      const res = await useAxios(`/good/${props.productId}`, {
        method: "POST",
        data: formData,
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
        detail: e,
        life: 3000,
      });
    }
  }
}

async function getGood() {
  try {
    const res = await useAxios(`/good/${props.productId}`);
    createValues.nameProduct = res.result.name
    createValues.vendorCode = res.result.vendor_code
    createValues.selectedGoodGroup = res.result.good_group
    createValues.selectUnit = res.result.storage
    createValues.comments = res.result.description
    if (res.result.images?.length > 0) {
      imagePreview.value = res.result.images[0].image;
    } else {
      imagePreview.value = emptyImg;
    }
    goodNumber.value = res.result.id
  } catch (e) {
    console.log(e);
  }
}

getGood()

const selectAvatar = event => {
  const files = event.target.files
  imageRef.value = files[0]
  let filename = files[0].name
  if (filename.lastIndexOf('.') <= 0) {
    return
  }
  const fileReader = new FileReader()
  fileReader.addEventListener('load', () => {
    imagePreview.value = fileReader.result
  })
  fileReader.readAsDataURL(files[0])
}

const onPickFile = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Добавление товара</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №{{ goodNumber }}
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
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="flex mt-[30px] gap-[26px]">
      <div class="">
        <div class="relative" style="width: 100%;">
          <input
              accept="image/*"
              type="file"
              @change="selectAvatar"
              style="display: none"
              ref="fileInput"
          />
          <div v-if="imagePreview?.length === 0">
            <fin-button @click="onPickFile">Загрузить фото</fin-button>
          </div>
          <div v-else>
            <img :src="'http://testtask.taskpro.tj/test/public' +imagePreview" class="rounded-[16px] img-goods" alt=""
                 @click="onPickFile"/>
          </div>
        </div>
      </div>
      <div class="form w-full grid grid-cols-12 gap-[16px]">
        <fin-input placeholder="Введите название..." class="col-span-12" v-model="createValues.nameProduct"/>

        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectedGoodGroup"
              :options="goodGroupList"
              :class="{ 'p-invalid': v$.selectedGoodGroup.$error }"

              optionLabel="name"
              class="w-full"
          >
            <template #value>
              {{ createValues.selectedGoodGroup?.name }}
            </template>
          </Dropdown>
          <label for="dd-city">Категория</label>
        </FloatLabel>
        <fin-input class="col-span-3" placeholder="Артикул" v-model="createValues.vendorCode">

        </fin-input>
        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectUnit"
              :class="{ 'p-invalid': v$.selectUnit.$error }"
              :options="listUnit"
              optionLabel="name"
              class="w-full"
          >
            <template #value>
              {{ createValues.selectUnit?.name }}
            </template>
          </Dropdown>
          <label for="dd-city">Ед. изм.</label>
        </FloatLabel>
        <FloatLabel class="col-span-3">
          <!--          :class="{ 'p-invalid': v$.selectLocation.$error }"-->
          <Dropdown
              v-model="createValues.selectLocation"

              :options="locationList"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Местоположение</label>
        </FloatLabel>

        <FloatLabel class="col-span-12 mt-[10px]">
          <Textarea v-model="createValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
          <label for="dd-city">Описание</label>
        </FloatLabel>
      </div>
    </div>

  </div>
  <qs-code-add :product-id="props.productId" @postGoods="getProducts"/>
  <kit-goods :product-id="props.productId"/>
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
