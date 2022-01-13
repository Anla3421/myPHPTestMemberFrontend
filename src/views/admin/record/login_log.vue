<template>
  <div>
    <b-card bg-variant="light" class="contcard shadows">
      <div class="row">
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.account')"
          style="margin: 15px auto; min-width: 200px; margin-left: 0px"
          size="sm"
        >
          <b-form-input
            v-model="filteraccount"
            :placeholder="$t('cont.searchaccount')"
          />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.start')"
          style="margin: 15px auto; min-width: 245px"
          size="sm"
        >
          <b-form-datepicker
            v-model="filtermindate"
            :placeholder="$t('cont.date')"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            label-help=""
            :label-no-date-selected="$t('cont.nodate')"
            :max="mindatemax"
            size="sm"
            :locale="this.lang"
          ></b-form-datepicker>
          <b-input-group-append>
            <b-button variant="outline-secondary" @click="mindateclear">{{
              $t("cont.clear")
            }}</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.end')"
          style="margin: 15px auto; min-width: 245px; margin-left: 0px"
          size="sm"
        >
          <b-form-datepicker
            v-model="filtermaxdate"
            :placeholder="$t('cont.date')"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            label-help=""
            :label-no-date-selected="$t('cont.nodate')"
            :min="maxdatemin"
            size="sm"
            :locale="this.lang"
          ></b-form-datepicker>
          <b-input-group-append>
            <b-button variant="outline-secondary" @click="maxdateclear">{{
              $t("cont.clear")
            }}</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="col-sm" style="margin: 15px auto" size="sm">
        </b-input-group>
      </div>
      <b-table
        style="font-size: 10px"
        :items="filterloginlog"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        :busy="this.isBusy"
        class="my-3"
        responsive
        striped
        hover
        small
      >
        <template #table-busy>
          <div class="text-center my-2" :style="`color:${color} !important`">
            <b-spinner class="align-middle"></b-spinner>
            <strong>{{ $t("cont.loading") }}</strong>
          </div>
        </template>
        <template #cell(more)="row">
          <b-button
            variant="info"
            style="width: 75px"
            size="sm"
            @click="row.toggleDetails"
          >
            {{ $t("cont.more") }}
          </b-button>
        </template>
        <template #row-details="row">
          <b-card>
            <b-row class="mb-2" v-for="(item, index) in more" :key="index">
              <b-col sm="3" class="text-sm-right">{{ item.text }}</b-col>
              <b-col>
                <b-input-group size="sm">
                  <b-form-text>
                    {{ row.item[item.key] }}
                  </b-form-text>
                </b-input-group>
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
      <div class="row">
        <div class="col-sm">
          <b-input-group
            :prepend="$t('cont.perpage')"
            size="sm"
            style="max-width: 50%; min-width: 150px"
          >
            <b-form-select v-model="perPage" :options="this.per" />
          </b-input-group>
        </div>
        <div class="col-sm">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            style="margin: auto"
            align="center"
          />
        </div>
        <div class="col-sm">
          <b-input-group
            :prepend="$t('cont.goto')"
            :append="$t('cont.page')"
            size="sm"
            style="max-width: 50%; margin-left: auto; min-width: 150px"
          >
            <b-form-input
              type="number"
              min="1"
              :max="totalpage"
              v-model="currentPage"
            />
          </b-input-group>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      lang: "",
      color: "",
      perPage: 10,
      currentPage: 1,
      totalpage: "",
      //最小日期上限
      mindatemax: "",
      //最大日期下限
      maxdatemin: "",
      //搜尋名稱
      filteraccount: "",
      //搜尋最小日期
      filtermindate: "",
      //搜尋最大日期
      filtermaxdate: "",
      //總資料
      loginlog: [],
      //搜尋後總資料
      filterloginlog: [],
      fields: [
        {
          key: "account",
          label: this.$t("cont.account"),
          thStyle: "min-width:100px",
        },
        {
          key: "times",
          label: this.$t("cont.logincount"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "Result",
          label: this.$t("cont.loginres"),
          thStyle: "min-width:100px",
        },
        {
          key: "continue_fail",
          label: this.$t("cont.failcount"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "created_at",
          label: this.$t("cont.Create"),
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "more",
          label: this.$t("cont.more"),
        },
      ],
      //顯示更多欄位
      more: [
        { key: "ip", text: this.$t("cont.ip") },
        { key: "agent", text: this.$t("cont.agent") },
        { key: "devicetype", text: this.$t("cont.devicetype") },
        { key: "platform", text: this.$t("cont.platform") },
        { key: "platformVersion", text: this.$t("cont.platformVersion") },
        { key: "browser", text: this.$t("cont.browser") },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterloginlog.length;
    },
    per() {
      return this.$store.state.per;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterloginlog.length / this.perPage);
    },
    currentPage: function () {
      if (this.currentPage == "" || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalpage) {
        this.currentPage = this.totalpage;
      }
    },
    filteraccount: function () {
      this.search();
    },
    filtermindate: function () {
      this.maxdatemin = this.filtermindate;
      this.search();
    },
    filtermaxdate: function () {
      this.mindatemax = this.filtermaxdate;
      this.search();
    },
  },
  created: async function () {
    if (localStorage.getItem("language") == null) {
      this.lang = "zh";
    } else {
      this.lang = localStorage.getItem("language");
    }
    this.color = await this.randomColor();
    this.isBusy = true;
    await this.getdata();
  },
  methods: {
    //取得資料
    async getdata() {
      await axios
        .post(`${this.api}/loginlog`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.loginlog = res.data.result.loginlog;
          this.filterloginlog = res.data.result.loginlog;
          this.isBusy = false;
        });
      if (this.loginlog.length == 0) {
        this.swal("get");
      }
      this.totalpage = Math.ceil(this.filterloginlog.length / this.perPage);
    },
    mindateclear() {
      this.filtermindate = "";
    },
    maxdateclear() {
      this.filtermaxdate = "";
    },
    async search() {
      this.filterloginlog = this.loginlog;
      if (this.filteraccount != "") {
        this.filterloginlog = this.filterloginlog.filter((item) =>
          item.account.toLowerCase().includes(this.filteraccount.toLowerCase())
        );
      }
      if (this.filtermindate != "") {
        this.filterloginlog = this.filterloginlog.filter(
          (item) => item.created_at.substring(0, 10) >= this.filtermindate
        );
      }
      if (this.filtermaxdate != "") {
        this.filterloginlog = this.filterloginlog.filter(
          (item) => item.created_at.substring(0, 10) <= this.filtermaxdate
        );
      }
    },
  },
};
</script>