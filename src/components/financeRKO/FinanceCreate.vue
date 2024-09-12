<script setup>
import {ref, computed, onMounted} from 'vue';
import FinanceTabs from '@/components/financeRKO/FinanceTabs.vue';
import FinancePc from "@/components/financeRKO/FinancePc.vue";
import FinanceTabsCass from "@/components/financeRKO/FinanceTabsCass.vue";
import FinanceInvestment from "@/components/financeRKO/FinanceInvestment.vue";
import FinanceCreditReceive from "@/components/financeRKO/FinanceCreditReceive.vue";
import FinanceProviderRefound from "@/components/financeRKO/FinanceProviderRefound.vue";
import FinanceAccountablePersonRefund from "@/components/financeRKO/FinanceAccountablePersonRefund.vue";
import FinanceOtherExpenses from "@/components/financeRKO/FinanceOtherExpenses.vue";
import FinanceOtherIncomes from "@/components/financeRKO/FinanceOtherIncomes.vue";
import {useFinanceStore} from "@/store/finance.js";
import {useAxios} from "@/composable/useAxios.js";

const emit = defineEmits(['open-view', 'close-sidebar']);

const store = useFinanceStore()

const userName = {
  name: localStorage.getItem("user_name"),
};
const item = ref([]);
const activeTabIndex = ref(0);

const openTab = (index) => {
  activeTabIndex.value = index;
};

const activeTab = computed(() => {
  if (activeTabIndex.value !== null) {
    return item.value[activeTabIndex.value];
  }
  return {
    code: 0
  };
});

async function fetchOperating() {
  try {
    const res = await useAxios(
        `/operationTypes?type=RKO`
    );
    return (item.value = res.result.map((el) => {
      return {
        name: el.title_ru,
        code: el.id,
        type: el.type
      };
    }));
  } catch (e) {
    console.log(e);
  }
}

fetchOperating()

function openModal() {
  if (store.isModal) store.openInfoModal = true
  else emit('close-sidebar')
}

function closeFn() {
  emit('close-sidebar')
  store.isModal = false
  store.openInfoModal = false
}

function postMethod(id) {
  emit('open-view', id)
}
</script>

<template>
  <div>
    <div class="header flex justify-between items-center">
      <div class="header-title">Создание РКО</div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-times"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
            @click="openModal"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-[46px] mt-[30px]">
      <div class="sidebar-finance col-span-4 border-r">
        <div
            class="font-semibold text-[16px] text-[#808BA0] leading-[16px] p-[13px] cursor-pointer"
            v-for="(items, index) in item"
            :key="index"
            :class="{ 'active-tab': activeTabIndex === index }"
            @click="openTab(index)"
        >
          {{ items.name }}
        </div>
      </div>
      <FinanceTabs v-if="activeTab?.code === 10" @close-sidebar="closeFn" @close-dialog="postMethod"
                   :operation-type="activeTab?.code" :type="activeTab.type"/>
      <FinancePc v-if="activeTab?.code ===11" @close-sidebar="closeFn" @close-dialog="postMethod"
                 :operation-type="activeTab?.code" :type="activeTab.type"/>
      <FinanceTabsCass v-if="activeTab?.code ===12" @close-sidebar="closeFn" @close-dialog="postMethod"
                       :operation-type="activeTab?.code" :type="activeTab.type"/>
      <FinanceInvestment v-if="activeTab?.code ===13" @close-sidebar="closeFn" @close-dialog="postMethod"
                         :operation-type="activeTab?.code" :type="activeTab.type"/>
      <FinanceCreditReceive v-if="activeTab?.code ===14" @close-sidebar="closeFn" @close-dialog="postMethod"
                            :operation-type="activeTab?.code" :type="activeTab.type"/>
      <FinanceProviderRefound v-if="activeTab?.code ===15" @close-sidebar="closeFn" @close-dialog="postMethod"
                              :operation-type="activeTab?.code" :type="activeTab.type"/>
      <finance-accountable-person-refund v-if="activeTab?.code ===16" @close-sidebar="closeFn"
                                         @close-dialog="postMethod" :operation-type="activeTab?.code"
                                         :type="activeTab.type"/>
      <finance-other-expenses v-if="activeTab?.code ===17" @close-sidebar="closeFn" @close-dialog="postMethod"
                              :operation-type="activeTab?.code" :type="activeTab.type"/>
      <finance-other-incomes v-if="activeTab?.code ===18" @close-sidebar="closeFn" @close-dialog="postMethod"
                             :operation-type="activeTab?.code" :type="activeTab.type"/>

      <div class="text-[20px] font-[600] absolute bottom-[40px]">
        Автор: {{ userName.name }}
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-tab {
  background: #ECF1FB;
  color: #3935E7 !important;
  border-right: 2px solid #3935E7;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}
</style>