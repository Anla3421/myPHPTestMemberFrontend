<template>
  <div  >
    <b-card
      bg-variant="light "
      class="contcard shadows"
    >
      <div class="row">
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.provider')"
          style="margin: 15px auto; min-width: 200px"
          size="sm"
        >
          <b-form-select v-model="filterprovider" :options="searchprovider" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.group')"
          style="margin: 15px auto; min-width: 200px"
          size="sm"
        >
          <b-form-select v-model="filtergroupby" :options="searchgroupby" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.start')"
          style="margin: 15px auto; min-width: 245px;"
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
        <b-button-group
          style="margin: 15px auto; min-width: 349px"
          size="sm"
        >
          <b-button
            size="sm"
            variant="info"
            v-for="(item, index) in datebtn"
            :key="index"
            @click="date(item.value)"
          >
            {{ item.text }}
          </b-button>
        </b-button-group>
      </div>
      <b-table
        style="font-size: 10px"
        :items="filterhistory"
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
      //搜尋供應商
      filterprovider: "",
      //搜尋分組
      filtergroupby: "player",
      //搜尋最小日期
      filtermindate: "",
      //搜尋最大日期
      filtermaxdate: "",
      //搜尋分組清單
      searchgroupby: [
        { text: this.$t("cont.provider"), value: "provider" },
        { text: this.$t("cont.member"), value: "player" },
        { text: this.$t("cont.da"), value: "created_at" },
        { text: this.$t("cont.game"), value: "game" },
      ],
      //搜尋供應商清單
      searchprovider: [],
      //總資料備份
      historyBackup: [],
      //搜尋後總資料
      filterhistory: [],
      //日期按鈕
      datebtn: [
        { text: this.$t("cont.today"), value: "today" },
        { text: this.$t("cont.yesterday"), value: "yesterday" },
        { text: this.$t("cont.week"), value: "week" },
        { text: this.$t("cont.lastweek"), value: "lastweek" },
        { text: this.$t("cont.month"), value: "month" },
        { text: this.$t("cont.lastmonth"), value: "lastmonth" },
      ],
      //欄位
      fields: [
        {
          key: "group",
          label: this.$t("cont.group"),
          thStyle: "min-width:100px",
        },
        {
          key: "player_count",
          label: this.$t("cont.playercount"),
          thStyle: "min-width:70px",
        },
        {
          key: "game_count",
          label: this.$t("cont.gamecount"),
          thStyle: "min-width:70px",
        },
        {
          key: "currency",
          label: this.$t("cont.currency"),
          thStyle: "min-width:80px",
        },
        {
          key: "in",
          label: this.$t("cont.bet"),
          thStyle: "min-width:100px",
        },
        {
          key: "out",
          label: this.$t("cont.out"),
          thStyle: "min-width:100px",
        },
        {
          key: "wage",
          label: this.$t("cont.wage"),
          thStyle: "min-width:80px",
        },
        {
          key: "surplus",
          label: this.$t("cont.surplus"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "margin",
          label: this.$t("cont.margin"),
          thStyle: "min-width:100px",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterhistory.length;
    },
    per(){
      return this.$store.state.per;
    }
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterhistory.length / this.perPage);
    },
    currentPage: function () {
      if (this.currentPage == "" || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalpage) {
        this.currentPage = this.totalpage;
      }
    },
    filtergroupby: function () {
      this.search();
    },
    filterprovider: function () {
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
    await this.getdate();
    this.search();
  },
  methods: {
    //取得資料
    async getdate() {
      await axios
        .post(`${this.api}/winlose`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.searchprovider = res.data.result.provider.map((item) => {
            return { text: item.name, value: item.id };
          });
          this.searchprovider.push({ text: this.$t("cont.all"), value: "" });
          res.data.result.report.forEach((item) => {
            item.report_with_reportdtl.forEach((item2) => {
              var time = item.created_at.substring(0, 10);
              var margin =
                Math.round((1 - item2.out / item2.in) * 10000) / 100.0 + "%";
              this.filterhistory.push({
                id: item.id,
                group: "",
                tid: item2.tid,
                player: item.report_with_player.name,
                player_count: 1,
                game: item.report_with_game.game_with_gameinfo.name,
                game_count: 1,
                provider: item.report_with_player.player_with_provider.name,
                currency: item.report_with_currency.game_currency,
                in: item2.in,
                out: item2.out,
                surplus: "",
                wage: item.wage,
                margin: margin,
                created_at: time,
                provider_id: item.report_with_player.provider_id,
                game_id: item.gid,
                currency_id: item.profile,
                player_id: item.report_with_player.id,
              });
            });
          });
          this.historyBackup = JSON.stringify(this.filterhistory);
        });
      if (this.filterhistory.length == 0) {
        this.swal("get");
      }
    },
    mindateclear() {
      this.filtermindate = "";
    },
    maxdateclear() {
      this.filtermaxdate = "";
    },
    //時間
    date(set) {
      this.filtermindate = this.$date.setdate_s(set);
      this.filtermaxdate = this.$date.setdate_e(set);
    },
    //分組
    group_by(arr, key) {
      this.isBusy = true;
      var list = [];
      var merge = true;
      arr.forEach((item) => {
        merge = false;
        list.forEach((item2) => {
          if (
            item2[key] == item[key] &&
            item2["currency"] == item["currency"] &&
            item2["goods"] == item["goods"]
          ) {
            if (
              !item2["player_id"].includes(String(item["player_id"])) &&
              !item2["id"].includes(String(item["id"]))
            ) {
              item2["player_count"] += 1;
              var surplus = Number(item2["surplus"]) - Number(item["wage"]);
              item2["surplus"] = surplus;
              var wage = (Number(item2["wage"]) + Number(item["wage"])).toFixed(
                3
              );
              item2["wage"] = wage;
              item2["id"].push(String(item["id"]));
              item2["player_id"].push(String(item["player_id"]));
            }
            item2["game_count"] += 1;
            var bet = Number(item2["in"]) + Number(item["in"]);
            var out = Number(item2["out"]) + Number(item["out"]);
            var surplus =
              Number(item2["surplus"]) +
              Number(item["out"]) -
              Number(item["in"]);
            item2["in"] = bet.toFixed(3);
            item2["out"] = out.toFixed(3);
            item2["surplus"] = surplus.toFixed(3);
            item2["margin"] = Math.round((1 - out / bet) * 10000) / 100.0 + "%";
            merge = true;
          }
        });
        if (merge == false) {
          item["surplus"] = (
            Number(item["out"]) -
            Number(item["in"]) -
            Number(item["wage"])
          ).toFixed(3);
          item["group"] = item[key];
          item["id"] = String(item["id"]).split("");
          item["player_id"] = String(item["player_id"]).split("");
          list.push(item);
        }
      });
      this.filterhistory = list;
      this.isBusy = false;
    },
    //搜尋
    search() {
      this.filterhistory = JSON.parse(this.historyBackup);
      if (this.filterprovider != "") {
        this.filterhistory = this.filterhistory.filter(
          (item) => item.provider_id == this.filterprovider
        );
      }
      if (this.filtermindate != "") {
        this.filterhistory = this.filterhistory.filter(
          (item) => item.created_at.substring(0, 10) >= this.filtermindate
        );
      }
      if (this.filtermaxdate != "") {
        this.filterhistory = this.filterhistory.filter(
          (item) => item.created_at.substring(0, 10) <= this.filtermaxdate
        );
      }
      this.group_by(this.filterhistory, this.filtergroupby);
    },
  },
};
</script>