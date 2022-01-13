<template>
  <div>
    <loading :active.sync="loading" />
    <b-card bg-variant="light" class="contcard shadows">
      <div class="row">
        <b-input-group
          class="col-sm"
          :prepend="$t('cont.name')"
          style="margin: 15px auto; min-width: 240px; max-width: 350px"
          size="sm"
        >
          <b-form-input
            v-model="filtername"
            :placeholder="$t('cont.searchname')"
          />
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
          <b-modal id="create" centered :title="$t('cont.createmember')">
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
        <template #cell(provider)="data">
          <b-input-group size="sm">
            <b-form-text>
              {{ data.item.player_with_provider.name }}
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
          >
            {{ $t("cont.submit") }}
          </b-button>
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
            size="sm"
            style="width: 65px; display: block"
            variant="info"
            :id="`updbtn_${data.item.id}`"
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

<style scoped>
</style>

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
      //搜尋帳號
      filterid: "",
      //修改新增供應商清單
      provider: [],
      //總資料
      player: [],
      //搜尋後總資料
      filterplayer: [],
      //搜尋後總資料備份
      filterplayerbackup: [],
      //新增資料
      createdata: {
        name: null,
        provider_id: "1",
        uniq_id: null,
      },
      //新增欄位
      createinput: [
        { key: "name", text: this.$t("cont.name") },
        { key: "uniq_id", text: this.$t("cont.account") },
      ],
      //欄位
      fields: [
        {
          key: "name",
          label: this.$t("cont.name"),
          thStyle: "min-width:120px",
          sortable: true,
        },
        {
          key: "uniq_id",
          label: this.$t("cont.account"),
          thStyle: "min-width:120px",
        },
        {
          key: "provider",
          label: this.$t("cont.provider"),
          thStyle: "min-width:150px",
        },
        {
          key: "last_at",
          thStyle: "min-width:106px",
          label: this.$t("cont.lastlogin"),
          sortable: true,
        },
        {
          key: "updata",
          label: this.$t("cont.Update"),
        },
      ],
      //欄位id
      target_array: ["inputname", "name", "subbtn", "updbtn", "cancel"],
      //文字欄位id
      target: ["name", "updbtn"],
      //確認資料欄位
      pregdata: [
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "uniq_id",
          check: "reEn",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.player.length;
    },
    per() {
      return this.$store.state.per;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.player.length / this.perPage);
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
    filterid: function () {
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
        .post(`${this.api}/player`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.player = res.data.result.player;
          this.filterplayer = res.data.result.player;
          this.filterplayerbackup = JSON.stringify(res.data.result.player);
          this.provider = res.data.result.provider.map(function (item, index) {
            return { text: item.name, value: item.id };
          });
          this.totalpage = Math.ceil(this.filterplayer.length / this.perPage);
        });
      if (this.player.length == 0) {
        this.swal("get");
      }
    },
    //修改
    update(id) {
      this.target_array.forEach((item, index) => {
        if (item == "updbtn" || item == "name") {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    //修改送出
    submit(data) {
      const upDatedata = {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
        update_id: data.item.id,
        name: data.item.name,
        provider_id: data.item.provider_id,
        uniq_id: data.item.uniq_id,
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData("player", upDatedata, data.item.id);
      }
    },
    //修改取消
    async cancel(data) {
      this.filterplayer = JSON.parse(this.filterplayerbackup);
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
        this.createDate("player", this.createdata);
      }
    },
    async search() {
      this.filterplayer = this.player;
      if (this.filtername != "") {
        this.filterplayer = this.filterplayer.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      this.filterplayerbackup = JSON.stringify(this.filterplayer);
    },
  },
};
</script>