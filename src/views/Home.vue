<template>
  <div>
    <nav-bar />
    <div id="cont" class="content">
      <transition name="fade" mode="out-in">
        <router-view v-if="isRouterAlive" />
      </transition>
      <footer- />
    </div>
  </div>
</template>


<script>
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>