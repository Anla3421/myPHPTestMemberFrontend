<template>
  <div>
    <div>
      <b-card
        class="contcard shadows"
        :header="$t('cont.income')"
        bg-variant="light"
        style="margin-top: 10px"
      >
        <b-form-select
          v-model="whenforin_out"
          :options="dateforin_out"
          size="sm"
          style="max-width: 100px; margin-right: 5px"
        />
        <b-form-select
          v-model="profileforin_out"
          :options="currencyforin_out"
          size="sm"
          style="max-width: 150px"
        />
        <b-form-text>
          {{ startdate["in_out"] }}～{{ enddate["in_out"] }}
        </b-form-text>
        <BarChart
          :labels="InOutBarChartDate.labels"
          :chartdata="InOutBarChartDate.datasets"
          :options="InOutBarOptions"
        />
      </b-card>
    </div>
    <div>
      <b-card
        class="contcard shadows"
        header="Top3"
        bg-variant="light"
        style="margin-top: 10px"
      >
        <b-form-select
          v-model="whenfortop"
          :options="datefortop"
          size="sm"
          style="max-width: 100px; margin-right: 5px"
        />
        <b-form-select
          v-model="profilefortop"
          :options="currencyfortop"
          size="sm"
          style="max-width: 150px"
        />
        <b-form-text>
          {{ startdate["top"] }}～{{ enddate["top"] }}
        </b-form-text>
        <BarChart
          :labels="TopBarChartDate.labels"
          :chartdata="TopBarChartDate.datasets"
          :options="TopBarOptions"
        />
      </b-card>
    </div>
    <div>
      <b-card
        class="contcard shadows"
        :header="$t('cont.playercount')"
        bg-variant="light"
        style="margin-top: 10px"
      >
        <b-form-select
          v-model="whenforplayer"
          :options="dateforplayer"
          size="sm"
          style="max-width: 140px; margin-right: 5px"
        />
        <b-form-text>
          {{ startdate["player"] }}～{{ enddate["player"] }}
        </b-form-text>
        <LineChart
          :labels="PlayerLineChartDate.labels"
          :chartdata="PlayerLineChartDate.datasets"
          :options="PlayerLineOptions"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/chartjs/BarChart.vue";
import LineChart from "@/components/chartjs/LineChart.vue";
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  components: { BarChart, LineChart },
  data() {
    return {
      //搜尋時間
      whenforin_out: "today",
      whenforplayer: "seven",
      whenfortop: "today",
      //搜尋貨幣
      profileforin_out: 1,
      profilefortop: 1,
      //收益資料
      in_out: [],
      in_outBackup: [],
      //遊玩人數資料
      player: [],
      playerBackup: [],
      //Top3資料
      top: [],
      //玩家清單
      Allplayer: [],
      //貨幣清單
      currencyforin_out: [],
      currencyfortop: [],
      //時間清單
      dateforin_out: [
        { text: this.$t("cont.today"), value: "today" },
        { text: this.$t("cont.week"), value: "week" },
        { text: this.$t("cont.month"), value: "month" },
      ],
      dateforplayer: [
        { text: this.$t("cont.seven"), value: "seven" },
        { text: this.$t("cont.month"), value: "month" },
      ],
      datefortop: [
        { text: this.$t("cont.today"), value: "today" },
        { text: this.$t("cont.week"), value: "week" },
        { text: this.$t("cont.month"), value: "month" },
      ],
      //開始結束時間
      startdate: [],
      enddate: [],
      //期間日期
      allday: [],
      //收益圖表資料
      InOutBarChartDate: {
        labels: [],
        datasets: [
          {
            label: this.$t("cont.bet"),
            backgroundColor: "#FF979790",
            borderColor: ["#FF5151"],
            borderWidth: "1",
            data: [],
          },
          {
            label: this.$t("cont.out"),
            backgroundColor: "#ACD6FF90",
            borderColor: "#84C1FF",
            borderWidth: "1",
            data: [],
          },
          {
            label: this.$t("cont.surplus"),
            backgroundColor: "#C7C7E290",
            borderColor: "#A6A6D2",
            borderWidth: "1",
            data: [],
          },
        ],
      },
      InOutBarOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      //Top3圖表資料
      TopBarChartDate: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "#FF979790",
            borderColor: "#FF5151",
            borderWidth: "1",
            data: [],
          },
          {
            label: "",
            backgroundColor: "#ACD6FF90",
            borderColor: "#84C1FF",
            borderWidth: "1",
            data: [],
          },
          {
            label: "",
            backgroundColor: "#C7C7E290",
            borderColor: "#A6A6D2",
            borderWidth: "1",
            data: [],
          },
        ],
      },
      TopBarOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      //遊玩人數圖表資料
      PlayerLineChartDate: {
        labels: [],
        datasets: [
          {
            label: this.$t("cont.playercount"),
            backgroundColor: "#DCB5FF80",
            borderColor: "#CA8EFF",
            borderWidth: "1",
            lineTension: 0,
            data: [],
          },
        ],
      },
      PlayerLineOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  watch: {
    whenforin_out: function () {
      this.search(this.whenforin_out, "in_out");
    },
    profileforin_out: function () {
      this.search(this.whenforin_out, "in_out");
    },
    whenforplayer: function () {
      this.search(this.whenforplayer, "player");
    },
    whenfortop: function () {
      this.search(this.whenfortop, "top");
    },
    profilefortop: function () {
      this.search(this.whenfortop, "top");
    },
  },
  created: async function () {
    await this.getdata();
    this.search("today", "top");
    this.search("today", "in_out");
    this.search("seven", "player");
  },
  methods: {
    //取得資料
    async getdata() {
      await axios
        .post(`${this.api}/winlose`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.currency = res.data.result.currency;
          this.currencyforin_out = res.data.result.currency.map((item) => {
            return { text: item.game_currency, value: item.cid };
          });
          this.currencyfortop = res.data.result.currency.map((item) => {
            return { text: item.game_currency, value: item.cid };
          });
          this.Allplayer = res.data.result.player;
          res.data.result.report.forEach((item) => {
            item.report_with_reportdtl.forEach((item2) => {
              var time = item.created_at.substring(0, 10);
              var surplus = item2.out - item2.in;
              this.in_out.push({
                id: item.id,
                tid: item2.tid,
                count: 1,
                currency: item.report_with_currency.game_currency,
                in: item2.in,
                out: item2.out,
                surplus: surplus,
                created_at: time,
                currency_id: item.profile,
                player_id: [item.token],
              });
            });
            item.report_with_reportdtl.forEach((item2) => {
              var time = item.created_at.substring(0, 10);
              var surplus = item2.out - item2.in;
              this.player.push({
                id: item.id,
                tid: item2.tid,
                count: 1,
                surplus: surplus,
                created_at: time,
                player_id: [item.token],
              });
            });
          });
        });
      this.in_outBackup = JSON.stringify(this.in_out);
      this.playerBackup = JSON.stringify(this.player);
    },
    //分組
    group_by(arr, key, from) {
      var list = [];
      var merge = false;
      arr.forEach((item) => {
        merge = false;
        list.forEach((item2) => {
          if (
            item2[key] == item[key] &&
            item2["currency_id"] == item["currency_id"]
          ) {
            if (
              !item2["player_id"].includes(String(item["player_id"])) &&
              !item2["id"].includes(String(item["id"]))
            ) {
              var count = Number(item2["count"]) + 1;
              item2["count"] = count;
              item2["id"].push(String(item["id"]));
              item2["player_id"].push(String(item["player_id"]));
            }
            var bet = Number(item2["in"]);
            var out = Number(item2["out"]);
            var surplus = Number(item2["surplus"]);
            bet += Number(item["in"]);
            out += Number(item["out"]);
            surplus += Number(item["sutplus"]);
            item2["in"] = bet.toFixed(2);
            item2["out"] = out.toFixed(2);
            item2["surplus"] = surplus.toFixed(2);
            merge = true;
          }
        });
        if (merge == false) {
          item["group"] = item[key];
          item["player_id"].push(String(item["player_id"]));
          item["id"] = String(item["id"]).split("");
          list.push(item);
        }
      });
      if (from == "in_out") {
        //收益資料
        this.InOutBarChartDate.datasets[0].data = [];
        this.InOutBarChartDate.datasets[1].data = [];
        this.InOutBarChartDate.datasets[2].data = [];
        var push = false;
        var bet = "";
        var out = "";
        var surplus = "";
        this.InOutBarChartDate.labels.forEach((item) => {
          push = false;
          list.forEach((item2) => {
            if (item2.created_at == item) {
              push = true;
              bet = item2.in;
              out = item2.out;
              surplus = (out - bet).toFixed(3);
            }
          });
          if (push) {
            this.InOutBarChartDate.datasets[0].data.push(bet);
            this.InOutBarChartDate.datasets[1].data.push(out);
            this.InOutBarChartDate.datasets[2].data.push(surplus);
          } else {
            this.InOutBarChartDate.datasets[0].data.push(0);
            this.InOutBarChartDate.datasets[1].data.push(0);
            this.InOutBarChartDate.datasets[2].data.push(0);
          }
        });
      } else if (from == "player") {
        //遊玩人數資料
        this.PlayerLineChartDate.datasets[0].data = [];
        var push = false;
        var count = "";
        this.PlayerLineChartDate.labels.forEach((item) => {
          push = false;
          list.forEach((item2) => {
            if (item2.created_at == item) {
              push = true;
              count = item2.count;
            }
          });
          if (push) {
            this.PlayerLineChartDate.datasets[0].data.push(count);
          } else {
            this.PlayerLineChartDate.datasets[0].data.push(0);
          }
        });
      }
    },
    //搜尋
    async search(when, arr) {
      this.startdate[arr] = this.$date.setdate_s(when);
      this.enddate[arr] = this.$date.setdate_e(when);
      if (arr == "in_out") {
        //收益搜尋
        this.in_out = JSON.parse(this.in_outBackup);
        this.allday["in_out"] = this.$date.allday(
          this.startdate["in_out"],
          this.enddate["in_out"]
        );
        this.InOutBarChartDate.labels = this.allday["in_out"];
        this.in_out = this.in_out.filter(
          (item) => item.created_at.substring(0, 10) <= this.enddate["in_out"]
        );
        this.in_out = this.in_out.filter(
          (item) => item.created_at.substring(0, 10) >= this.startdate["in_out"]
        );
        this.in_out = this.in_out.filter(
          (item) => item.currency_id == this.profileforin_out
        );
        if (this.in_out.length != 0) {
          this.group_by(this.in_out, "created_at", "in_out");
        } else {
          this.InOutBarChartDate.datasets[0].data = [];
          this.InOutBarChartDate.datasets[1].data = [];
          this.InOutBarChartDate.datasets[2].data = [];
        }
      } else if (arr == "player") {
        //遊玩人數搜尋
        this.player = JSON.parse(this.playerBackup);
        this.allday["player"] = this.$date.allday(
          this.startdate["player"],
          this.enddate["player"]
        );
        this.PlayerLineChartDate.labels = this.allday["player"];
        this.player = this.player.filter(
          (item2) => item2.created_at.substring(0, 10) <= this.enddate["player"]
        );
        this.player = this.player.filter(
          (item2) =>
            item2.created_at.substring(0, 10) >= this.startdate["player"]
        );
        if (this.player.length != 0) {
          this.group_by(this.player, "created_at", "player");
        } else {
          this.PlayerLineChartDate.datasets[0].data = [];
        }
      } else if (arr == "top") {
        //TOP3搜尋
        for (var i = 0; i < 3; i++) {
          this.TopBarChartDate.datasets[i].data = [0];
          this.TopBarChartDate.datasets[i].label = this.$t("cont.no");
        }
        axios
          .post(`${this.api}/topthreecurrency`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            profile: this.profilefortop,
            starttime: this.startdate[arr],
            endtime: this.enddate[arr],
          })
          .then(async (item) => {
            this.top = await item.data.result.topPlayer;
            if (this.top.length != 0) {
              for (var j = 0; j < this.top.length; j++) {
                var Top3player = this.Allplayer.filter(
                  (item) => item.uniq_id == this.top[j].token
                );
                this.TopBarChartDate.datasets[j].label = `No.${j + 1}-${
                  Top3player[0].name
                }`;
                this.TopBarChartDate.datasets[j].data.push(
                  this.top[j].total_surplus
                );
                this.TopBarChartDate.datasets[j].data[0] = this.top[
                  j
                ].total_surplus;
              }
            }
            this.TopBarChartDate.labels = [];
            this.TopBarChartDate.labels.push(
              `${this.startdate["top"]}～${this.enddate["top"]}`
            );
          });
      }
    },
  },
};
</script>