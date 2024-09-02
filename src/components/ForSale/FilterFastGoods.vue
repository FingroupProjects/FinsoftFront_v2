<script setup>
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import InputIcon from "primevue/inputicon";
import Dialog from "primevue/dialog";
import IconField from "primevue/iconfield";
import {useAxios} from "@/composable/useAxios.js";
import {ref, computed} from "vue";
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';

const emit = defineEmits(['close-modal', 'postProducts'])
const props = defineProps({
  openFastGoods: {
    type: Boolean,
    default: false
  }
})
const modules = ref([])
const fastGoodsList = ref([]);
const checked = ref(Array(fastGoodsList.value.length).fill(false));
const selectFilter = ref(null);
const filterList = ref([]);
const filterSelect = ref(null);
const postProducts = ref([]);
const imgURL = import.meta.env.VITE_IMG_URL;

const toggleFilter = (index, number) => {
  filterSelect.value = `/get-by-good-group-id/${number}`
  selectFilter.value = index;
  getGoodGroup();
};

async function getGoodGroup(event) {
  const params = {
    search: event?.srcElement.value,
  }
  try {
    const res = await useAxios(`good${filterSelect.value || ''}`, {params});

    const data = Array.isArray(res.result.data) && res.result.data.length > 0
        ? res.result.data
        : res.result;

    fastGoodsList.value = data.map(el => ({
      count: 1,
      products: el.name,
      description: el.description,
      vendorCode: el.vendor_code,
      price: el.price,
      id: el.id,
      img: el.images.length > 0 && el.images[0].image
          ? imgURL + el.images[0].image
          : new URL('@/assets/img/exampleImg.svg', import.meta.url),
    }));
  } catch (e) {
  }
}

getGoodGroup();

async function getFilter() {
  try {
    const res = await useAxios(`/good-group`)
    filterList.value = res.result.data.map(el => {
      return {
        code: el.id,
        name: el.name,
      }

    })
  } catch (e) {
    console.log()
  }
}

getFilter()

const toggleChecked = (index, info) => {

  checked.value[index] = !checked.value[index];
  const isChecked = checked.value[index];

  if (isChecked) {
    postProducts.value.push(info);
  } else {
    const itemIndex = postProducts.value.findIndex(postItem => postItem.id === info.id);
    if (itemIndex !== -1) {
      postProducts.value.splice(itemIndex, 1);
    }
  }
};

function handleCheckboxChange(item, isChecked) {
  if (isChecked) {
    postProducts.value.push(item)
  } else {
    const index = postProducts.value.findIndex(postItem => postItem.id === item.id);
    if (index !== -1) {
      postProducts.value.splice(index, 1);
    }
  }
}

function closeDialog() {
  selectFilter.value = null
  filterSelect.value = null
  postProducts.value = []
  checked.value = []
  emit('close-modal')
  getGoodGroup()
}

function postFn() {
  emit('postProducts', postProducts.value)
  selectFilter.value = null
  filterSelect.value = null
  checked.value = []

  getGoodGroup()
}

const checkedCount = computed(() => {
  return checked.value.filter(item => item).length;
});
</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header" v-model:visible="props.openFastGoods" modal
          :style="{ width: '940px', height:'620px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="closeDialog" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Быстрые товары: {{ checkedCount }}
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="success"
                    label="Добавить" @click="postFn"/>
      </div>
      <div class="mt-[26px]">
        <IconField class="w-full filter-goods">
          <InputIcon class="pi pi-search "/>
          <InputText
              class="w-full"
              @keydown="getGoodGroup"
              placeholder="Поиск по названию, артикулу, штрих-коду"
          />
        </IconField>
        <div class="mt-[26px] flex gap-4 overflow-y-auto w-full h-[fit-content] max-h-[400px]">
          <swiper
              :slidesPerView="4"
              :spaceBetween="-50"
              :modules="modules"

          >
            <swiper-slide v-for="(infoFilter, index) in filterList"
                          :key="index">
              <button
                  v-ripple
                  :class="{ active: selectFilter === index }"
                  @click="toggleFilter(index,infoFilter.code,)"
                  class="font-semibold btn-transition text-[18px] w-[200px] leading-[20px] text-[#3935E7] bg-[#ECF1FB] h-[48px] rounded-[90px]
               px-[20px] py-[12px] flex items-center justify-center"
              >
                <span class="truncate">{{ infoFilter.name }}</span>
              </button>
            </swiper-slide>
          </swiper>

        </div>
      </div>
    </template>
    <div>
      <div class="grid grid-cols-12 gap-5">
        <div class="relative fast-good-checkbox col-span-3" v-for="(infoFastGoods,index) in fastGoodsList"
             :key="index">
          <div v-ripple @click="toggleChecked(index, infoFastGoods)"
               class="bg-[#F3F3F3] rounded-[16px] overflow-hidden">
            <img :src="infoFastGoods?.img" class="w-[205px] h-[130px] rounded-[16px] object-cover" alt="">
          </div>
          <div
              class="text-ellipsis block w-[205px] mt-3 whitespace-nowrap overflow-hidden font-medium text-[18px] text-[#000] leading-[25px]">
            {{ infoFastGoods?.description }}
          </div>
          <Checkbox v-model="checked[index]" :binary="true"
                    @change="handleCheckboxChange(infoFastGoods, checked[index])"/>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
.fast-good-checkbox {
  .p-checkbox-checked .p-checkbox-box {
    background: #17A825 !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50%;
    border-color: transparent !important;
  }

  .p-checkbox {
    width: 32px !important;
    position: absolute;
    top: 5px;
    right: 13px;
  }

  .p-checkbox-box {
    border-radius: 50% !important;
    width: 32px !important;
    height: 32px !important;
  }

}

.fast-goods-header {
  .p-dialog-header {
    display: block !important;
  }
}

</style>
<style scoped lang="scss">
.active {
  background: #3935E7;
  color: white;
}

.btn-transition {
  transition: 0.3s all linear;
}
</style>