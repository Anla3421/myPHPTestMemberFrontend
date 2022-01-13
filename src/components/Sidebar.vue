<template>
  <div style="background-color: #212120">
    <smooth-scrollbar style="height: calc(100% - 80px); padding-bottom: 80px">
      <template>
        <b-nav
          id="-1_/main"
          class="d-flex text-light align-items-center main"
          pills
          @mouseover="addStyle('/main', -1)"
          @mouseout="removeStyle('/main', -1)"
        >
          <b-nav-item
            style="width: 100%"
            @click="push('/main', -1)"
            :active="act === '-1_/main'"
          >
            <font-awesome-icon class="icon" id="icon_/main" icon="home" />
            {{ $t("navbar.home") }}
          </b-nav-item>
        </b-nav>
      </template>
      <div class="py-2 cont">
        <b-form-group>
          <b-nav v-for="(item, index) in sidebararray" :key="index" pills>
            <p @click="show_collapse(index)">
              <a href="javascript:void(0)">
                {{ $t(`sidebar.${item.table}`) }}
              </a>
              <b :id="`caret_${index}`" class="caret" />
            </p>
            <b-collapse :id="`collapse${index}`" style="width: 100%">
              <b-nav-item
                :id="`${index}_${item2.url}`"
                v-for="(item2, item) in item.submain"
                :key="item"
                @click="push(item2.url, index)"
                :active="act === `${index}_${item2.url}`"
                @mouseover="addStyle(item2.url, index)"
                @mouseout="removeStyle(item2.url, index)"
              >
                <font-awesome-icon
                  class="icon"
                  :id="`icon_${item2.url}`"
                  :icon="item2.icon2"
                />
                {{ $t(`sidebar.${item2.table}`) }}
              </b-nav-item>
            </b-collapse>
          </b-nav>
        </b-form-group>
      </div>
    </smooth-scrollbar>
    <footer class="footer" v-if="width <= 768">
      <b-dropdown dropright class="w-100" variant="#212120">
        <b-dropdown-item @click="logout()">
          {{ $t("navbar.Logout") }}
          <font-awesome-icon icon="sign-out-alt" />
        </b-dropdown-item>
        <template #button-content>
          <font-awesome-icon class="icon" icon="user" /> {{ name }}
        </template>
      </b-dropdown>
      <b-dropdown dropright offset="-90" class="w-100" variant="#212120;">
        <b-dropdown-item @click="lang('zh')"> 繁體中文 </b-dropdown-item>
        <b-dropdown-item @click="lang('cn')"> 简体中文 </b-dropdown-item>
        <b-dropdown-item @click="lang('en')"> English </b-dropdown-item>
        <b-dropdown-item @click="lang('jp')"> 日本語 </b-dropdown-item>
        <template #button-content>
          <font-awesome-icon class="icon" icon="globe-americas" />
          {{ $t("navbar.Lang") }}
        </template>
      </b-dropdown>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
#side {
  transition: margin-left 0.5s;
}
.nav-tabs {
  border-bottom: 1px solid #343a40;
}
.nav-link {
  color: #ffffff;
}
.nav-link.active {
  border-color: transparent;
  background-color: #3a4248;
  color: #ffffff;
}
.cont {
  min-height: calc(100vh - 300px);
  height: auto;
  margin: -20px auto -60px;
}
.form-inline {
  flex-flow: inherit;
}
.form-control {
  background-color: transparent;
  border-color: transparent;
  color: white;
}
.side_bar {
  color: #777 !important;
  background-color: transparent !important;
  border-color: transparent !important;
}
.main {
  margin-block: 10px;
}
.icon {
  margin-right: 0.5rem;
  color: #73818f;
}
a {
  color: #ffffff90 !important;
  font-size: 13.5px;
  font-weight: 600;
  text-transform: uppercase;
}
p {
  margin-left: 15px;
  color: white;
  margin-top: 1rem;
  width: 100%;
}
.footer {
  position: relative;
  height: 80px;
  border-top: 1px solid #c2c7cb20;
  margin-inline: 15px;
}
.caret {
  position: absolute;
  right: 10px;
  margin-top: 14px;
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  transition: all 0.15s ease 0s;
}
.rotated {
  transform: rotate(180deg);
}
::v-deep .btn {
  text-align: left;
  color: #ffffff90 !important;
  font-size: 13.5px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  inject: ["reload"],
  props: ["breadcrumb", "active", "name", "width"],
  data() {
    return {
      act: "",
      index: "",
      sidebararray: [],
      collapse: [],
      language: "",
    };
  },
  watch: {
    breadcrumb() {
      if (this.breadcrumb != null) {
        this.push(this.breadcrumb, -1);
      }
    },
  },
  created: async function () {
    var path = "";
    if (this.$route.path == "/") {
      path = "/main";
    } else {
      path = this.$route.path;
    }
    if (localStorage.getItem("language") == null) {
      this.language = "zh";
    } else {
      this.language = localStorage.getItem("language");
    }
    if (
      sessionStorage.getItem("sidebar") == null &&
      VueCookies.get("token") != null
    ) {
      await axios
        .post(`${this.api}/sidebar`, {
          api_token: VueCookies.get("token"),
          language: "en-us",
        })
        .then(async (res) => {
          sessionStorage.setItem(
            "sidebar",
            JSON.stringify(res.data.result.main)
          );
        });
    }
    this.sidebararray = await JSON.parse(sessionStorage.getItem("sidebar"));
    this.collapse.push({ path: "/main", index: -1 });
    if (this.sidebararray != null) {
      this.sidebararray.forEach((item, index) => {
        item.submain.forEach((item2) => {
          this.collapse.push({ path: item2.url, index: index });
        });
      });
    }
    this.collapse.forEach(async (item) => {
      if (item.path == path) {
        this.index = await item.index;
        this.$root.$emit("bv::toggle::collapse", `collapse${this.index}`);
        document.getElementById(`icon_${path}`).style.color = "#68b3c8";
        if (this.index != -1) {
          document
            .getElementById(`caret_${this.index}`)
            .classList.add("rotated");
        }
        this.act = `${this.index}_${path}`;
      }
    });
  },
  methods: {
    show_collapse(index) {
      this.$root.$emit("bv::toggle::collapse", `collapse${index}`);
      var caret = document.getElementById(`caret_${index}`);
      caret.classList.toggle("rotated");
    },
    addStyle(url, index) {
      if (`${index}_${url}` != `${index}_${this.$route.path}`) {
        document
          .getElementById(`${index}_${url}`)
          .setAttribute(
            "style",
            "background-color:#5a687240;transition:background-color 0.3s;"
          );
        document
          .getElementById(`icon_${url}`)
          .setAttribute("style", "color:#ffffff");
      }
    },
    removeStyle(url, index) {
      if (`${index}_${url}` != `${index}_${this.$route.path}`) {
        document.getElementById(`${index}_${url}`).removeAttribute("style");
        document
          .getElementById(`icon_${url}`)
          .setAttribute("style", "color:#73818f");
      }
    },
    push(url, index) {
      this.checklogin();
      if (this.width <= 768) {
        this.$parent.rwd(1);
      }
      var num = -1;
      document.getElementById(`${index}_${url}`).removeAttribute("style");
      document
        .getElementById(`icon_${this.$route.path}`)
        .setAttribute("style", "color:#73818f");
      document
        .getElementById(`icon_${url}`)
        .setAttribute("style", "color:#68b3c8");
      this.collapse.forEach((item) => {
        if (num != item.index) {
          num = item.index;
          var col = document.getElementById(`collapse${item.index}`);
          var caret = document.getElementById(`caret_${item.index}`);
          if (col.style.display == "" && item.index != index) {
            this.$root.$emit("bv::toggle::collapse", `collapse${item.index}`);
            caret.classList.remove("rotated");
          }
        }
      });
      this.act = `${index}_${url}`;
      this.$router.push(url).catch(() => {});
      this.$emit("path", url);
    },
    lang(lang) {
      this.$emit("lang", lang);
    },
  },
};
</script>


