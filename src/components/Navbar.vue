<template>
  <div class="nav" style="margin-left: 0; z-index: 4; user-select: none">
    <div class="sidebar-backdrop" @click="back" v-if="backdrop"></div>
    <b-navbar class="w-100 navbar">
      <b-navbar-nav>
        <b-button @click="opensidebar" v-if="active">
          <font-awesome-icon
            :icon="sidestatus ? 'align-left' : 'align-justify'"
          />
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav class="brand-center">
        <b-navbar-brand @click="push()">{{ $t("navbar.Logo") }}</b-navbar-brand>
      </b-navbar-nav>
      <b-navbar-nav v-if="screenWidth > 768">
        <b-nav-item-dropdown v-if="active" right>
          <b-dropdown-item @click="logout()">
            {{ $t("navbar.Logout") }}
            <font-awesome-icon icon="sign-out-alt" />
          </b-dropdown-item>
          <template #button-content>
            <font-awesome-icon icon="user" /> {{ name }}
          </template>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <b-dropdown-item @click="lang('zh')"> 繁體中文 </b-dropdown-item>
          <b-dropdown-item @click="lang('cn')"> 简体中文 </b-dropdown-item>
          <b-dropdown-item @click="lang('en')"> English </b-dropdown-item>
          <b-dropdown-item @click="lang('jp')"> 日本語 </b-dropdown-item>
          <template #button-content>
            <font-awesome-icon icon="globe-americas" />
            {{ $t("navbar.Lang") }}
          </template>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <b-breadcrumb class="w-100 shadow">
      <b-breadcrumb-item :active="!home" v-if="login" @click="push()">
        {{ $t("meta.main") }}
      </b-breadcrumb-item>
      <b-breadcrumb-item active v-if="home">
        {{ $t(`meta.${path}`) }}
      </b-breadcrumb-item>
    </b-breadcrumb>
    <side
      :breadcrumb="breadcrumb"
      :active="active"
      :name="name"
      :width="screenWidth"
      v-on:path="updatepath"
      v-on:lang="lang"
      v-if="sideactive"
      id="side"
      class="sidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  height: 45px;
}
.btn-secondary {
  color: #777 !important;
  background-color: transparent !important;
  border-color: transparent !important;
}
::v-deep .btn {
  font-size: 1.4rem;
}
::v-deep .btn:focus {
  box-shadow: none !important;
}
.breadcrumb {
  height: 45px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 0rem;
  background-color: #ffffff;
  opacity: 0.9;
  font-size: 13.5px;
  font-weight: 600;
  text-transform: uppercase;
}
.navbar-brand {
  font-weight: bold;
  margin-right: 0;
}
.navbar-light .navbar-toggler {
  color: #777;
  border-color: transparent;
}
.brand-center {
  margin-left: auto;
  margin-right: auto;
}
.nav {
  position: fixed !important;
  width: 100vw !important;
  top: 0;
  height: 90px !important;
  z-index: 1;
}
.sidebar {
  width: 210px;
  height: calc(100vh - 90px);
}
.sidebar-backdrop {
  cursor: default !important;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: calc(100vh - 90px);
  margin-top: 90px;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
}
::v-deep .dropdown-menu {
  background-color: #fffcf5 !important;
}
::v-deep .dropdown-item {
  color: #66615b !important;
}
::v-deep a {
  font-size: 13.5px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      backdrop: false,
      breadcrumb: null,
      sidestatus: true,
      screenWidth: 0,
      screenHeight: 0,
      active: true,
      sideactive: true,
      path: "",
      home: false,
      login: false,
      name: "",
      sidebar: "",
      con: "",
    };
  },
  watch: {
    screenWidth: function () {
      if (this.screenWidth <= 768 && this.$route.path != "/login") {
        if (this.sidestatus == true) {
          this.sidestatus = false;
          this.rwd(1);
        }
      } else {
        if (this.sidestatus == false) {
          this.sidestatus = true;
          this.rwd(0);
        }
      }
    },
  },
  created: async function () {
    window.addEventListener("resize", this.windowsize);
    this.screenWidth = 769;
    this.name = sessionStorage.getItem("name");
    if (this.$route.path == "/" || this.$route.path == "/main") {
      this.home = false;
    } else {
      this.home = true;
    }
    if (this.$route.path == "/login") {
      this.login = false;
    } else {
      this.login = true;
    }
    this.path = this.$route.path.replace(this.reEn, "");
    await this.checklogin();
    this.sidebar = document.getElementById("side");
    this.con = document.getElementById("cont");
    this.windowsize();
    this.active = this.status;
    if (
      sessionStorage.getItem("status") != 200 ||
      this.$route.path == "/login"
    ) {
      this.sideactive = false;
    }
    if (sessionStorage.getItem("status") == 200 && window.innerWidth <= 768) {
      this.sidestatus = false;
      this.rwd(1);
    }
  },
  methods: {
    windowsize() {
      this.screenWidth = window.innerWidth;
    },
    opensidebar() {
      this.windowsize();
      if (this.sidebar.style.marginLeft == "-209.6px") {
        this.sidebar.style.marginLeft = "0rem";
        if (this.screenWidth > 768) {
          this.con.style.paddingLeft = "209.6px";
        } else {
          this.backdrop = true;
        }
        this.sidestatus = true;
      } else {
        this.backdrop = false;
        this.sidebar.style.marginLeft = "-209.6px";
        if (this.screenWidth > 768) {
          this.con.style.paddingLeft = "0px";
        }
        this.sidestatus = false;
      }
    },
    async rwd(status) {
      if (status == 1) {
        this.backdrop = await false;
        this.con.style.paddingLeft = "0px";
        this.sidebar.style.marginLeft = "-209.6px";
      } else {
        this.backdrop = await false;
        this.con.style.paddingLeft = "209.6px";
        this.sidebar.style.marginLeft = "0rem";
      }
    },
    lang(lang) {
      this.$i18n.locale = lang;
      if (this.screenWidth <= 768) {
        this.backdrop = false;
        this.sidestatus = false;
        this.sidebar.style.marginLeft = "-209.6px";
      }
      localStorage.setItem("language", lang);
      document.title = this.$t(`meta.${this.$route.meta.title}`);
      this.$store.state.searchstatus[0].text = this.$t("cont.off");
      this.$store.state.searchstatus[1].text = this.$t("cont.on");
      this.$store.state.searchstatus[2].text = this.$t("cont.all");
      this.reload();
    },
    updatepath(e) {
      this.breadcrumb = null;
      this.backdrop = false;
      this.path = e.replace(this.reEn, "");
      if (this.screenWidth <= 768) {
        this.backdrop = false;
        this.sidestatus = false;
        this.sidebar.style.marginLeft = "-209.6px";
      }
      if (this.path == "main") {
        this.home = false;
      } else {
        this.home = true;
      }
    },
    push() {
      this.breadcrumb = "/main";
      this.home = false;
    },
    back() {
      this.backdrop = false;
      this.sidestatus = false;
      this.sidebar.style.marginLeft = "-209.6px";
    },
  },
};
</script>
