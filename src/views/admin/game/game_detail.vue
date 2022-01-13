<template>
  <div>
    <loading :active.sync="loading" />
    <b-card bg-variant="light " class="contcard shadows">
      <div class="row">
        <b-input-group
          class="col-sm"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <template #prepend>
            <b-dropdown size="sm" :text="langname.text">
              <b-dropdown-item
                v-for="(item, index) in name"
                :key="index"
                @click="namelang(item)"
              >
                {{ item.text }}
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <b-form-input
            v-model="filtername"
            :placeholder="$t('cont.searchname')"
          />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.provider')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filterprovider" :options="searchprovider" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.status')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filterstatus" :options="searchstatus" />
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
          <b-modal id="create" centered :title="$t('cont.creategame')">
            <b-form v-for="(item, index) in createinput" :key="index">
              <b-form-group :label="`${item.text}`" size="sm">
                <b-form-input v-model="createdata[item.key]" />
              </b-form-group>
            </b-form>
            <b-form-group :label="$t('cont.provider')" size="sm">
              <b-form-select
                v-model="createdata.provider_id"
                :options="provider"
              />
            </b-form-group>
            <b-form-group :label="$t('cont.status')" size="sm">
              <b-form-select :options="status" v-model="createdata.status" />
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
        style="font-size: 10px"
        :items="filtergame"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        :busy="this.isBusy"
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
              type="text"
              v-model="data.item.game_with_gameinfo.name"
              :id="`inputname_${data.item.id}`"
              style="display: none"
            />
            <b-form-text style="display: block" :id="`name_${data.item.id}`">
              {{ data.item.game_with_gameinfo.name }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(provider)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.provider_id"
              :id="`inputprovider_${data.item.id}`"
              :options="provider"
              style="display: none"
            />
            <b-form-text
              style="display: block"
              :id="`provider_${data.item.id}`"
            >
              {{ data.item.game_with_provider.name }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(status)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.status"
              :options="status"
              :id="`inputstatus_${data.item.id}`"
              style="display: none"
            />
            <b-form-text
              :style="`display: block;color:${
                data.item.status == 1 ? '#7ac29a' : '#eb7142'
              }!important`"
              :id="`status_${data.item.id}`"
            >
              {{ data.item.status == 1 ? $t("cont.on") : $t("cont.off2") }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(more)="row">
          <b-button
            style="width: 75px"
            size="sm"
            variant="info"
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
                  <b-form-input
                    type="text"
                    v-model="row.item.game_with_gameinfo[item.key]"
                    :id="`input${item.key}_${row.item.id}`"
                    style="display: none"
                  />
                  <b-form-text
                    style="display: block"
                    :id="`${item.key}_${row.item.id}`"
                  >
                    {{ row.item.game_with_gameinfo[item.key] }}
                  </b-form-text>
                </b-input-group>
              </b-col>
            </b-row>
            <b-button
              size="sm"
              style="width: 65px; display: block"
              variant="info"
              :id="`updbtn_${row.item.id}`"
              :disabled="chmod"
              @click="update(row.item.id)"
            >
              {{ $t("cont.Update") }}
            </b-button>
            <b-button
              size="sm"
              style="width: 65px; display: none"
              variant="success"
              :id="`subbtn_${row.item.id}`"
              @click="submit(row)"
            >
              {{ $t("cont.submit") }}
            </b-button>
            <b-button
              size="sm"
              style="width: 65px; display: none; margin-top: 5px"
              variant="danger"
              :id="`cancel_${row.item.id}`"
              @click="cancel(row)"
            >
              {{ $t("cont.cancel") }}
            </b-button>
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
      loading: false,
      chmod: true,
      color: "",
      perPage: 10,
      currentPage: 1,
      totalpage: "",
      //名稱語言
      langname: { text: this.$t("game.zh"), value: "zh" },
      //搜尋名稱
      filtername: "",
      //搜尋供應商
      filterprovider: "",
      //搜尋狀態
      filterstatus: "",
      //供應商清單
      provider: [],
      //搜尋供應商清單
      searchprovider: [],
      //搜尋狀態清單
      searchstatus: [
        { text: this.$t("cont.off2"), value: 0 },
        { text: this.$t("cont.on"), value: 1 },
        { text: this.$t("cont.all"), value: "" },
      ],
      //狀態清單
      status: [
        { text: this.$t("cont.off2"), value: 0 },
        { text: this.$t("cont.on"), value: 1 },
      ],
      //搜尋名稱清單
      name: [
        { text: this.$t("game.zh"), value: "zh" },
        { text: this.$t("game.cn"), value: "cn" },
        { text: this.$t("game.en"), value: "en" },
        { text: this.$t("game.jp"), value: "jp" },
      ],
      //總資料
      game: [],
      //搜尋後總資料
      filtergame: [],
      //搜尋後總資料備份
      filtergamebackup: [],
      //新增資料
      createdata: {
        gid: null,
        name: null,
        name_cn: null,
        name_en: null,
        name_jp: null,
        provider_id: 1,
        status: 1,
        server_host: null,
        server_path: null,
        server_port: null,
        server_demo_port: null,
        client_dir_name: null,
      },
      //新增欄位
      createinput: [
        { key: "gid", text: this.$t("cont.gameid") },
        { key: "name", text: this.$t("cont.name_zh") },
        { key: "name_cn", text: this.$t("cont.name_cn") },
        { key: "name_en", text: this.$t("cont.name_en") },
        { key: "name_jp", text: this.$t("cont.name_jp") },
        { key: "server_host", text: this.$t("cont.server_host") },
        { key: "server_path", text: this.$t("cont.server_path") },
        { key: "server_port", text: this.$t("cont.server_port") },
        { key: "server_demo_port", text: this.$t("cont.server_demo_port") },
        { key: "client_dir_name", text: this.$t("cont.client_dir_name") },
      ],
      //欄位
      fields: [
        {
          key: "name",
          label: this.$t("cont.name"),
          thStyle: "min-width:130px",
        },
        {
          key: "provider",
          label: this.$t("cont.provider"),
          thStyle: "min-width:130px",
        },
        {
          key: "status",
          label: this.$t("cont.status"),
          thStyle: "min-width:85px",
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
          key: "more",
          label: this.$t("cont.more"),
        },
      ],
      //欄位id
      target_array: [
        "name",
        "name_cn",
        "name_en",
        "name_jp",
        "server_host",
        "server_path",
        "server_port",
        "server_demo_port",
        "client_dir_name",
        "provider",
        "status",
        "inputname",
        "inputname_cn",
        "inputname_en",
        "inputname_jp",
        "inputserver_host",
        "inputserver_path",
        "inputserver_port",
        "inputserver_demo_port",
        "inputclient_dir_name",
        "inputprovider",
        "inputstatus",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: [
        "name",
        "name_cn",
        "name_en",
        "name_jp",
        "server_host",
        "server_path",
        "server_port",
        "server_demo_port",
        "client_dir_name",
        "provider",
        "updbtn",
        "status",
      ],
      //顯示更多欄位
      more: [
        { key: "name_cn", text: this.$t("cont.name_cn") },
        { key: "name_en", text: this.$t("cont.name_en") },
        { key: "name_jp", text: this.$t("cont.name_jp") },
        { key: "server_host", text: this.$t("cont.server_host") },
        { key: "server_path", text: this.$t("cont.server_path") },
        { key: "server_port", text: this.$t("cont.server_port") },
        { key: "server_demo_port", text: this.$t("cont.server_demo_port") },
        { key: "client_dir_name", text: this.$t("cont.client_dir_name") },
      ],
      //確認資料欄位
      pregdata: [
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "name_cn",
          check: "reCn",
        },
        {
          key: "name_en",
          check: "reEn",
        },
        {
          key: "name_jp",
          check: "reJp",
        },
        {
          key: "server_host",
          check: "reHs",
        },
        {
          key: "server_path",
          check: "reHs",
        },
        {
          key: "server_port",
          check: "reMt",
        },
        {
          key: "server_demo_port",
          check: "reMt",
        },
        {
          key: "client_dir_name",
          check: "reHs",
        },
        {
          key: "gid",
          check: "reMt",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filtergame.length;
    },
    per() {
      return this.$store.state.per;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filtergame.length / this.perPage);
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
    filterstatus: function () {
      this.search();
    },
    langname: {
      handler(nVal, oVal) {
        this.search();
      },
      deep: true,
    },
  },
  created: async function () {
    this.color = await this.randomColor();
    this.isBusy = true;
    if (localStorage.getItem("language") != null) {
      var lang = localStorage.getItem("language");
      this.langname = { text: this.$t(`game.${lang}`), value: lang };
    }
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
        .post(`${this.api}/gamenew`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.game = res.data.result.gamenew;
          this.filtergame = res.data.result.gamenew;
          this.filtergamebackup = JSON.stringify(res.data.result.gamenew);
          this.provider = res.data.result.provider.map(function (item, index) {
            return { text: item.name, value: item.id };
          });
          this.searchprovider = res.data.result.provider.map(function (item) {
            return { text: item.name, value: item.id };
          });
          this.searchprovider.push({ text: this.$t("cont.all"), value: "" });
          this.totalpage = Math.ceil(this.filtergame.length / this.perPage);
        });
      if (this.game.length == 0) {
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
        gid: data.item.gid,
        info_id: data.item.info_id,
        provider_id: data.item.provider_id,
        update_id: data.item.id,
        status: data.item.status,
        name: data.item.game_with_gameinfo.name,
        name_cn: data.item.game_with_gameinfo.name_cn,
        name_en: data.item.game_with_gameinfo.name_en,
        name_jp: data.item.game_with_gameinfo.name_jp,
        server_host: data.item.game_with_gameinfo.server_host,
        server_path: data.item.game_with_gameinfo.server_path,
        server_port: data.item.game_with_gameinfo.server_port,
        server_demo_port: data.item.game_with_gameinfo.server_demo_port,
        client_dir_name: data.item.game_with_gameinfo.client_dir_name,
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData("gamenew", upDatedata, data.item.id);
      }
    },
    //修改取消
    cancel(data) {
      this.filtergame = JSON.parse(this.filtergamebackup);
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
        this.createDate("gamenew", this.createdata);
      }
    },
    //搜尋
    async search() {
      this.filtergame = this.game;
      if (this.filtername != "") {
        this.filtergame = this.filtergame.filter((item) =>
          item.game_with_gameinfo[
            `name${
              this.langname.value == "zh" ? "" : `_${this.langname.value}`
            }`
          ]
            .toLowerCase()
            .includes(this.filtername.toLowerCase())
        );
      }
      if (this.filterprovider != "") {
        this.filtergame = this.filtergame.filter(
          (item) => item.game_with_provider.id == this.filterprovider
        );
      }
      if (this.filterstatus !== "") {
        this.filtergame = this.filtergame.filter(
          (item) => item.status == this.filterstatus
        );
      }
      this.filtergamebackup = JSON.stringify(this.filtergame);
    },
    namelang(item) {
      this.langname.text = item.text;
      this.langname.value = item.value;
    },
  },
};
</script>