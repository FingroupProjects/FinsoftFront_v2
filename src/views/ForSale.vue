<script setup>
import {ref, watch, watchEffect, onMounted} from 'vue';
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Listbox from 'primevue/listbox';
import OverlayPanel from 'primevue/overlaypanel';
import {useAxios} from "@/composable/useAxios.js";
import FastGoods from "@/components/ForSale/FastGoods.vue";
import formatPrice from "../constants/formatNumber.js";
import DepositMoney from "@/components/ForSale/DepositMoney.vue";
import DiscountCard from "@/components/ForSale/DiscountCard.vue";
import FilterFastGoods from "@/components/ForSale/FilterFastGoods.vue";
import ManualDiscount from "@/components/ForSale/ManualDiscount.vue";
import AddUserInfo from "@/components/ForSale/AddUserInfo.vue";
import {useRouter} from "vue-router";
import ArciveList from "@/components/ForSale/ArciveList.vue";
import {useToast} from "primevue/usetoast";
import ReturnSale from "@/components/ForSale/ReturnSale.vue";

const router = useRouter();
const toast = useToast();

const openFastGoods = ref(false);
const selectedGoods = ref();
const openDiscount = ref(false);
const listGoods = ref();
const productsId = ref([]);
const searchTerm = ref('');
const listPostGoods = ref([]);
const getAllSum = ref(0);
const openDeposit = ref(false);
const userInfo = ref(null);
const payCount = ref(0);
const activeDiscount = ref(false);
const activeRightArrow = ref(false);
const openImgModal = ref(false);
const activeManual = ref(false);
const openManualModal = ref(false);
const saleSum = ref(0);
const userInfoModal = ref(false);
const handSale = ref(0);
const discountSale = ref(0);
const searchProducts = ref('');
const countArchive = ref(0);
const openArchiveList = ref(false);
const getIdSale = ref(null);
const disCount = ref();
const openModalReturnSale = ref(false);

const imgURL = import.meta.env.VITE_IMG_URL;
const userName = {
  name: localStorage.getItem("user_name"),
};

const getIdProducts = async (event) => {
  const inputValue = event?.target.value || '';
  searchTerm.value = inputValue;

  const res = await useAxios(`good?search=${inputValue}`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
    good_id: el.id,
    amount: el.amount + 1,
    img: el.images.length > 0 && el.images[0].image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
    vendorCode: el.vendor_code,
    price: el.price,
    count: 1
  }));
};
getIdProducts();

function userInfoFn(info) {
  userInfo.value = info
  discountSale.value += Number(info?.sum)

  openDiscount.value = false
}

function postSaleFn(info) {
  saleSum.value = info
  handSale.value += info
  openManualModal.value = false
}

function deleteFn(i) {
  listPostGoods.value.splice(i, 1)
  getAllSum.value = listPostGoods.value.reduce((total, el) => {
    return total + (el?.price || 0);
  }, 0)
}

const highlightMatch = (name, term) => {
  if (!term) return name;
  const regex = new RegExp(`(${term})`, 'gi');
  return name.replace(regex, '<span class="text-[#3935E7]">$1</span>');
};

function getFastProducts(products) {
  products.forEach(product => {
    listPostGoods.value.push(product);
  });
  if (products.length > 0) openFastGoods.value = false

  getAllSum.value = listPostGoods.value.reduce((total, el) => {
    return total + (el?.price || 0);
  }, 0)
}

function getFilterGoods(products) {
  products.forEach(product => {
    listPostGoods.value.push(product);
  });
  if (products.length > 0) openImgModal.value = false

  getAllSum.value = listPostGoods.value.reduce((total, el) => {
    return total + (el?.price || 0);
  }, 0)
}

function addCountFn(count) {
  count++
  getAllSum.value = listPostGoods.value.reduce((total, el) => {
    return total + (el?.price || 0);
  }, 0)
}

function openActiveFn() {
  openDiscount.value = true
  activeDiscount.value = true
}

function openManual() {
  activeManual.value = true
  openManualModal.value = true
}

function closeDiscount() {
  openDiscount.value = false
  activeDiscount.value = false
}

function closeManual() {
  openManualModal.value = false
  activeManual.value = false
}

function emptyAll() {
  openDeposit.value = false
  listPostGoods.value = []
  activeRightArrow.value = false
  getAllSum.value = 0
}

async function payMethodsFn() {
  const data = {
    "date": "2024-06-10 08:49:00",
    "discount_id": userInfo.value?.id,
    "certificate_id": null,
    "card_id": null,
    "card_sum": null,
    "discount_sum": userInfo.value?.sum,
    "certificate_sum": null,
    "type": activeRightArrow.value ? "return" : 'sale',
    "sale": handSale.value,
    "for_payment": payCount.value - handSale.value,
    "changes": null,
    "cash_sum": null,
    "goods": listPostGoods.value,
    "archive": true
  }

  try {
    const res = await useAxios(`rmk`, {
      method: 'POST',
      data: data
    })

    toast.add({severity: 'success', summary: 'Аннулировано!', detail: 'Успешно Аннулировано', life: 1500});

    setTimeout(() => {
      if (res.errors === null) {
        router.go()
      }
    }, 1000)

  } catch (e) {
    toast.add({severity: 'error', summary: e.response.data.message, life: 1500});
  }
}

async function getArchiveCount() {
  try {
    const res = await useAxios(`rmk/count/archive`)
    countArchive.value = res.result.count
  } catch (e) {
    console.log(e)
  }
}

getArchiveCount()

async function getArchive(id) {
  try {
    const res = await useAxios(`rmk/${id.value.id}`)
    getIdSale.value = res.result.sale
    payCount.value = res.result.for_payment
    disCount.value = res.result.discount
    listPostGoods.value = res.result?.goods.map((el) => ({
      products: el.good.name,
      good_id: el.good.id,
      amount: el.amount,
      img: el.good.images.length > 0 && el.images[0].image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
      vendorCode: el.good.vendor_code,
      price: Number(el.price),
    }));
    openArchiveList.value = false
    if (Number(getIdSale.value)) activeManual.value = true
    else activeManual.value = false
    if (Number(disCount.value)) activeDiscount.value = true
    else activeDiscount.value = false
  } catch (e) {
    console.log(e)
  }
}

getArchiveCount()

function openReturnSale() {
  activeRightArrow.value = !activeRightArrow.value
  openModalReturnSale.value = true
}

function closeReturnSale() {
  activeRightArrow.value = !activeRightArrow.value
  openModalReturnSale.value = false
}

async function getReturnSale(id) {
  try {
    const res = await useAxios(`rmk/${id.value.id}`)
    getIdSale.value = res.result.sale
    payCount.value = res.result.for_payment
    disCount.value = res.result.discount
    listPostGoods.value = res.result?.goods.map((el) => ({
      products: el.good.name,
      good_id: el.good.id,
      amount: el.amount,
      img: el.good.images.length > 0 && el.images[0].image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
      vendorCode: el.good.vendor_code,
      price: Number(el.price),
    }));
    openModalReturnSale.value = false
    if (Number(getIdSale.value)) activeManual.value = true
    else activeManual.value = false
    if (Number(disCount.value)) activeDiscount.value = true
    else activeDiscount.value = false
  } catch (e) {
    console.log(e)
  }
}

watch(selectedGoods, (newValue) => {
  if (newValue) {
    const existingItemIndex = listPostGoods.value.findIndex(item => item.good_id === newValue.good_id);
    if (existingItemIndex !== -1) {
      listPostGoods.value[existingItemIndex].amount += 1;
    } else {
      listPostGoods.value.push(newValue);
    }

    listGoods.value.hide();

    getAllSum.value = listPostGoods.value.reduce((total, el) => {
      return total + (el?.price * el.amount || 0);
    }, 0);

    searchProducts.value = '';
  }
});
watchEffect(() => {
  getAllSum.value = listPostGoods.value.reduce((total, el) => {
    return total + (el?.price * el?.amount || 0);
  }, 0)
  payCount.value = getAllSum.value
})

</script>

<template>
  <div class="grid grid-cols-12 gap-[14px]">
    <div class="bg-[#fff] col-span-8 px-[30px] py-[24px] rounded-[16px] for-sale ">
      <div>
        <div class="header-component font-semibold text-[26px] leading-[26px] text-[#000]">
          {{ !activeRightArrow ? 'Продажа' : 'Возврат' }}
        </div>
        <div class="filter-goods grid grid-cols-12 mt-4 gap-4">
          <IconField class="col-span-9">
            <InputIcon class="pi pi-search "/>
            <InputText
                ref="searchInput"
                @focus="(e)=>{listGoods.toggle(e)}"
                class="w-full"
                v-model="searchProducts"
                @input="getIdProducts"
                placeholder="Поиск по названию, артикулу, штрих-коду"
            />
          </IconField>
          <OverlayPanel ref="listGoods" class="w-[39%]">
            <Listbox v-model="selectedGoods" :options="productsId" optionLabel="name" class="w-full">
              <template #option="slotProps">
                <div class="flex items-center">
                  <img alt="" :src="slotProps.option.img" class="mr-2" style="width: 50px"/>
                  <div class="font-medium text-[20px] leading-[20px] text-[#000]">
                    <span v-html="highlightMatch(slotProps.option.products, searchTerm)"></span>
                    <div class="font-medium text-[16px] leading-[16px] text-[#808BA0] mt-2.5">
                      <span v-html="highlightMatch(slotProps.option.vendorCode, searchTerm)"></span>
                    </div>
                  </div>
                </div>
              </template>
            </Listbox>
          </OverlayPanel>

          <div class="flex gap-4 col-span-3 ">
            <fin-button class="w-full" severity="warning" @click="openFastGoods = true">
              <template #icon><img src="@/assets/img/iconFilterFale.svg" alt=""></template>
            </fin-button>
            <fin-button @click="openImgModal = true" icon="pi pi-images" class="w-full" severity="warning"/>
            <fin-button icon="pi pi-arrow-right-arrow-left" @click="openReturnSale"
                        :severity="activeRightArrow ? 'success' : 'warning'" severity="warning"/>
          </div>
        </div>
        <hr class="mt-[24px]">
        <div class="mt-[30px] overflow-style-for-sale h-[590px]">
          <div class="text-[20px] leading-[20px] text-[#141C30] font-semibold">
            Товары ({{ listPostGoods.length }})
          </div>
          <TransitionGroup name="fade" tag="div">
            <div
                class="rounded-[16px] h-[77px] bg-[#fff] shadow-goods  py-[15px] px-[12px] grid grid-cols-12 w-full justify-center  mt-5"
                v-for="(infoGoods,index) in listPostGoods" :key="index">
              <div class="flex gap-[15px] col-span-4">
                <img src="@/assets/img/exampleImg.svg" alt="" class="w-[50px] h-[50px] rounded-[14px]">
                <div class="text-[20px] leading-[20px] text-[#000] font-medium">
                  {{ infoGoods.products }}
                  <div class="mt-2.5 text-[16px] leading-4 text-[#808BA0]">
                    {{ infoGoods.vendorCode }}
                  </div>
                </div>
              </div>
              <div
                  class="flex p-[10px] gap-[15px] items-center bg-[#F2F2F2]  rounded-[90px] col-span-3 w-[139px] mt-[-7px]">
                <button v-ripple class="rounded-full py-[8px] px-[14px] bg-white"
                        @click="infoGoods.amount > 1 ? infoGoods.amount-- : null"><i
                    class="pi pi-minus text-[#3935E7]"></i></button>
                <div class="text-[#000] text-[18px] leading-[18px] text-center">{{ infoGoods.amount }}</div>
                <button v-ripple class="rounded-full py-[8px] px-[14px] bg-white"
                        @click="addCountFn(infoGoods.amount++)"><i
                    class="pi pi-plus text-[#3935E7]"></i>
                </button>
              </div>
              <div class="flex gap-[48px] justify-between col-span-5 w-[95%]">
                <div>
                  <div class="text-[15px] leading-[15px] font-medium text-[#808BA0]">Цена</div>
                  <div class="mt-[10px] text-[#000] text-[18px] leading-[18px] font-bold">
                    {{ formatPrice(infoGoods.price) }}
                  </div>
                </div>
                <div>
                  <div class="text-[15px] leading-[15px] font-medium text-[#808BA0]">Сумма</div>
                  <div class="mt-[10px] text-[#000] text-[18px] leading-[18px] font-bold">
                    {{ formatPrice(infoGoods.price * infoGoods.amount) }}
                  </div>
                </div>
                <div @click="deleteFn(index)" class="flex justify-center items-center">
                  <i v-ripple class="pi pi-trash text-[#808BA0] cursor-pointer relative right-[10px] text-[18px]"></i>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="relative top-[30px]">
        <div class="flex justify-between items-center w-full border-t py-[22px]  px-[30px]">
          <div class="flex gap-2 footer-btn-pencil">
            <fin-button @click="openArchiveList = true" severity="warning" class="w-[10%]" icon="pi pi-pencil"/>
            <fin-button @click="payMethodsFn" severity="warning" class="p-button-lg" icon="pi pi-pencil"
                        :label="`Отложить чек (${countArchive})`"/>
          </div>

          <div class="">
            Кассир: {{ userName.name }}
          </div>
        </div>

      </div>
    </div>

    <div class="bg-[#fff] col-span-4 px-[30px] py-[24px] rounded-[16px] for-sale h-[63%]">
      <div class="flex justify-between">
        <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">

        </div>
        <fin-button @click="userInfoModal = true" icon="pi pi-plus" severity="warning" label="Дисконтная"/>
      </div>
      <div class="flex gap-4 mt-4">
        <fin-button icon="pi pi-credit-card" :severity="activeDiscount ? 'success' : 'warning'" @click="openActiveFn"
                    class="p-button-2xl w-full"
                    label="Дисконтная"/>
        <fin-button icon="pi pi-percentage" :severity="activeManual ? 'success' : 'warning'" @click="openManual"
                    class="p-button-2xl w-full" severity="warning" label="Ручная скидка"/>
      </div>
      <div v-if="userInfo"
           class="bg-[#F2F2F2] mt-[16px] flex items-center gap-[10px] px-[16px] py-[12px] h-[50px] rounded-[12px]
              text-[#808BA0] text-[18px] font-semibold leading-[18px] mb-[24px]">
        <img src="@/assets/img/IconUser.svg" alt="">
        {{ userInfo?.lastname }} {{ userInfo?.name }}
      </div>
      <div class="border-t border-dashed py-[24px] mt-[24px] flex flex-col gap-[16px]">
        <div class="flex justify-between items-center">
          <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Предытог</div>
          <div class="font-semibold text-[24px] leading-[24px] text-[#141C30]">{{ formatPrice(getAllSum) }} <span
              class="text-[16px]">сум</span></div>
        </div>
        <div class="flex justify-between">
          <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Товаров в чеке</div>
          <div class="font-semibold text-[24px] leading-[24px] text-[#141C30]">{{ listPostGoods.length }} <span
              class="text-[16px]">ед</span>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Скидка</div>
          <div class="font-semibold text-[24px] leading-[24px] text-[#141C30]">{{ saleSum }} <span
              class="text-[16px]">сум</span>
          </div>
        </div>

      </div>
      <div class="flex justify-between items-center border-t py-[24px] ">
        <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">К оплате</div>
        <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{ formatPrice(payCount - handSale) }}
          <span
              class="text-[24px]">сум</span></div>
      </div>
      <fin-button :disabled="listPostGoods.length ===0" @click="openDeposit = true" icon="pi pi-arrow-right"
                  class="mt-[24px] p-button-3xl w-full"
                  severity="success"
                  :label="!activeRightArrow?'Внести деньги': 'Возврат денег'"/>
    </div>
  </div>
  <FastGoods @postProducts="getFastProducts" :open-fast-goods="openFastGoods" @close-modal="openFastGoods=false"/>
  <DepositMoney @closeEmpty="emptyAll" :goods-post="listPostGoods" :sale-post="handSale" :typeSale="activeRightArrow"
                :discount-id="userInfo?.id" :dis-count="discountSale" :sale-sum="payCount - handSale"
                :open-deposit-money="openDeposit"
                @close-modal="openDeposit=false"/>
  <DiscountCard :discountInfo="disCount" @post-info-user="userInfoFn" :sale-sum="getAllSum"
                :open-deposit-money="openDiscount"
                @close-modal="closeDiscount"/>

  <FilterFastGoods @postProducts="getFilterGoods" :open-fast-goods="openImgModal" @close-modal="openImgModal = false"/>
  <ManualDiscount :get-id-sale="getIdSale" @postSale="postSaleFn" :open-deposit-money="openManualModal"
                  @close-modal="closeManual"/>
  <AddUserInfo @closeModal="userInfoModal = false" :open-user-info="userInfoModal"/>
  <ArciveList @postArchive="getArchive" :open-fast-goods="openArchiveList" @close-modal="openArchiveList=false"/>
  <ReturnSale @post-return-sale="getReturnSale" :open-return-sale="openModalReturnSale" @close-modal="closeReturnSale"/>

</template>

<style lang="scss">
.footer-btn-pencil {
  .p-button {
    height: 46px !important;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
}

.overflow-style-for-sale {
  overflow: auto; /* Ensure the element can scroll if needed */
}

.overflow-style-for-sale::-webkit-scrollbar {
  width: 3px; /* Default width */
  height: 3px; /* Height for horizontal scrollbar */
}


.overflow-style-for-sale::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  height: 3px;
}

.overflow-style-for-sale::-webkit-scrollbar-thumb {
  background-color: #3935E7;
  border-radius: 6px;
  height: 3px;
}

.overflow-style-for-sale::-webkit-scrollbar-thumb:hover {
  background-color: #3935E7;
}

.filter-goods {
  .p-inputtext {
    border-radius: 12px;
    background: #F2F2F2;
    height: 60px;
    border: none;
  }

  .p-inputtext::placeholder {
    font-size: 18px !important;
    font-weight: 600;
    line-height: 18px;
    color: #808BA0;
  }

  .pi-search:before {
    font-size: 18px;
  }

  .p-button {
    height: 60px !important;
    width: 60px !important;
  }

  .p-button-icon {
    font-size: 20px !important;
  }
}

.p-listbox {
  border: none !important;
  box-shadow: none !important;
}

.p-popover {
  border: none !important;
  box-shadow: 0 6px 20px 0 #00000026 !important;

}

.p-popover-content {
  padding: 0 !important;
}

.p-popover:before {
  border-width: 0 !important;
}

.p-popover:after, .p-popover:before {
  bottom: 10px !important;
}


.shadow-goods {
  box-shadow: 0 0 15px 0 #0000001F;
}
</style>