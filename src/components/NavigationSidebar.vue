<script setup>
import sidebar from "@/constants/sidebar.js";
import PanelMenu from 'primevue/panelmenu';
import {ref} from "vue";
import OverlayBadge from "primevue/overlaybadge";
import {useSidebar} from "@/store/sidebar.js";

const emit = defineEmits(['valueFn']);
const store = useSidebar()
const isOpen = ref(false);
const dataOpened = ref(null);
const valueLeft = ref(false);

const toggleOpen = (item) => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    dataOpened.value = item;
  } else {
    dataOpened.value = null;
  }
};

function sidebarClose() {
  store.activeSidebar = true
}
</script>
<template>
  <nav class="fixed top-0 z-50 w-full border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <a href="#" class="flex ms-2  mt-[10px]">
            <img width="36" src="@/assets/img/Logo.svg" class="h-[28px]" alt=""/>
            <div @click="sidebarClose" class="open-close-sidebar pi pi-chevron-right" style="margin-left: 15px"></div>
          </a>
        </div>
      </div>
    </div>
  </nav>
  <aside id="logo-sidebar"
         style="border-top-right-radius: 30px"
         class="fixed top-0 left-0 z-40 w-[120px] h-screen pt-[66px]
         sidebar-animation-two
         transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
         aria-label="Sidebar">
    <div class="h-full  overflow-auto bg-white dark:bg-gray-800 font-[Manrope]">
      <PanelMenu :model="sidebar" class="w-full">
        <template #item="{ item, index }">
          <div>
            <template v-if="item.label">
              <router-link
                  :to="item.route ? item.route : ''"
                  class="flex items-center justify-center cursor-pointer w-[100px] text-surface-700 font-[600] dark:text-[#ffffff]
                    hover:text-[#ffffff] text-[#141C30] h-[42px]"
                  :class="{ 'active-item': $route.path === item.route }"
                  @click="toggleOpen(item.label)"
              >
                <span class="opened item-size" style="font-size: 100px" :class="item.icon"></span>
              </router-link>
            </template>
            <!--            <Transition name="slide-fade">-->
            <!--            <div  class="page-data absolute z-10 ">-->
            <!--              <div class="sub-item uppercase">-->
            <!--                {{ item.title }}-->
            <!--              </div>-->
            <!--              <router-link-->
            <!--                  v-for="subItem in item.data"-->
            <!--                  :key="subItem.title"-->
            <!--                  :to="subItem.route ? subItem.route : ''"-->
            <!--                  v-slot="{ href, navigate }"-->
            <!--                  custom-->
            <!--              >-->
            <!--                <a-->
            <!--                    v-ripple-->
            <!--                    class="flex items-center w-full cursor-pointer text-surface-700 dark:text-surface-0 py-2 hover:text-blue-600 text-[15px] font-semibold"-->
            <!--                    :class="{-->
            <!--                      'text-[#3935E7]': $route.path === subItem.route,-->
            <!--                      'text-[#808BA0]': $route.path !== subItem.route,-->
            <!--                      'active-item': $route.path === subItem.route,-->
            <!--                      'text-surface-700 dark:text-surface-0': $route.path !== subItem.route-->
            <!--                          }"-->
            <!--                    :href="href"-->
            <!--                    @click="navigate"-->
            <!--                >-->
            <!--                  <span class="ml-2">{{ subItem.label }}</span>-->
            <!--                </a>-->
            <!--              </router-link>-->
            <!--            </div>-->
            <!--            </Transition>-->
          </div>
        </template>
      </PanelMenu>
    </div>
  </aside>

</template>

<style scoped lang="scss">
.sidebar-animation-two{
  animation: left-sidebar 0.2s linear forwards;
}

@keyframes left-sidebar {
  0% {
    transform: translateX(-60px);
  }
  100% {
    transform: translateX(0px);
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  height: 0;
  opacity: 0;
}
</style>