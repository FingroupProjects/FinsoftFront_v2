<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import FloatLabel from "primevue/floatlabel";
import FinInput from "@/components/ui/Inputs.vue";
import emptyImg from '@/assets/img/emptyImg.svg';
import {useStaticApi} from "@/composable/useStaticApi.js";

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
const {
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

const toast = useToast();
const openInfoModal = ref(false);
const userId = ref();
const imageRefs = ref([]);
const createValues = reactive({
  name: "",
  surname: "",
  lastname: "",
  organization: "",
  login: "",
  phone: "",
  email: ""
});
const rules = reactive({
  name: {required},
  organization: {required},
  login: {required},
  phone: {required}
});
const fileInput = ref()
const imagePreview = ref()
const imgURL = import.meta.env.VITE_IMG_URL;

const v$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false;

  if (result) {
    const formData = new FormData();

    formData.append("organization_id", createValues.organization.id);
    formData.append("name", createValues.name);
    formData.append("login", createValues.login);
    formData.append("phone", createValues.phone);
    formData.append("group_id", 1);
    if (createValues.email != null) {
      formData.append("email", createValues.email);
    }
    if (imageRefs.value.length > 0) {
      formData.append("image", imageRefs.value[0]);
    }

    try {
      const res = await useAxios(`user/${props.productId}`, {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
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

async function getUser() {
    const item = props.data
    createValues.name = item.name
    createValues.lastname = item.lastname
    createValues.surname = item.surname
    createValues.login = item.login
    createValues.email = item.email
    createValues.phone = item.phone
    createValues.organization = item.organization

    if (item.image != null) {
      imagePreview.value = imgURL + item.image
    }

    userId.value = item.id
}
const selectImage = (event) => {
  const files = event.target.files;
  for (const file of files) {
    imageRefs.value.push(file);
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      imagePreview.value = fileReader.result;
    });
    fileReader.readAsDataURL(file);
  }
};
async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
}
const onPickFile = () => {
  fileInput.value.click();
};

onMounted( function (){
  findOrganization()
  getUser()
});
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Просмотр пользователя</div>
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
      <div class="relative col-span-3">
        <input
            accept="image/*"
            type="file"
            @change="selectImage"
            style="display: none"
            ref="fileInput"
        />
        <div v-if="imagePreview">
          <img
              :src="imagePreview"
              @click="onPickFile"
              alt=""
              class="w-[200px] m-auto rounded-[16px] h-[200px] object-cover"
          />
        </div>
        <div v-else class="w-[150px] h-[150px] m-auto flex items-center justify-center border border-dashed rounded-[16px]">
          <button @click="onPickFile" class="text-gray-500">
            Загрузить изображение
          </button>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="col-span-9 grid grid-cols-12 gap-[16px]">
        <fin-input v-model="createValues.name"  :class="{ 'p-invalid': v$.name.$error }" class="col-span-4" placeholder="Имя"/>

        <fin-input v-model="createValues.login" :class="{ 'p-invalid': v$.login.$error }"  class="col-span-4"  placeholder="Логин"/>
        <fin-input v-model="createValues.phone" :class="{ 'p-invalid': v$.phone.$error }" class="col-span-4"  placeholder="Телефон"/>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="createValues.organization"
              :class="{ 'p-invalid': v$.organization.$error }"
              :loading="loadingOrganization"
              :options="organization"
              optionLabel="name"
              class="w-full"
          >
            <template #value>
              {{ createValues.organization?.name }}
            </template>
          </Dropdown>
          <label for="dd-city">Организация</label>
        </FloatLabel>
        <fin-input v-model="createValues.email"  class="col-span-4"  placeholder="Email"/>

      </div>
    </div>


  </div>


  <Dialog
      v-model:visible="openInfoModal"
      :style="{ width: '424px' }"
      :modal="true"
  >
    <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
      Хотите сохранить измения?
    </div>
    <template #footer>
      <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="saveFn"/>
      <fin-button
          label="Отменить"
          icon="pi pi-times"
          class="w-full"
          severity="warning"
          @click="emit('close-sidebar')"
      />
    </template>
  </Dialog>
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
