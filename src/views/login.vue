<template>
  <div>
    <div class="cont">
      <b-container style="height: auto; min-height: calc(100vh - 248px)">
        <b-card
          class="shadows"
          bg-variant="light"
          style="max-width: 450px; margin: 0 auto"
          img-src="https://www.cup.com.hk/wp-content/uploads/2017/08/379547776_1600.jpg"
        >
          <b-col>
            <h4 class="col-sm" style="font-weight: bold">
              {{ $t("navbar.Logo") }}
            </h4>
            <b-form @keyup.enter="onSubmit">
              <b-input-group class="mt-3">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="user-circle" />
                </b-input-group-prepend>
                <b-form-input
                  v-model="form.name"
                  :placeholder="$t('login.inputan')"
                  required
                />
              </b-input-group>
              <b-input-group class="mt-3">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="key" />
                </b-input-group-prepend>
                <b-form-input
                  v-model="form.password"
                  type="password"
                  :placeholder="$t('login.inputpassword')"
                  required
                />
              </b-input-group>
              <b-row align-h="between" style="margin: 15px auto 0px">
                <b-form-select
                  class="col-6"
                  v-model="language"
                  :options="selectlang"
                />
                <b-button
                  class="col-2"
                  style="min-width: 66px"
                  variant="info"
                  @click="onSubmit"
                  >{{ $t("login.login") }}
                </b-button>
              </b-row>
            </b-form>
          </b-col>
        </b-card>
      </b-container>
      <footer- />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cont {
  background-color: #f4f3ef;
  min-height: 100vh;
  height: auto;
  width: 100%;
  margin-inline: auto;
  margin-right: 0px;
}
.card {
  border: none;
}
.col {
  position: unset !important;
}
.container {
  padding-top: 60px;
  padding-bottom: 60px;
}
</style>


<script>
import axios from "axios";
import md5 from "js-md5";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      language: "zh",
      selectlang: [
        { text: "繁體中文", value: "zh" },
        { text: "简体中文", value: "cn" },
        { text: "English", value: "en" },
        { text: "日本語", value: "jp" },
      ],
      form: {
        name: "",
        password: "",
        unixtime: "",
        salt: "iamsalt",
        sign: "",
      },
    };
  },
  watch: {
    language: function () {
      this.lang(this.language);
    },
  },
  created: async function () {
    if (localStorage.getItem("language") != null) {
      this.language = localStorage.getItem("language");
    }
    this.form.name = "";
    this.form.password = "";
    setInterval(() => {
      this.UpdateTime();
    });
  },
  methods: {
    UpdateTime() {
      this.form.unixtime = new Date().getTime();
    },
    async onSubmit() {
      if (this.form.name == "" || this.form.password == "") {
        this.$swal(this.$t("login.error"), this.$t("login.noinput"), "error");
      } else {
        this.form.sign = md5(
          this.form.name +
            this.form.unixtime +
            this.form.salt +
            this.form.password
        );
        await axios
          .post(`${this.api}/login`, {
            name: this.form.name,
            password: this.form.password,
            unixtime: this.form.unixtime,
            sign: this.form.sign,
          })
          .then(async (response) => {
            if (response.data.status == 200) {
              this.sideactive = true;
              await VueCookies.set("token", response.data.result.api_token);
              sessionStorage.setItem("name", response.data.result.name);
              sessionStorage.setItem(
                "cellphone",
                response.data.result.cellphone
              );
              sessionStorage.setItem("chmod", response.data.result.chmod);
              sessionStorage.setItem("gender", response.data.result.gender);
              sessionStorage.setItem("id", response.data.result.id);
              sessionStorage.setItem("level", response.data.result.level);
              sessionStorage.setItem("status", response.data.status);
              this.status = true;
              this.$swal({
                title: this.$t("login.success"),
                text: this.$t("login.welcome"),
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: this.$t("login.confirm"),
              }).then(() => {
                // window.location.href = "/main";
                this.$router.push("/main");
              });
            } else if (response.data.status == 878787) {
              this.$swal(
                this.$t("login.locking"),
                this.$t("login.errormore"),
                "error"
              );
            } else if (response.data.status == 9487) {
              this.$swal(
                this.$t("login.locking"),
                this.$t("login.errorunstatus"),
                "error"
              );
            } else {
              this.$swal(
                this.$t("login.error"),
                this.$t("login.nocorrect"),
                "error"
              );
            }
          });
      }
    },
    lang(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
      document.title = this.$t(`meta.${this.$route.meta.title}`);
    },
  },
};
</script>