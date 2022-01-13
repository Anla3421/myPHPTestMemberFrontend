<template>
  <div class="noscrool">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style scoped>
.noscrool {
  overflow-x: hidden;
  width: 100%;
}
</style>

