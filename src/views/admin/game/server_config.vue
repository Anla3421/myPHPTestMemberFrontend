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
          style="margin: 15px auto; margin-left: 0px; min-width: 240px; max-width: 350px"
          size="sm"
        >
          <b-form-input
            v-model="filtername"
            id="filter-input"
            type="search"
            :placeholder="$t('cont.searchname')"
          />
        </b-input-group>
      </div>
      <b-table
        style="font-size: 10px"
        :items="filterserver"
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
              type="text"
              v-model="data.item.name"
              :id="`inputname_${data.item.gid}`"
              style="display: none"
            />
            <b-form-text style="display: block" :id="`name_${data.item.gid}`">
              {{ data.item.name }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(profile)="data">
          <b-input-group size="sm">
            <b-form-input
              type="text"
              v-model="data.item.profile"
              :id="`inputprofile_${data.item.gid}`"
              style="display: none"
            />
            <b-form-text
              style="display: block"
              :id="`profile_${data.item.gid}`"
            >
              {{ data.item.profile }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(value)="data">
          <b-input-group size="sm">
            <b-form-input
              type="text"
              v-model="data.item.value"
              :id="`inputvalue_${data.item.gid}`"
              style="display: none"
            />
            <b-form-text style="display: block" :id="`value_${data.item.gid}`">
              {{ data.item.value }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(updata)="data">
          <b-button
            size="sm"
            style="width: 65px; display: none"
            variant="success "
            :id="`subbtn_${data.item.gid}`"
            @click="submit(data)"
          >
            {{ $t("cont.submit") }}
          </b-button>
          <b-button
            size="sm"
            style="width: 65px; display: none; margin-top: 5px"
            variant="danger "
            :id="`cancel_${data.item.gid}`"
            @click="cancel(data)"
          >
            {{ $t("cont.cancel") }}
          </b-button>
          <b-button
            size="sm"
            style="width: 65px; display: block"
            variant="info"
            :id="`updbtn_${data.item.gid}`"
            :disabled="chmod"
            @click="update(data.item.gid)"
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
      //總資料
      server: [],
      //搜尋後總資料
      filterserver: [],
      //搜尋後總資料備份
      filterserverbackup: [],
      fields: [
        {
          key: "gid",
          label: this.$t("cont.gameid"),
          thStyle: "min-width:50px",
        },
        {
          key: "name",
          label: this.$t("cont.servername"),
          thStyle: "min-width:85px",
          sortable: true,
        },
        {
          key: "profile",
          label: this.$t("cont.profile"),
          thStyle: "min-width:85px",
        },
        {
          key: "value",
          label: this.$t("cont.servervalue"),
          thStyle: "min-width:90px",
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
        "inputprofile",
        "inputvalue",
        "name",
        "profile",
        "value",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: ["name", "profile", "value", "updbtn"],
      //確認資料欄位
      pregdata: [
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "profile",
          check: "reEn",
        },
        {
          key: "value",
          check: "reCn",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterserver.length;
    },
    per(){
      return this.$store.state.per;
    }
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filterserver.length / this.perPage);
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
    //取得資料
    async getdata() {
      await axios
        .post(`${this.api}/serverconfig`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.server = res.data.result.server_config;
          this.filterserver = res.data.result.server_config;
          this.filterserverbackup = JSON.stringify(
            res.data.result.server_config
          );
          this.totalpage = Math.ceil(this.filterserver.length / this.perPage);
        });
      if (this.server.length == 0) {
        this.swal("get");
      }
    },
    //修改
    update(gid) {
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${gid}`
        ).style.display = this.target.includes(item) ? "none" : "block";
      });
    },
    //修改送出
    submit(data) {
      const upDatedata = {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
        gid: data.item.gid,
        name: data.item.name,
        profile: data.item.profile,
        value: data.item.value,
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData("serverconfig", upDatedata, data.item.gid);
      }
    },
    //取消修改
    async cancel(data) {
      this.filterserver = JSON.parse(this.filterserverbackup);
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.gid}`
        ).style.display = this.target.includes(item) ? "block" : "none";
      });
    },
    //搜尋
    async search() {
      this.filterserver = this.server;
      if (this.filtername != "") {
        this.filterserver = this.filterserver.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      this.filterserverbackup = JSON.stringify(this.filterserver);
    },
  },
};
</script>