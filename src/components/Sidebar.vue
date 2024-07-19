<script setup>
import sidebar from "@/constants/sidebar.js";
import PanelMenu from 'primevue/panelmenu';
import { ref, onMounted } from 'vue';

const isOpen = ref({});

// Initialize isOpen for each sidebar item
onMounted(() => {
  sidebar.forEach((item, index) => {
    isOpen.value[index] = false;
  });
});

// Function to toggle isOpen for a specific index
const toggleItem = (index) => {
  isOpen.value[index] = !isOpen.value[index];
};
</script>

<template>
  <aside id="logo-sidebar"
         style="border-top-right-radius: 30px"
         class="fixed top-0 left-0 z-40 w-64 h-screen pt-12 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
         aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-auto bg-white dark:bg-gray-800 ">
      <PanelMenu :model="sidebar" class="w-full ">
        <template #item="{ item, index }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom >
            <a v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[14px] font-semibold"
               :class="{
                 'text-[#3935E7]': $route.path === item.route,
                 'text-surface-700 dark:text-surface-0': $route.path !== item.route
               }"
               :href="href" @click="navigate">
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else v-ripple class="flex items-center cursor-pointer text-surface-700 font-[600] dark:text-surface-0 px-4 py-0 hover:text-[#ffffff] text-[#141C30] h-[46px]"
             :href="item.url"
             :target="item.target"
             @click="toggleItem(index)"
          >
            <span class="opened" :class="item.icon"></span>
            <span class="ml-2 opened">{{ item.label }}</span>
            <span v-if="item.items && !isOpen[index]" class="pi pi-chevron-right text-primary ml-auto some-color"></span>
            <span v-if="item.items && isOpen[index]" class="pi pi-chevron-down text-primary ml-auto some-color"></span>
          </a>
        </template>
      </PanelMenu>
    </div>
  </aside>
</template>

<style>
.indicator {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2px; /* Adjust the width as needed */
  background-color: #3182ce; /* Adjust the color as needed */
}

.p-panelmenu-header-active {
  background: #3935E7 !important;
  border-width: 1px !important;
  border-radius: 10px !important;
}

.p-panelmenu-header-active .opened {
  color: #ffffff !important;
}

.p-panelmenu-header-active:hover {
  background: #3935E7 !important;
}

.p-panelmenu-panel {
  border-width: 0 !important;
  border-radius: 10px !important;
}

.p-panelmenu-header-content:hover {
  background: #3935E7 !important;
  color: #ffffff !important;
}

.p-panelmenu-submenu {
  border: 1px;
  border-radius: 10px !important;
  background: #f5f5f5;
  margin-top: 6px !important;
}

.some-color {
  color: #B7C3D4;
}

</style>
