<script setup>
import sidebar from "@/constants/sidebar.js";
import PanelMenu from 'primevue/panelmenu';
import {ref} from "vue";


const isOpen = ref(false);

const toggleOpen = () =>{
  isOpen.value = !isOpen.value;
}


</script>



<template>
  <aside id="logo-sidebar"
         style="border-top-right-radius: 30px"
         class="fixed top-0 left-0 z-40 w-[280px] h-screen pt-[66px]  transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
         aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-auto bg-white dark:bg-gray-800 font-[Manrope]">
      <PanelMenu :model="sidebar" class="w-full">
        <template #item="{ item, index }" >
          <div>
            <template v-if="item.label">
            <a v-ripple
               class="flex items-center cursor-pointer text-surface-700 font-[600] dark:text-surface-0 px-3 py-2 hover:text-[#ffffff] text-[#141C30] h-[42px] w-[250px]"
               :class="{'active-item': $route.path === item.route,}"
               @click="toggleOpen"
            >
              <span class="opened" :class="item.icon"></span>
              <span class="ml-2 opened sub-title">{{ item.label }}</span>
              <span v-if="item.items" class="ml-auto">
                <i class="some-color" :class="isOpen ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
              </span>
            </a>
            </template>
              <div v-if="item.title" class="page-data">
                <div  class="sub-item uppercase">
                  {{item.title}}
                </div>
                <router-link
                    v-for="subItem in item.data"
                    :key="subItem.title"
                    :to="subItem.route"
                    v-slot="{ href, navigate }"
                    custom
                  >

                  <a v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[15px] font-semibold"
                      :class="{
                          'text-[#3935E7]': $route.path === subItem.route,
                          'text-[#808BA0]': $route.path !== subItem.route,
                          'active-item': $route.path === subItem.route,
                          'text-surface-700 dark:text-surface-0': $route.path !== subItem.route
                        }"
                      :href="href"
                      @click="navigate"
                    >
                    <span class="ml-2">{{ subItem.label }}</span>
                  </a>
                </router-link>

              </div>
            <div class="page-datas hover:bg-white ">
              <router-link
                  v-for="subItem in item.datas"
                  :key="subItem.title"
                  :to="subItem.route"
                  v-slot="{ href, navigate }"
                  custom
              >
                <a v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[15px] font-semibold"
                   :class="{
                          'text-[#3935E7]': $route.path === subItem.route,
                          'text-[#808BA0]': $route.path !== subItem.route,
                          'active-data': $route.path === subItem.route,
                          'text-surface-700 dark:text-surface-0': $route.path !== subItem.route
                        }"
                   :href="href"
                   @click="navigate"
                >
                  <span class="ml-2">{{ subItem.label }}</span>
                </a>
              </router-link>
            </div>

          </div>
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
  width: 250px !important;
  height: 44px !important;
}

.p-panelmenu-header-active .opened {
  color: #ffffff !important;
}

.p-panelmenu-panel {
  border-width: 0 !important;
  border-radius: 10px !important;
  margin-bottom: -10px !important;

}

.p-panelmenu-header-content:hover {
  background: #3935E7 !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  width: 248px !important;
}

.some-color {
  color: #B7C3D4;
}

::-webkit-scrollbar {
 width: 1px;
}

.active-item{
  border-right: 3px solid #3935E7;
  border-radius: 2px !important;
  height: 20px;
  margin-top: 10px;
  margin-bottom: 8px;
}
.active-data{
  border-right: 3px solid #3935E7;
  border-radius: 2px !important;
  height: 20px;
  margin-right: -16px !important;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}

.sub-item{
  color: #141C30;
  font-size: 11px;
  margin-left: 18px !important;
  font-family: Manrope;
  font-weight: bold;
  padding-top: 10px;
}
.page-data{
  border: 1px;
  border-radius: 10px !important;
  background: #f5f5f5;
  margin-top: 8px ;
  margin-left: -15px;
  padding-bottom: 3px;
}

.page-datas:not(hover){
  background-color: #ffffff;
}
.page-data a{
  margin-left: 10px !important;

}

</style>
