<script setup>
import sidebar from "@/constants/sidebar.js";
import PanelMenu from 'primevue/panelmenu';
import {ref} from "vue";

const emit = defineEmits(['valueFn']);
const isOpen = ref(false);
const dataOpened = ref(null);
let activeSidebar = ref(JSON.parse(localStorage.getItem('activeSidebar')));

const toggleOpen = (item) => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    dataOpened.value = item;
  } else {
    dataOpened.value = null;
  }
};

function sidebarClose() {
  emit('valueFn',activeSidebar.value)
  activeSidebar.value = true
  localStorage.setItem('activeSidebar', JSON.stringify(activeSidebar.value));
}
</script>
<template>

  <nav class="fixed top-0 z-50 w-full border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <a href="#" class="flex ms-0.5  mt-[15px]">
            <img @click="sidebarClose" src="@/assets/img/LogoSham.png" class="w-[28px] h-[28px] " alt=""/>
            <div  class="mt-2  pi pi-angle-right" style="margin-left: 2px; color: #3935E7;" @click="sidebarClose"></div>
          </a>
        </div>
      </div>
    </div>
  </nav>
  <aside id="logo-sidebar"
         style="border-top-right-radius: 30px"
         class="fixed top-0 left-0 z-40 w-[60px] h-screen pt-[55px]
         sidebar-animation-two
         transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
         aria-label="Sidebar">
    <div class="h-full  overflow-auto bg-white dark:bg-gray-800 font-[Manrope] -ml-7 ">


      <PanelMenu :model="sidebar" class="w-full">
        <template #item="{ item, index }">
          <div>
            <template v-if="item.label">
              <router-link
                  :to="item.route ? item.route : ''"
                  class="flex items-center justify-center cursor-pointer w-[100px] text-surface-700 font-[600] dark:text-[#ffffff]
                    hover:text-[#ffffff] text-[#141C30] h-[42px] "
                  :class="{ 'active-item': $route.path === item.route }"
                  @click="toggleOpen(item.label)"
              >
                <span class="opened item-size" style="font-size: 100px" :class="item.icon"></span>
              </router-link>
            </template>
            <!--<Transition name="slide-fade">-->

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