import Vue from 'vue';

Vue.component('home', () => import('./HomePage.vue'));
Vue.component('nav-bar', () => import('./Navbar.vue'));
Vue.component('footer-', () => import('./Footer.vue'));
Vue.component('side', () => import('./Sidebar.vue'));