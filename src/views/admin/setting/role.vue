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
            id="filter-input"
            type="search"
            :placeholder="$t('cont.searchname')"
          />
        </b-input-group>
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.game')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filtergame" :options="searchgame" />
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
          <b-modal id="create" centered :title="$t('cont.createrole')">
            <b-form v-for="(item, index) in createinput" :key="index">
              <b-form-group :label="`${item.text}`" size="sm">
                <b-form-input v-model="createdata[item.key]" />
              </b-form-group>
            </b-form>
            <b-form-group :label="$t('cont.game')" size="sm">
              <b-form-select v-model="createdata.gid" :options="game" />
            </b-form-group>
            <b-form-group :label="$t('cont.currency')" size="sm">
              <b-form-select v-model="createdata.profile" :options="profile" />
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
        :items="filterplayer"
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
        <template #cell(game)="data">
          <b-form-text>
            {{ data.item.playersave_with_game.game_with_gameinfo.name }}
          </b-form-text>
        </template>
        <template #cell(profile)="data">
          <b-form-text>
            {{ data.item.playersave_with_currency.game_currency }}
          </b-form-text>
        </template>
        <template #cell(value)="data">
          <b-input-group size="sm">
            <b-form-input
              style="display: none"
              type="text"
              v-model="data.item.value"
              :id="`inputvalue_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`"
            />
            <b-form-text
              style="display: block"
              :id="`value_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`"
            >
              {{ data.item.value }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(updata)="data">
          <b-button
            size="sm"
            style="width: 65px; display: none"
            variant="success "
            :id="`subbtn_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`"
            @click="submit(data)"
            >{{ $t("cont.submit") }}</b-button
          >
          <b-button
            size="sm"
            style="width: 65px; display: none; margin-top: 5px"
            variant="danger "
            :id="`cancel_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`"
            @click="cancel(data)"
          >
            {{ $t("cont.cancel") }}
          </b-button>
          <b-button
            size="sm"
            style="width: 65px; display: block"
            variant="info"
            :id="`updbtn_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`"
            :disabled="chmod"
            @click="update(data)"
          >
            {{ $t("cont.Update") }}
          </b-button>
        </template>
      </b-table>
      <div class="row justify-content-between">
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
      //搜尋遊戲
      filtergame: "",
      //搜尋遊戲清單
      searchgame: [],
      //遊戲清單
      game: [],
      //貨幣清單
      profile: [],
      //總資料
      player: [],
      //搜尋後資料
      filterplayer: [],
      //搜尋後資料備份
      filterplayerbackup: [],
      //新增資料
      createdata: {
        gid: 1,
        name: null,
        profile: 1,
        token: null,
        value: null,
      },
      //新增欄位
      createinput: [
        { key: "name", text: this.$t("cont.archive") },
        { key: "token", text: this.$t("cont.playertoken") },
        { key: "value", text: this.$t("cont.value") },
      ],
      //欄位
      fields: [
        {
          key: "game",
          label: this.$t("cont.game"),
          thStyle: "min-width:61px",
        },
        {
          key: "name",
          label: this.$t("cont.archive"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "profile",
          label: this.$t("cont.currency"),
          thStyle: "min-width:100px",
        },
        {
          key: "token",
          label: this.$t("cont.playertoken"),
          thStyle: "min-width:100px",
        },
        {
          key: "value",
          label: this.$t("cont.value"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "created_at",
          label: this.$t("cont.Create"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "updated_at",
          label: this.$t("cont.Update"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "updata",
          label: this.$t("cont.Update"),
        },
      ],
      //欄位名稱
      target_array: ["inputvalue", "value", "subbtn", "updbtn", "cancel"],
      //文字欄位id
      target: ["value", "updbtn"],
      //確認資料欄位
      pregdata: [
        {
          key: "value",
          check: "reCn",
        },
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "token",
          check: "reEn",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterplayer.length;
    },
    per(){
      return this.$store.state.per;
    }
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterplayer.length / this.perPage);
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
    filtergame: function () {
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
      this.$root.$emit("bv::disable::tooltip");
    }
  },
  methods: {
    async getdata() {
      await axios
        .post(`${this.api}/playersave`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          this.isBusy = false;
          this.player = res.data.result.player_save;
          this.filterplayer = res.data.result.player_save;
          this.filterplayerbackup = JSON.stringify(res.data.result.player_save);
          this.totalpage = Math.ceil(this.filterplayer.length / this.perPage);
          this.searchgame = res.data.result.game.map((item) => {
            return { text: item.game_with_gameinfo.name, value: item.gid };
          });
          this.game = res.data.result.game.map((item) => {
            return { text: item.game_with_gameinfo.name, value: item.gid };
          });
          this.profile = res.data.result.currency.map((item) => {
            return { text: item.game_currency, value: item.cid };
          });
          this.searchgame.push({ text: this.$t("cont.all"), value: "" });
        });
      if (this.player.length == 0) {
        this.swal("get");
      }
    },
    //修改
    update(data) {
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`
        ).style.display = this.target.includes(item) ? "none" : "block";
      });
    },
    //修改送出
    submit(data) {
      const upDatedata = {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
        token: data.item.token,
        gid: data.item.gid,
        profile: data.item.profile,
        name: data.item.name,
        value: String(data.item.value),
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData(
          "playersave",
          upDatedata,
          `${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`
        );
      }
    },
    //修改取消
    async cancel(data) {
      this.filterplayer = JSON.parse(this.filterplayerbackup);
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.gid}${data.item.token}${data.item.name}${data.item.profile}`
        ).style.display = this.target.includes(item) ? "block" : "none";
      });
    },
    //新增
    create() {
      var createPass = this.preg(this.createdata, this.pregdata);
      if (createPass) {
        this.createDate("playersave", this.createdata);
      }
    },
    async search() {
      this.filterplayer = this.player;
      if (this.filtername != "") {
        this.filterplayer = this.filterplayer.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      if (this.filtergame != "") {
        this.filterplayer = this.filterplayer.filter(
          (item) => item.gid == this.filtergame
        );
      }
      this.filterplayerbackup = JSON.stringify(this.filterplayer);
    },
  },
};
</script>
