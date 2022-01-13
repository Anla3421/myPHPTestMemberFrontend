<template>
  <div  >
    <b-card
      bg-variant="light "
      class="contcard shadows"
    >
      <div class="row">
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.account')"
          style="margin: 15px auto; min-width: 200px; min-width: 240px"
          size="sm"
        >
          <b-form-input
            v-model="filteruser"
            id="filter-input"
            type="search"
            :placeholder="$t('cont.searchaccount')"
          />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.url')"
          style="margin: 15px auto; min-width: 200px; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filterurl" :options="searchurl" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.action')"
          style="margin: 15px auto; min-width: 200px; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filteraction" :options="searchaction" />
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
        :items="filtercourselog"
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
        <template #cell(action)="data">
          <b-input-group
            size="sm"
            style="min-height: 45px; width: 410px; word-break: break-all"
          >
            <b-form-text>
              {{ $t(`cont.${data.item.action}`) }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(origin_data)="data">
          <b-input-group
            size="sm"
            style="min-height: 45px; width: 410px; word-break: break-all"
          >
            <b-form-text>
              {{ data.item.origin_data }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(alter_data)="data">
          <b-input-group
            size="sm"
            style="min-height: 45px; width: 410px; word-break: break-all"
          >
            <b-form-text>
              {{ data.item.alter_data }}
            </b-form-text>
          </b-input-group>
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
      filteruser: "",
      //搜尋位置
      filterurl: "",
      //搜尋行為
      filteraction: "",
      //搜尋最小日期
      filtermindate: "",
      //搜尋最大日期
      filtermaxdate: "",
      //搜尋位置清單
      searchurl: [],
      //搜尋行為清單
      searchaction: [
        { text: this.$t("cont.Update"), value: "Update" },
        { text: this.$t("cont.Read"), value: "Read" },
        { text: this.$t("cont.Create"), value: "Create" },
        { text: this.$t("cont.all"), value: "" },
      ],
      //總資料
      courselog: [],
      //搜尋後總資料
      filtercourselog: [],
      fields: [
        {
          key: "user",
          label: this.$t("cont.account"),
          thStyle: "min-width:100px",
        },
        {
          key: "url",
          label: this.$t("cont.url"),
          thStyle: "min-width:75px",
        },
        {
          key: "action",
          label: this.$t("cont.action"),
          thStyle: "min-width:100px",
        },
        {
          key: "origin_data",
          label: this.$t("cont.origin"),
          thStyle: "min-width:100px",
        },
        {
          key: "alter_data",
          label: this.$t("cont.alter"),
          thStyle: "min-width:100px",
        },
        {
          key: "created_at",
          label: this.$t("cont.Create"),
          thStyle: "min-width:106px",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filtercourselog.length;
    },
    per(){
      return this.$store.state.per;
    }
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filtercourselog.length / this.perPage);
    },
    currentPage: function () {
      if (this.currentPage == "" || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalpage) {
        this.currentPage = this.totalpage;
      }
    },
    filteruser: function () {
      this.search();
    },
    filteraction: function () {
      this.search();
    },
    filterurl: function () {
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
    async getdata() {
      await axios
        .post(`${this.api}/actionlog`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.courselog = res.data.result.actionlog;
          this.filtercourselog = res.data.result.actionlog;
          this.searchurl = res.data.result.actionlog.map((item) => {
            return { text: item.url, value: item.url };
          });
          this.searchurl.push({ text: this.$t("cont.all"), value: "" });
          const set = new Set();
          this.searchurl = this.searchurl.filter((item) =>
            !set.has(item.text) ? set.add(item.text) : false
          );
          this.isBusy = false;
        });
      if (this.courselog.length == 0) {
        this.swal("get");
      }
      this.totalpage = Math.ceil(this.filtercourselog.length / this.perPage);
    },
    mindateclear() {
      this.filtermindate = "";
    },
    maxdateclear() {
      this.filtermaxdate = "";
    },
    async search() {
      this.filtercourselog = this.courselog;
      if (this.filteruser != "") {
        this.filtercourselog = this.filtercourselog.filter((item) =>
          item.user.toLowerCase().includes(this.filteruser.toLowerCase())
        );
      }
      if (this.filteraction != "") {
        this.filtercourselog = this.filtercourselog.filter((item) =>
          item.action.toLowerCase().includes(this.filteraction.toLowerCase())
        );
      }
      if (this.filterurl != "") {
        this.filtercourselog = this.filtercourselog.filter(
          (item) => item.url.toLowerCase() == this.filterurl.toLowerCase()
        );
      }
      if (this.filtermindate != "") {
        this.filtercourselog = this.filtercourselog.filter(
          (item) => item.created_at.substring(0, 10) >= this.filtermindate
        );
      }
      if (this.filtermaxdate != "") {
        this.filtercourselog = this.filtercourselog.filter(
          (item) => item.created_at.substring(0, 10) <= this.filtermaxdate
        );
      }
    },
  },
};
</script>