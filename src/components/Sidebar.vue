<script setup>
import sidebar from "@/constants/sidebar.js";
import PanelMenu from 'primevue/panelmenu';
import {onMounted, ref} from "vue";
import OverlayBadge from "primevue/overlaybadge";
import NavigationSidebar from "@/components/NavigationSidebar.vue";
import {useSidebar} from "@/store/sidebar.js";

const emit = defineEmits(['valueFn']);

const isOpen = ref(false);
const dataOpened = ref(null);
const valueLeft = ref(true);
let activeSidebar = ref(JSON.parse(localStorage.getItem('activeSidebar')) ?? true);

const toggleOpen = (item) => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    dataOpened.value = item;
  } else {
    dataOpened.value = null;
  }
};

function sidebarFn() {
  activeSidebar.value = false;
  localStorage.setItem('activeSidebar', JSON.stringify(activeSidebar.value));
  emit('valueFn')
}

function changeFn() {
  activeSidebar.value = !activeSidebar.value;
  localStorage.setItem('activeSidebar', JSON.stringify(activeSidebar.value));
  emit('valueFn')
}

onMounted(() => {
  activeSidebar.value = JSON.parse(localStorage.getItem('activeSidebar'));
})
</script>
<template>
  <transition name="slide-fade">

    <div v-if="activeSidebar">
      <nav class="fixed top-0 z-50 w-full border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar"
                      type="button"
                      class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <a href="#" class="flex ms-0.5 md:me-24 mt-[15px] ml-[13px] ">
                <img @click="sidebarFn" src="@/assets/img/LogoSham.png" class="w-[28px] h-[28px] " alt=""/>
                <img @click="sidebarFn" src="@/assets/img/NameSham.png" class="h-[28px] ml-[6px] " alt="FlowBite Logo"/>
              </a>
            </div>
            <div class="flex items-center">
              <div class="flex items-center gap-[21px]">
                <OverlayBadge value="12">
                  <img src="@/assets/img/ring.svg" alt="">
                </OverlayBadge>
                <div>
                  <button type="button"
                          class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                          aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full"
                         src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                         alt="user photo">
                  </button>
                </div>
                <div
                    class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                    id="dropdown-user">
                  <div class="px-4 py-3" role="none">
                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                      Neil Sims
                    </p>
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul class="py-1" role="none">
                    <li>
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                         role="menuitem">Dashboard</a>
                    </li>
                    <li>
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                         role="menuitem">Settings</a>
                    </li>
                    <li>
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                         role="menuitem">Earnings</a>
                    </li>
                    <li>
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                         role="menuitem">Sign out</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside id="logo-sidebar"
             :class="{'w-[100px]':!valueLeft}"
             style="border-top-right-radius: 30px"
             class="fixed top-0 left-0 z-40 w-[260px] h-screen pt-[66px]
             sidebar-animation
         transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
             aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-auto bg-white dark:bg-gray-800 font-[Manrope]">
          <PanelMenu :model="sidebar" class="w-full">
            <template #item="{ item, index }">
              <div>
                <template v-if="item.label">
                  <router-link
                      :to="item.route ? item.route : ''"
                      class="flex items-center cursor-pointer text-surface-700 font-[600] dark:text-[#ffffff] px-3 py-2 hover:text-[#ffffff] text-[#141C30] h-[42px] w-[250px]"
                      :class="{ 'active-item': $route.path === item.route }"
                      @click="toggleOpen(item.label)"
                  >
                    <span class="opened item-size " :class="item.icon"></span>
                    <span class="ml-2 opened sub-title">{{ item.label }}</span>
                    <span v-if="item.items && isOpen && dataOpened === item.label" class="ml-auto mr-[20px]">
                  <i class="some-color" :class="'pi pi-chevron-down'"></i>
                </span>
                    <span v-if="item.items && dataOpened !== item.label" class="ml-auto mr-[20px]">
                  <i class="some-color" :class="'pi pi-chevron-right'"></i>
                </span>
                  </router-link>
                </template>
                <div v-if="item.title" class="page-data">
                  <div class="sub-item uppercase">
                    {{ item.title }}
                  </div>
                  <router-link
                      v-for="subItem in item.data"
                      :key="subItem.title"
                      :to="subItem.route ? subItem.route : ''"
                      v-slot="{ href, navigate }"
                      custom
                  >
                    <a
                        v-ripple
                        class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[15px] font-semibold"
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
                <div class="page-datas hover:bg-white">
                  <router-link
                      v-for="subItem in item.datas"
                      :key="subItem.title"
                      :to="subItem.route ? subItem.route : ''"
                      v-slot="{ href, navigate }"
                      custom
                  >
                    <a
                        v-ripple
                        class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[15px] font-semibold"
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
    </div>
    <div v-else>
      <nav class="fixed top-0 z-50 w-full border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-4 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar"
                      type="button"
                      class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
            </div>

            <div class="flex items-center">
              <div class="flex items-center gap-[21px]">
                <OverlayBadge value="12">
                  <img src="@/assets/img/ring.svg" alt="">
                </OverlayBadge>
                <div>
                  <button type="button"
                          class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                          aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full"
                         src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                         alt="user photo">
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </nav>
      <NavigationSidebar @value-fn="changeFn"/>
    </div>
  </transition>

</template>

<style lang="scss">
@import "@/assets/style/colors.scss";

.sidebar-animation {
  animation: left-sidebar 0.2s linear forwards;
}

@keyframes left-sidebar {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(0px);
  }
}

.p-panelmenu-header-active {
  background: $primary-color !important;
  border-width: 1px !important;
  border-radius: 10px !important;
  width: 230px !important;
  height: 44px !important;
}

.item-size {
  font-size: 20px !important;
}

.p-panelmenu-header-active .opened {
  color: white !important;

}


.p-panelmenu-panel {
  border-width: 0 !important;
  border-radius: 10px !important;
  margin-bottom: -10px !important;
}

.p-panelmenu-header-content:hover {
  background: $primary-color !important;
  color: white !important;
  border-radius: 10px !important;
  width: 228px !important;
}

.some-color {
  color: $pi-chevron-color;
}

::-webkit-scrollbar {
  width: 1px;
}

.active-item {
  border-right: 3px solid $primary-color;
  border-radius: 2px !important;
  height: 20px;
  margin-top: 10px;
  margin-bottom: 8px;
}

.active-data {
  border-right: 3px solid $primary-color !important;
  border-radius: 2px !important;
  height: 20px;
  margin-right: -16px !important;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}

.sub-item {
  color: $data-label-color;
  font-size: 11px;
  margin-left: 18px !important;
  font-family: Manrope, sans-serif;
  font-weight: bold;
  padding-top: 10px;
}

.page-data {
  border: 1px;
  border-radius: 10px !important;
  background: $secondary-color;
  margin-top: 8px;
  margin-left: -15px;
  padding-bottom: 3px;
}

.page-datas:not(:hover) {
  background-color: white;
}

.page-data a {
  margin-left: 10px !important;
}

</style>
