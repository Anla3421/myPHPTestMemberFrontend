import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import date from './apis/date.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCookies from "vue-cookies"
import axios from 'axios';
import swal from 'vue-sweetalert2';
import Loading from 'vue-loading-overlay'
import SmoothScrollbar from 'vue-smooth-scrollbar'

import './filters'
import './components'
import './styles/app.scss'
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-loading-overlay/dist/vue-loading.css'
import { json } from 'body-parser'
import { faWindows } from '@fortawesome/free-brands-svg-icons'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(swal)
Vue.use(SmoothScrollbar)
Vue.use(i18n)


Vue.component('Loading', Loading)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
library.add(fas)

Vue.prototype.GLOBAL = App

Vue.prototype.$date = date

Vue.prototype.sideactive = true

Vue.prototype.reJp = /[^a-zA-Z0-9\u0800-\u9fa5\ \.\:\：\'\-]/gi // 中日英數
Vue.prototype.reCn = /[^a-zA-Z0-9\u4e00-\u9fa5\ \.\:\：\'\-]/gi // 中英數
Vue.prototype.reEn = /[^a-zA-Z0-9\ \.\:\：\'\-]/gi //英數
Vue.prototype.reMt = /[^0-9]/gi //數
Vue.prototype.reHs = /[^a-zA-Z0-9\.\/\ \:\：]/gi //forHost

Vue.prototype.status = false //登入狀態
// Vue.prototype.api = 'http://test777.ukyo.idv.tw/api' //api
Vue.prototype.api = 'http://127.0.0.1:8000/api' //api

Vue.prototype.isBusy = true //表格loading

  //登入狀態確認
  Vue.prototype.checklogin = async function () {
    const vue = this
    if (VueCookies.get("token") != "" && VueCookies.get("token") != null) {
      await axios.post(`${this.api}/apitokencheck`, {
        api_token: VueCookies.get('token')
      }).then(async (res) => {
        if (res.data.status != 200) {
          //登入超時
          this.status = false
          sessionStorage.clear();
          VueCookies.remove('token');
          if (this.$route.path != "/login") {
            //登入超時且不在登入畫面
            this.$swal({
              title: "登入超時",
              text: "請重新登入",
              icon: "info",
              timer: 2000,
              timerProgressBar: true,
              confirmButtonText: "確定",
            }).then(function () {
              console.clear();
              // window.location.href = "/login"
              vue.$router.push('/login')
            });
          }
        } else {
          //登入狀態
          this.status = true
          sessionStorage.setItem('name', res.data.result.name);
          sessionStorage.setItem('cellphone', res.data.result.cellphone);
          sessionStorage.setItem('chmod', res.data.result.chmod);
          sessionStorage.setItem('gender', res.data.result.gender);
          sessionStorage.setItem('id', res.data.result.id);
          sessionStorage.setItem('level', res.data.result.level);
          sessionStorage.setItem('status', res.data.status);
        }
      });
    } else {
      //未登入
      this.status = false
      sessionStorage.clear();
      VueCookies.remove("token");
      VueCookies.remove("name");
    }
  },
  //登出
  Vue.prototype.logout = async function () {
    this.$swal({
      title: this.$t("swal.logoutcheck"),
      showDenyButton: true,
      confirmButtonText: this.$t("swal.confirmed"),
      denyButtonText: this.$t("swal.cancel"),
    }).then((res) => {
      if (res.isConfirmed) {
        axios.post(`${this.api}/logout`, {
          id: sessionStorage.getItem('id')
        }).then(async (res) => {
          VueCookies.remove("token");
          VueCookies.remove("name");
          sessionStorage.clear();
          this.status = false;
          // window.location.href = "/login"
          this.$router.push('/login')
        })
      }
    });
  },
  //隨機顏色
  Vue.prototype.randomColor = function () {
    var color = "#";
    var randomArr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ];
    for (var i = 0; i < 6; i++) {
      color += randomArr[Math.ceil(Math.random() * (15 - 0) + 0)];
    }
    return color;
  },
  //swal
  Vue.prototype.swal = function (to) {
    if (to == 'fail') {
      this.$swal({
        title: this.$t('swal.fail'),
        text: this.$t('swal.special'),
        icon: "error",
      });
    } else if (to == "get") {
      this.$swal({
        title: this.$t('swal.sory'),
        text: this.$t('swal.nodate'),
        icon: "warning",
      });
    }
  },
  //更新送出
  Vue.prototype.updateData = function (api, upDatedata, id) {
    this.$swal({
      title: this.$t('swal.updatecheck'),
      showDenyButton: true,
      confirmButtonText: this.$t('swal.confirmed'),
      denyButtonText: this.$t('swal.cancel'),
      icon: "warning",
    }).then((res) => {
      if (res.isConfirmed) {
        this.loading = true;
        axios.post(`${this.api}/${api}/u`, upDatedata).then((res) => {
          this.loading = false;
          if (res.data.status == 200) {
            this.target_array.forEach((item) => {
              document.getElementById(
                `${item}_${id}`
              ).style.display = this.target.includes(item)
                  ? "block"
                  : "none";
            });
          }
          if (res.data.status == 200) this.getdata();
          this.$swal({
            title:
              Number(res.data.status) === 200 ? this.$t('swal.updatasuccess') : this.$t('swal.updatafail'),
            icon: Number(res.data.status) === 200 ? "success" : "error",
          });
        });
      }
    });
  },
  //新增資料
  Vue.prototype.createDate = function (api, createdata) {
    this.$root.$emit("bv::hide::modal", "create");
    this.loading = true;
    createdata.api_token = VueCookies.get("token");
    createdata.id = sessionStorage.getItem("id");
    axios
      .post(`${this.api}/${api}/c`, createdata)
      .then((res) => {
        this.loading = false;
        if (res.data.status == 200) this.getdata();
        this.$swal({
          title:
            Number(res.data.status) === 200 ? this.$t('swal.createsuccess') : this.$t('swal.createfail'),
          icon: Number(res.data.status) === 200 ? "success" : "error",
        });
      });
  }
//確認資料
Vue.prototype.preg = function (checkdata, pregdata) {
  var dataNullPass = true;
  var dataReplacePass = false;
  Object.values(checkdata).forEach((item) => {
    if (item === "" || item === null) {
      dataNullPass = false;
    }
  });
  if (dataNullPass) {
    dataReplacePass = true;
    pregdata.forEach((item) => {
      if (
        String(checkdata[item.key]) !=
        String(checkdata[item.key]).replace(this[item.check], "")
      ) {
        dataReplacePass = false;
      }
    });
  }
  if (!dataReplacePass || !dataNullPass) {
    this.swal("fail")
  }
  if (dataNullPass && dataReplacePass) {
    return true;
  } else {
    return false;
  }
},

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${i18n.t('meta.'+to.meta.title)}`
  }
  next()
})

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')


