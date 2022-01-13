<template>
  <div>
    <loading :active.sync="loading" />
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
            prepend="名稱"
            style="margin: 15px auto; min-width: 200px; max-width: 240px"
            size="sm"
          >
            <b-form-input
              v-model="filtername"
              id="filter-input"
              type="search"
              placeholder="Search"
            />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="供應商"
            style="margin: 15px auto; min-width: 200px; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filterprovider" :options="searchprovider" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="代理商"
            style="margin: 15px auto; min-width: 200px; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filteragent" :options="searchagent" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="貨幣"
            style="margin: 15px auto; min-width: 200px; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filtercurrency" :options="searchcurrency" />
          </b-input-group>
          <b-input-group class="col-sm" style="margin: 15px auto" size="sm">
          </b-input-group>
        </div>
        <b-table
          style="font-size: 10px"
          :items="filterwallet"
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
          <template #cell(provider)="data">
            <b-form-text>
              {{ data.item.player_with_provider.name }}
            </b-form-text>
          </template>
          <template #cell(agent)="data">
            <b-form-text>
              {{ data.item.player_with_agent.agent_name }}
            </b-form-text>
          </template>
          <template #cell(currency)="data">
            <b-input-group size="sm">
              <b-form-select
                style="display: none"
                :options="currency"
                v-model="data.item.currency"
                :id="`inputcurrency_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`currency_${data.item.id}`"
              >
                {{ data.item.player_with_currency.game_currency }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(amount)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.amount"
                :id="`inputamount_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`amount_${data.item.id}`"
              >
                {{ data.item.amount }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(update)="data">
            <b-button
              size="sm"
              style="width: 60px; display: none"
              variant="success "
              :id="`subbtn_${data.item.id}`"
              @click="submit(data)"
              >{{$t('cont.submit')}}</b-button
            >
            <b-button
              size="sm"
              style="width: 60px; display: none; margin-top: 5px"
              variant="danger "
              :id="`cancel_${data.item.id}`"
              @click="cancel(data)"
            >
              {{$t('cont.cancel')}}
            </b-button>
            <b-button
              style="width: 60px; display: block"
              :id="`updbtn_${data.item.id}`"
              size="sm"
              :disabled="chmod"
              @click="update(data.item.id)"
            >
              {{$t('cont.Update')}}
            </b-button>
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
      chmod: true,
      color: "",
      perPage: 10,
      currentPage: 1,
      totalpage: "",
      //搜尋名稱
      filtername: "",
      //搜尋供應商
      filterprovider: "",
      //搜尋代理商
      filteragent: "",
      //搜尋貨幣
      filtercurrency: "",
      //搜尋供應商清單
      searchprovider: [],
      //搜尋代理商清單
      searchagent: [],
      //搜尋貨幣清單
      searchcurrency: [],
      //貨幣清單
      currency: [],
      //總資料
      wallet: [],
      //搜尋後總資料
      filterwallet: [],
      //搜尋後總資料備份
      filterwalletBackup: [],
      fields: [
        {
          key: "name",
          label: "名稱",
          thStyle: "min-width:120px",
          sortable: true,
        },
        {
          key: "provider",
          label: "供應商",
          thStyle: "min-width:145px",
        },
        {
          key: "agent",
          label: "代理商",
          thStyle: "min-width:120px",
        },
        {
          key: "currency",
          label: "貨幣",
          thStyle: "min-width:80px",
        },
        {
          key: "amount",
          label: "貨幣數量",
          thStyle: "min-width:100px",
        },
        {
          key: "uniq_id",
          label: "Uniq_Id",
          thStyle: "min-width:120px",
        },
        {
          key: "update",
          label: this.$t('cont.Update'),
        },
      ],
      target_array: [
        "inputamount",
        "inputcurrency",
        "amount",
        "currency",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: ["currency", "amount", "updbtn"],
    };
  },
  computed: {
    rows() {
      return this.filterwallet.length;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterwallet.length / this.perPage);
    },
    currentPage: function () {
      if (this.currentPage == "" || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalpage) {
        this.currentPage = this.totalpage;
      }
    },
    filtername: function () {
      this.search();
    },
    filterprovider: function () {
      this.search();
    },
    filteragent: function () {
      this.search();
    },
    filtercurrency: function () {
      this.search();
    },
  },
  created: async function () {
    this.color = await this.randomColor();
    this.isBusy = true;
    await this.getdata();
    if (sessionStorage.getItem("chmod") == "user") {
      this.chmod = true;
    } else {
      this.chmod = false;
    }
  },
  methods: {
    async getdata() {
      await axios
        .post(`${this.api}/wallet`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.wallet = res.data.result.wallet;
          this.filterwallet = res.data.result.wallet;
          this.filterwalletBackup = JSON.stringify(res.data.result.wallet);
          this.searchprovider = res.data.result.provider.map((item) => {
            return { text: item.name, value: item.id };
          });
          this.searchagent = res.data.result.agent.map((item) => {
            return { text: item.agent_name, value: item.id };
          });
          this.searchcurrency = res.data.result.currency_initial.map((item) => {
            return { text: item.game_currency, value: item.cid };
          });
          this.currency = res.data.result.currency_initial.map((item) => {
            return { text: item.game_currency, value: item.cid };
          });
          this.searchprovider.push({ text: "全部", value: "" });
          this.searchagent.push({ text: "全部", value: "" });
          this.searchcurrency.push({ text: "全部", value: "" });

          this.totalpage = Math.ceil(this.filterwallet.length / this.perPage);
        });
      if (this.wallet.length == 0) {
        this.$swal({
          title: "很抱歉！",
          text: "查無相關資料",
          icon: "warning",
        });
      }
    },
    //修改
    update(id) {
      //顯示輸入欄位，隱藏文字欄位
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${id}`
        ).style.display = this.target.includes(item) ? "none" : "block";
      });
    },
    //修改送出
    submit(data) {
      var amount = String(data.item.amount);
      var dataNullPass = true;
      var dataReplacePass = false;
      if (amount == "") {
        dataNullPass = false;
      }
      if (dataNullPass) {
        dataReplacePass = true;
        if (amount != amount.replace(this.reMt, "")) {
          dataReplacePass = false;
        }
      }
      if (!dataReplacePass || !dataNullPass) {
        this.$swal({
          title: "失敗！",
          text: "內容為空或含有特殊符號",
          icon: "error",
        });
      } else {
        this.$swal({
          title: "是否確定要修改",
          showDenyButton: true,
          confirmButtonText: "確定",
          denyButtonText: "取消",
          icon: "warning",
        }).then((res) => {
          if (res.isConfirmed) {
            this.loading = true;
            axios
              .post(`${this.api}/wallet/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                update_id: data.item.id,
                currency: data.item.currency,
                amount: amount,
              })
              .then((res) => {
                this.loading = false;
                //修改成功
                if (res.data.status == 200) {
                  //顯示文字欄位，隱藏修改欄位
                  this.target_array.forEach((item) => {
                    document.getElementById(
                      `${item}_${data.item.id}`
                    ).style.display = this.target.includes(item)
                      ? "block"
                      : "none";
                  });
                }
                if (res.data.status == 200) this.getdata();
                this.$swal({
                  title:
                    Number(res.data.status) === 200
                      ? "修改成功！"
                      : "修改失敗！",
                  icon: Number(res.data.status) === 200 ? "success" : "error",
                });
              });
          } else if (res.isDenied) {
          }
        });
      }
    },
    //取消
    async cancel(data) {
      this.filterwallet = JSON.parse(this.filterwalletBackup);
      //顯示文字欄位，關閉修改欄位
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.id}`
        ).style.display = this.target.includes(item) ? "block" : "none";
      });
    },
    search() {
      this.filterwallet = this.wallet;
      if (this.filtername != "") {
        this.filterwallet = this.filterwallet.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      if (this.filterprovider != "") {
        this.filterwallet = this.filterwallet.filter(
          (item) => item.player_with_provider.id == this.filterprovider
        );
      }
      if (this.filteragent !== "") {
        this.filterwallet = this.filterwallet.filter(
          (item) => item.player_with_agent.id == this.filteragent
        );
      }
      if (this.filtercurrency !== "") {
        this.filterwallet = this.filterwallet.filter(
          (item) => item.player_with_currency.cid == this.filtercurrency
        );
      }
      this.filterwalletBackup = JSON.stringify(this.filterwallet);
    },
  },
};
</script>