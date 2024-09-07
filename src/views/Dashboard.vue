<script setup>
import Sidebar from "@/components/Sidebar.vue"
import {ref} from "vue";
let activeSidebar = ref(JSON.parse(localStorage.getItem('activeSidebar')));

function changeFn() {
  activeSidebar.value = !activeSidebar.value;
  localStorage.setItem('activeSidebar', JSON.stringify(activeSidebar.value));

}
</script>

<template>
  <div class="transition-all">
    <Sidebar @value-fn="changeFn"/>
    <div class="pt-4 pl-4 pr-4 pb-0 animation-dashboard sm:ml-64 bg-[#ECF1FB]" :class="{'sm:ml-[80px]':activeSidebar}">
      <div class="pt-4 pl-4 pr-4 pb-0 rounded-lg  dark:border-gray-700 mt-[28px]" >
        <div class="gap-4">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.animation-dashboard{

  transition: 0.3s;
}
.p-overlaybadge .p-badge {
  background: #E73535;
  width: 16px !important;
  padding: 11px !important;
  height: 16px !important;
  font-size: 11px;
  line-height: 11px;
  font-weight: 700;
  font-family: Manrope, sans-serif;
  border-radius: 100%;
  outline-style: none !important;
}

.open-close-sidebar {
  margin-left: 50px;
  background-color: #F2F2F2 !important;
  border-radius: 70px !important;
  padding: 7px !important;
  width: 24px;
  height: 24px;
  display: flex;
  font-size: 11px !important;
  justify-content: center;
  align-items: center;
  color: #808BA0 !important;
}
</style>