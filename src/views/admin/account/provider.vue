<template>
  <div  >
    <loading :active.sync="loading" />
    <b-card
      bg-variant="light "
      class="contcard shadows"
    >
      <div class="row">
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.name')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-input
            v-model="filtername"
            :placeholder="$t('cont.searchname')"
          />
        </b-input-group>
        <b-input-group
          class="col-sm"
          cols="auto"
          :prepend="$t('cont.status')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filterenabled" :options="this.statuslist" />
        </b-input-group>
        <b-input-group class="col-sm" style="margin: 15px auto">
          <b-button
            v-b-modal.create
            size="sm"
            variant="primary"
            style="min-width: 60px; max-width: 60px; margin-left: auto"
          >
            {{ $t("cont.Create") }}
          </b-button>
          <b-modal id="create" centered :title="$t('cont.createprovider')">
            <b-form v-for="(item, index) in createinput" :key="index">
              <b-form-group :label="`${item.text}`" size="sm">
                <b-form-input v-model="createdata[item.key]" />
              </b-form-group>
            </b-form>
            <b-form-group :label="$t('cont.status')" size="sm">
              <b-form-select :options="enabled" v-model="createdata.enabled" />
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button variant="success" @click="create()" size="sm">{{
                $t("cont.Create")
              }}</b-button>
              <b-button variant="danger" @click="cancel()" size="sm">{{
                $t("cont.cancel")
              }}</b-button>
            </template>
          </b-modal>
        </b-input-group>
      </div>
      <b-table
        style="font-size: 10px; margin: auto"
        :items="filterprovider"
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
        <template #cell(name)="data">
          <b-input-group size="sm">
            <b-form-input
              style="display: none"
              type="text"
              v-model="data.item.name"
              :id="`inputname_${data.item.id}`"
            />
            <b-form-text style="display: block" :id="`name_${data.item.id}`">
              {{ data.item.name }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(game_url)="data">
          <b-input-group size="sm">
            <b-form-input
              style="display: none"
              type="text"
              v-model="data.item.game_url"
              :id="`inputgame_url_${data.item.id}`"
            />
            <b-form-text
              style="display: block"
              :id="`game_url_${data.item.id}`"
            >
              {{ data.item.game_url }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(username)="data">
          <b-input-group size="sm">
            <b-form-input
              style="display: none"
              type="text"
              v-model="data.item.username"
              :id="`inputusername_${data.item.id}`"
            />
            <b-form-text
              style="display: block"
              :id="`username_${data.item.id}`"
            >
              {{ data.item.username }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(enabled)="data">
          <b-input-group size="sm">
            <b-form-select
              style="display: none"
              v-model="data.item.enabled"
              :options="enabled"
              :id="`inputenabled_${data.item.id}`"
            />
            <b-form-text
              :style="`display: block;color:${
                data.item.enabled == 1 ? '#7ac29a' : '#eb7142'
              }!important`"
              :id="`enabled_${data.item.id}`"
            >
              {{ data.item.enabled == 1 ? $t("cont.on") : $t("cont.off") }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(updata)="data">
          <b-button
            size="sm"
            style="width: 65px; display: none"
            variant="success "
            :id="`subbtn_${data.item.id}`"
            @click="submit(data)"
            >{{ $t("cont.submit") }}</b-button
          >
          <b-button
            size="sm"
            style="width: 65px; display: none; margin-top: 5px"
            variant="danger "
            :id="`cancel_${data.item.id}`"
            @click="cancel(data)"
          >
            {{ $t("cont.cancel") }}
          </b-button>
          <b-button
            style="width: 65px; display: block"
            :id="`updbtn_${data.item.id}`"
            variant="info"
            size="sm"
            :disabled="chmod"
            @click="update(data.item.id)"
          >
            {{ $t("cont.Update") }}
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
      //搜尋狀態
      filterenabled: "",
      //新增資料
      createdata: {
        name: "",
        game_url: "",
        username: "",
        private_key: "",
        enabled: 1,
      },
      //狀態清單
      enabled: [
        { text: this.$t("cont.off"), value: 0 },
        { text: this.$t("cont.on"), value: 1 },
      ],
      //總資料
      provider: [],
      //搜尋後總資料
      filterprovider: [],
      //搜尋後總資料備份
      filterproviderbackup: [],
      //新增欄位
      createinput: [
        { key: "name", text: this.$t("cont.name") },
        { key: "game_url", text: this.$t("cont.gameurl") },
        { key: "username", text: this.$t("cont.parameter") },
        { key: "private_key", text: "private_key" },
      ],
      //欄位
      fields: [
        {
          key: "name",
          label: this.$t("cont.name"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "game_url",
          label: this.$t("cont.gameurl"),
          thStyle: "min-width:100px",
        },
        {
          key: "username",
          label: this.$t("cont.parameter"),
          thStyle: "min-width:100px",
        },
        {
          key: "enabled",
          label: this.$t("cont.status"),
          thStyle: "min-width:80px",
          sortable: true,
        },
        {
          key: "created_at",
          label: this.$t("cont.Create"),
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "updated_at",
          label: this.$t("cont.Update"),
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "updata",
          label: this.$t("cont.Update"),
        },
      ],
      //欄位id
      target_array: [
        "inputname",
        "inputgame_url",
        "inputusername",
        "inputenabled",
        "name",
        "game_url",
        "username",
        "enabled",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: ["name", "game_url", "username", "enabled", "updbtn"],
      //確認資料欄位
      pregdata: [
        {
          key: "game_url",
          check: "reHs",
        },
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "username",
          check: "reCn",
        },
        {
          key: "private_key",
          check: "reEn",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterprovider.length;
    },
    statuslist(){
      return this.$store.state.searchstatus;
    },
    per(){
      return this.$store.state.per;
    }
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterprovider.length / this.perPage);
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
    filterenabled: function () {
      this.search();
    },
  },
  created: async function () {
    this.color = await this.randomColor();
    this.isBusy = true;
    this.createdata.enabled = 1;
    await this.getdata();

    if (sessionStorage.getItem("chmod") == "user") {
      this.chmod = true;
    } else {
      this.chmod = false;
    }
  },
  methods: {
    //取得資料
    async getdata() {
      await axios
        .post(`${this.api}/provider`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          this.isBusy = false;
          this.provider = res.data.result.provider;
          this.filterprovider = res.data.result.provider;
          this.filterproviderbackup = JSON.stringify(res.data.result.provider);
          this.totalpage = Math.ceil(this.filterprovider.length / this.perPage);
        });
      if (this.provider.length == 0) {
        this.swal("get");
      }
    },
    //修改
    update(id) {
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${id}`
        ).style.display = this.target.includes(item) ? "none" : "block";
      });
    },
    //修改送出
    submit(data) {
      const upDatedata = {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
        update_id: data.item.id,
        name: String(data.item.name),
        game_url: String(data.item.game_url),
        username: String(data.item.username),
        enabled: data.item.enabled,
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData("provider", upDatedata, data.item.id);
      }
    },
    //修改取消
    async cancel(data) {
      this.filterprovider = JSON.parse(this.filterproviderbackup);
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.id}`
        ).style.display = this.target.includes(item) ? "block" : "none";
      });
    },
    //新增
    create() {
      var createPass = this.preg(this.createdata, this.pregdata);
      if (createPass) {
        this.createDate("provider", this.createdata);
      }
    },
    async search() {
      this.filterprovider = this.provider;
      if (this.filtername != "") {
        this.filterprovider = this.filterprovider.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      if (this.filterenabled != "") {
        this.filterprovider = this.filterprovider.filter(
          (item) => item.enabled == this.filterenabled
        );
      }
      this.filterproviderbackup = JSON.stringify(this.filterprovider);
    },
  },
};
</script>