<script setup>
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Sidebar from "primevue/sidebar";
import CreatePurchase from "@/components/CreatePurchase.vue";
import FilterPurchase from "@/components/ViewPurchase.vue";
import Paginator from "primevue/paginator";
import Toolbar from "primevue/toolbar";
import Dialog from "primevue/dialog";
import { useAxios } from "@/composable/useAxios.js";
import moment from "moment";
import { useStaticApi } from "@/composable/useStaticApi.js";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { watch } from "vue";

const toast = useToast();
const {
  findStorage,
  storage,
  loadingStorage,
  findCounterparty,
  counterparty,
  loadingCounterparty,
} = useStaticApi();

const visibleRight = ref(false);
const products = ref();
const selectedStorage = ref(null);
const selectedProduct = ref();
const search = ref("");
const selectedCounterparty = ref();
const first = ref(null);
const visibleFilter = ref(false);
const metaKey = ref(true);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const pageCounts = ref([
  {
    count: 5,
  },

  {
    count: 10,
  },

  {
    count: 15,
  },

  {
    count: 20,
  },
]);
const openUp = ref(true);
const pagination = ref({
  perPage: 0,
  totalPages: 0,
});
const selectPage = ref({
  count: 20,
});

const deleteProduct = async () => {
  const id = ref();
  try {
    const res = await useAxios(`/document/provider/massDelete`, {
      method: "POST",
      data: {
        ids: id.value,
      },
    });
    id.value = selectedProduct.value.flatMap((el) => el.id);
    deleteProductDialog.value = false;
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e,
      life: 3000,
    });
  }
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

async function getProducts() {
  const res = await useAxios(
    `/document/provider/purchase?itemsPerPage=${selectPage.value.count}&orderBy=id&perPage=${first.value}&search=${search.value}
    &storage_id=${selectedStorage.value?.code}`
  );
  pagination.value.totalPages = res.result.pagination.total_pages;
  return (products.value = res.result.data);
}

const getSeverity = (status) => {
  switch (status) {
    case true:
      return {
        status: "success",
        name: "Проведен",
      };

    case false:
      return {
        status: "warn",
        name: "Не проведен",
      };
  }
};
watch(selectedStorage, (newValue) => {
  getProducts();
});
getProducts();
</script>

<template>
  <div class="grid grid-cols-12 gap-[16px] purchase-filter">
    <IconField class="col-span-6">
      <InputIcon class="pi pi-search" />
      <InputText
        class="w-full"
        @input="getProducts"
        v-model="search"
        placeholder="Поиск"
      />
    </IconField>
    <Dropdown
      v-model="selectedStorage"
      optionLabel="name"
      placeholder="Склад"
      @click="findStorage"
      :loading="loadingStorage"
      :options="storage"
      class="w-full col-span-2"
    />
    <Dropdown
      v-model="selectedCounterparty"
      :loading="loadingCounterparty"
      @click="findCounterparty"
      :options="counterparty"
      optionLabel="name"
      placeholder="Поставщик"
      class="w-full col-span-2"
    />
    <div class="flex gap-4 col-span-2">
      <fin-button
        @click="visibleFilter = true"
        severity="primary"
        class="w-[46px]"
      >
        <img src="@/assets/img/menu.svg" alt="" />
      </fin-button>
      <fin-button
        @click="visibleRight = true"
        severity="success"
        icon="pi pi-plus"
        class="w-[80%]"
        label="Создать"
      />
    </div>
  </div>
  <div class="card mt-4">
    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product">
          Are you sure you want to delete <b>{{ product.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <fin-button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteProductDialog = false"
        />
        <fin-button label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </Dialog>
    <Toolbar v-if="!(!selectedProduct || !selectedProduct.length)">
      <template #start>
        <div class="flex gap-3 items-center">
          <div
            class="text-[15px] leading-4 font-semibold font-[Manrope] text-[#3935E7]"
          >
            Выбран: {{ selectedProduct.length }}
          </div>
          <fin-button
            label="Провести"
            icon="pi pi-trash"
            class="p-button-sm"
            severity="warning"
            @click="confirmDeleteSelected"
            :disabled="!selectedProduct || !selectedProduct.length"
          />
          <fin-button
            label="Удалить"
            icon="pi pi-trash"
            severity="warning"
            class="p-button-sm"
            @click="confirmDeleteSelected"
            :disabled="!selectedProduct || !selectedProduct.length"
          />
          <fin-button
            label="Дублировать"
            icon="pi pi-copy"
            severity="warning"
            class="p-button-sm"
            @click="confirmDeleteSelected"
            :disabled="!selectedProduct || !selectedProduct.length"
          />
        </div>
      </template>
    </Toolbar>
    <DataTable
      v-model:selection="selectedProduct"
      :value="products"
      dataKey="id"
      tableStyle="min-width:100%"
      :metaKeySelection="metaKey"
    >
      <Column selectionMode="multiple"></Column>
      <Column field="code" :sortable="true" header="№">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          <span
            class="text-ellipsis block w-[90px] whitespace-nowrap overflow-hidden"
            >{{ slotProps.data.doc_number }}</span
          >
        </template>
      </Column>

      <Column field="name" :sortable="true" header="Дата">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ moment(new Date(slotProps.data.date)).format(" D.MM.YYYY h:mm") }}
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Поставщик">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.counterparty?.name }}
        </template>
      </Column>
      <Column field="image" :sortable="true" header="Организация">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.organization?.name }}
        </template>
      </Column>
      <Column field="price" :sortable="true" header="Сумма">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.sum }}
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Склад">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.storage?.name }}
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Статус">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          <Tag
            :value="getSeverity(slotProps.data.active).name"
            :severity="getSeverity(slotProps.data.active).status"
          />
        </template>
      </Column>
      <Column field="inventoryStatus" :sortable="true" header="Автор">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data?.author?.name }}
        </template>
      </Column>
      <Column field="rating" :sortable="true" header="Валюта">
        <template #sorticon>
          <i
            @click="openUp = !openUp"
            v-if="openUp"
            class="pi pi-arrow-down text-[#808BA0] text-[5px]"
          ></i>
          <i
            @click="openUp = !openUp"
            v-else
            class="pi pi-arrow-up text-[#808BA0] text-[5px]"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data?.currency?.name }}
        </template>
      </Column>
    </DataTable>
    <div class="paginator-dropdown w-full bg-white">
      <span class="paginator-text"> Элементов на странице: </span>
      <Dropdown
        v-model="selectPage"
        @update:model-value="getProducts"
        :options="pageCounts"
      >
        <template #value="slotProps">{{ slotProps.value.count }}</template>
        <template #option="slotProps">
          {{ slotProps.option.count }}
        </template>
      </Dropdown>
      <Paginator
        :rows="1"
        :totalRecords="pagination.totalPages"
        v-model:first="first"
        @page="getProducts"
        :rowsPerPageOptions="[10, 20, 30]"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} / {totalRecords}"
      />
    </div>
  </div>
  <Sidebar
    v-model:visible="visibleRight"
    :show-close-icon="false"
    position="right"
  >
    <CreatePurchase @close-dialog="visibleRight = false" />
  </Sidebar>
  <Sidebar
    v-model:visible="visibleFilter"
    :show-close-icon="false"
    position="right"
  >
    <filter-purchase />
  </Sidebar>
  <Toast />
</template>
<style lang="scss">
.paginator-dropdown {
  display: flex;
  justify-content: end;
  align-items: center;

  &-text {
    font-family: Manrope, sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    color: #141c30;
  }

  .p-select {
    border-color: #e9e9e9;
    border-radius: 10px;
    height: 29px;
    width: 65px;
    justify-content: center;
    align-items: center;
    margin-left: 9px;
  }

  .p-placeholder {
    font-family: Manrope, sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
  }

  .p-select-dropdown {
    width: 10px;
    height: 5px;
    margin-right: 10px;
  }
}

.purchase-filter {
  .p-inputtext {
    border-color: white !important;
    border-radius: 10px !important;
    box-shadow: none !important;
  }

  .p-inputtext::placeholder {
    color: #808ba0 !important;
    font-size: 15px !important;
    font-weight: 600;
    font-family: Manrope, sans-serif;
    line-height: 15px;
  }

  .p-select {
    border-color: white;
    border-radius: 10px !important;
    box-shadow: none !important;
  }

  .p-placeholder {
    color: #808ba0 !important;
    font-size: 15px !important;
    font-weight: 600;
    font-family: Manrope, sans-serif;
  }
}

.p-drawer-right .p-drawer {
  width: 1154px !important;
  border-top-left-radius: 30px;
}

.p-datatable-column-title {
  color: #808ba0;
  font-family: Manrope, sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 15px;
}

.p-datatable-table {
  border-radius: 10px;
}

.p-tag-label {
  font-size: 13px;
  line-height: 13px;
  font-weight: 600;
  font-family: Manrope, sans-serif;
}

.p-tag-success {
  background: #cbf7d2 !important;
  padding: 8px 12px 8px 12px !important;
  color: #17a825;
}

.p-tag-warn {
  background: #ffe9c9 !important;
  padding: 8px 12px 8px 12px !important;
  color: #c1790c;
}

.p-datatable-tbody > tr > td {
  color: #141c30;
  font-weight: 500;
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
}

.p-datatable-header-cell:nth-child(1) {
  border-top-left-radius: 10px !important;
}

.p-datatable-header-cell:nth-child(10) {
  border-top-right-radius: 10px !important;
}

.p-paginator {
  justify-content: end !important;
}
</style>
