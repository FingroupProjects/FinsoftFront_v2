<script setup>
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import InputIcon from "primevue/inputicon";
import Dialog from "primevue/dialog";
import IconField from "primevue/iconfield";
import {useAxios} from "@/composable/useAxios.js";
import {ref,computed} from "vue";

const emit = defineEmits(['close-modal'])
const props = defineProps({
  openFastGoods: {
    type: Boolean,
    default: false
  }
})
const checked = ref([]);
const fastGoodsList = ref([]);
const selectFilter = ref(0);
const filterList = ref([{
  name: 'Популярные',
  code: 1
},
  {
    name: 'Хлебобулочные изделия',
    code: 2
  },
  {
    name: 'Фрукты',
    code: 3
  },
  {
    name: 'Овощи',
    code: 4
  },
  {
    name: 'Напитки и соки',
    code: 5
  },
  {
    name: 'Мясные изделия',
    code: 6
  },
]);

const imgURL = import.meta.env.VITE_IMG_URL;

const toggleFilter = (index) => {
  selectFilter.value = index; // Toggle the selected state
};

async function getGoodGroup() {
  try {
    const res = await useAxios(`fastGoods`)
    fastGoodsList.value = res.result.data.map(el => {
      return {
        count: el.amount,
        name: el.name,
        description:el.description,
        vendorCode:el.vendor_code,
        price:el.price,
        img: el.images.length > 0 && el.images[0].image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
      }

    })
  } catch (e) {
    console.log()
  }
}
const checkedCount = computed(() => {
  return checked.value.filter(item => item).length; // Count only checked items
});
getGoodGroup()
</script>

<template>
  <Dialog v-model:visible="props.openFastGoods" modal :style="{ width: '940px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-5 items-center">
          <fin-button @click="emit('close-modal')" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Быстрые товары: {{checkedCount}}
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="success"
                    label="Добавить"/>
      </div>
    </template>
    <div>
      <IconField class="w-full filter-goods">
        <InputIcon class="pi pi-search "/>
        <InputText
            class="w-full"
            @keydown="getGoodGroup"
            placeholder="Поиск по названию, артикулу, штрих-коду"
        />
      </IconField>
      <div class="mt-[26px] flex gap-2">
        <button v-ripple v-for="(infoFilter,index) in filterList" :key="index"
                :class="{active:selectFilter ===index }"
                @click="toggleFilter(index)"
                class="font-semibold btn-transition text-[16px] leading-[16px] text-[#3935E7] bg-[#ECF1FB] h-[36px] rounded-[90px] px-[16px] py-[10px]">
          {{ infoFilter.name }}
        </button>
      </div>
      <div class="mt-[25px] grid grid-cols-12 gap-5">
        <div class="relative fast-good-checkbox  col-span-3" v-for="(infoFastGoods,index) in fastGoodsList" :key="index">
          <div class="bg-[#F3F3F3] rounded-[16px] overflow-hidden">
            <img :src="infoFastGoods?.img" class="w-[205px] h-[130px] rounded-[16px] object-cover" alt="">
          </div>
          <div
              class="text-ellipsis block w-[205px] mt-3 whitespace-nowrap overflow-hidden font-medium text-[18px] text-[#000] leading-[25px]">
            {{ infoFastGoods?.description }}
          </div>
          <Checkbox v-model="checked[index]" :binary="true"/>
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