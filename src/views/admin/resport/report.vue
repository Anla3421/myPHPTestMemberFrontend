<template>
  <div>
    <!-- <nav-bar /> -->
    <div  >
      <b-card
        bg-variant="light "
        class="col-md-auto"
        style="
          width: 95%;
          margin: 10px auto;
          height: auto;
          min-height: calc(100vh - 245px);
        "
      >
        <div class="row">
          <b-input-group
            class="col-sm"
            prepend="玩家"
            style="margin-top: 15px; min-width: 200px"
            size="sm"
          >
            <b-form-input v-model="filteruser" placeholder="Search" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="遊戲"
            style="margin-top: 15px; min-width: 200px"
            size="sm"
          >
            <b-form-select v-model="filtergame" :options="searchgame" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="開始"
            style="margin-top: 15px; min-width: 280px"
            size="sm"
          >
            <b-form-datepicker
              v-model="filtermindate"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              :max="mindatemax"
              size="sm"
              locale="zh"
            ></b-form-datepicker>
            <b-input-group-append>
              <b-button variant="outline-secondary" @click="mindateclear"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="結束"
            style="margin-top: 15px; min-width: 280px"
            size="sm"
          >
            <b-form-datepicker
              v-model="filtermaxdate"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              :min="maxdatemin"
              size="sm"
              locale="zh"
            ></b-form-datepicker>
            <b-input-group-append>
              <b-button variant="outline-secondary" @click="maxdateclear"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
          <b-input-group class="col-sm" style="margin: 15px auto" size="sm">
          </b-input-group>
        </div>
        <b-table
          style="font-size: 10px"
          :items="filterreport"
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
              <strong>{{$t('cont.loading')}}</strong>
            </div>
          </template>
          <template #cell(username)="data">
            <b-form-text>
              {{ data.item.report_with_player.name }}
            </b-form-text>
          </template>
          <template #cell(gamename)="data">
            <b-form-text>
              {{ data.item.report_with_game.game_with_gameinfo.name }}
            </b-form-text>
          </template>
          <template #cell(profile)="data">
            <b-form-text>
              {{ data.item.report_with_currency.game_currency }}
            </b-form-text>
          </template>
          <template #cell(more)="row">
            <b-button style="width: 75px" size="sm" @click="row.toggleDetails">
              詳細資料
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
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      loading: false,
      color: "",
      perPage: 10,
      currentPage: 1,
      totalpage: "",
      //最小日期上限
      mindatemax: "",
      //最大日期下限
      maxdatemin: "",
      //搜尋玩家
      filteruser: "",
      //搜尋遊戲
      filtergame: "",
      //搜尋最小日期
      filtermindate: "",
      //搜尋最大日期
      filtermaxdate: "",
      //搜尋遊戲清單
      searchgame: [],
      report: [],
      filterreport: [],
      fields: [
        {
          key: "username",
          label: "玩家",
          thStyle: "min-width:100px",
        },
        {
          key: "gamename",
          label: "遊戲",
          thStyle: "min-width:140px",
        },
        {
          key: "goods",
          label: "種類",
          thStyle: "min-width:70px",
        },
        {
          key: "profile",
          label: "幣別",
          thStyle: "min-width:70px",
        },
        {
          key: "surplus",
          label: "小計",
          thStyle: "min-width:100px",
        },
        {
          key: "created_at",
          label: "時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "more",
          label: "詳細資料",
        },
      ],
      //顯示更多欄位
      more: [
        { key: "in", text: "賭金" },
        { key: "out", text: "收益" },
        { key: "wage", text: "手續費" },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterreport.length;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterreport.length / this.perPage);
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
    filtergame: function () {
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
    this.color = await this.randomColor();
    this.isBusy = true;
    this.getdata();
  },
  methods: {
    async getdata() {
      await axios
        .post(`${this.api}/reportcombine`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.report = res.data.result.report;
          this.filterreport = res.data.result.report;
          this.isBusy = false;
          this.searchgame = res.data.result.game.map((item) => {
            return { text: item.game_with_gameinfo.name, value: item.gid };
          });
          this.searchgame.push({ text: "全部", value: "" });
        });
      if (this.report.length == 0) {
        this.swal("get")
      }
    },
    mindateclear() {
      this.filtermindate = "";
    },
    maxdateclear() {
      this.filtermaxdate = "";
    },
    search() {
      this.filterreport = this.report;
      if (this.filteruser != "") {
        this.filterreport = this.filterreport.filter((item) =>
          item.report_with_player.name
            .toLowerCase()
            .includes(this.filteruser.toLowerCase())
        );
      }
      if (this.filtergame != "") {
        this.filterreport = this.filterreport.filter(
          (item) => item.gid == this.filtergame
        );
      }
      if (this.filtermindate != "") {
        this.filterreport = this.filterreport.filter(
          (item) => item.created_at.substring(0, 10) >= this.filtermindate
        );
      }
      if (this.filtermaxdate != "") {
        this.filterreport = this.filterreport.filter(
          (item) => item.created_at.substring(0, 10) <= this.filtermaxdate
        );
      }
    },
  },
};
</script>