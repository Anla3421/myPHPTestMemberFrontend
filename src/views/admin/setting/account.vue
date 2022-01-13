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
          cols="auto"
          :prepend="$t('cont.status')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filterstatus" :options="this.statuslist" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          cols="auto"
          :prepend="$t('cont.gender')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select v-model="filtergender" :options="this.searchgender" />
        </b-input-group>
        <b-input-group
          class="col-sm"
          cols="auto"
          :prepend="$t('cont.position')"
          style="margin: 15px auto; min-width: 240px"
          size="sm"
        >
          <b-form-select
            v-model="filterposition"
            :options="this.searchposition"
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
          <b-modal id="create" centered :title="$t('cont.createaccount')">
            <b-form v-for="(item, index) in createinput" :key="index">
              <b-form-group :label="`${item.text}`" size="sm">
                <b-form-input v-model="createdata[item.key]" />
              </b-form-group>
            </b-form>
            <b-form-group :label="$t('cont.gender')" size="sm">
              <b-form-select v-model="createdata.gender" :options="gender" />
            </b-form-group>
            <b-form-group :label="$t('cont.position')" size="sm">
              <b-form-select
                v-model="createdata.position"
                :options="position"
              />
            </b-form-group>
            <b-form-group :label="$t('cont.level')" size="sm">
              <b-form-select v-model="createdata.level" :options="level" />
            </b-form-group>
            <b-form-group :label="$t('cont.status')" size="sm">
              <b-form-select v-model="createdata.status" :options="status" />
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
        <template #cell(gender)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.gender"
              style="display: none"
              :options="gender"
              :id="`inputgender_${data.item.id}`"
            />
            <b-form-text style="display: block" :id="`gender_${data.item.id}`">
              {{
                data.item.gender == "male" ? $t("cont.male") : $t("cont.female")
              }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(position)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.position"
              style="display: none"
              :options="position"
              :id="`inputposition_${data.item.id}`"
            />
            <b-form-text
              style="display: block"
              :id="`position_${data.item.id}`"
            >
              {{
                data.item.position == "administrator"
                  ? $t("cont.admin")
                  : $t("cont.user")
              }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(cellphone)="data">
          <b-input-group size="sm">
            <b-form-input
              style="display: none"
              type="text"
              v-model="data.item.cellphone"
              :id="`inputcellphone_${data.item.id}`"
            />
            <b-form-text
              style="display: block"
              :id="`cellphone_${data.item.id}`"
            >
              {{ data.item.cellphone }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(level)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.level"
              style="display: none"
              :options="level"
              :id="`inputlevel_${data.item.id}`"
            />
            <b-form-text style="display: block" :id="`level_${data.item.id}`">
              {{ data.item.level }}
            </b-form-text>
          </b-input-group>
        </template>
        <template #cell(status)="data">
          <b-input-group size="sm">
            <b-form-select
              v-model="data.item.status"
              style="display: none"
              :options="status"
              :id="`inputstatus_${data.item.id}`"
            />
            <b-form-text
              :style="`display: block;
                color:${
                  data.item.status == 'activated' ? '#7ac29a' : '#eb7142'
                }!important`"
              :id="`status_${data.item.id}`"
            >
              {{
                data.item.status == "activated" ? $t("cont.on") : $t("cont.off")
              }}
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
      //搜尋狀態
      filterstatus: "",
      //搜尋性別
      filtergender: "",
      //搜尋身分
      filterposition: "",
      //性別清單
      gender: [
        { text: this.$t("cont.male"), value: "male" },
        { text: this.$t("cont.female"), value: "female" },
      ],
      //身分清單
      position: [
        { text: this.$t("cont.admin"), value: "administrator" },
        { text: this.$t("cont.user"), value: "user" },
      ],
      //權限清單
      level: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
      ],
      //狀態清單
      status: [
        { text: this.$t("cont.on"), value: "activated" },
        { text: this.$t("cont.off"), value: "deactivated" },
      ],
      //搜尋性別清單
      searchgender: [
        { text: this.$t("cont.male"), value: "male" },
        { text: this.$t("cont.female"), value: "female" },
        { text: this.$t("cont.all"), value: "" },
      ],
      //搜尋身分清單
      searchposition: [
        { text: this.$t("cont.admin"), value: "administrator" },
        { text: this.$t("cont.user"), value: "user" },
        { text: this.$t("cont.all"), value: "" },
      ],
      //總資料
      player: [],
      //搜尋後資料
      filterplayer: [],
      //搜尋後資料備份
      filterplayerbackup: [],
      //新增資料
      createdata: {
        name: null,
        gender: "male",
        position: "user",
        cellphone: null,
        level: "1",
        status: "activated",
      },
      //新增欄位
      createinput: [
        { key: "name", text: this.$t("cont.name") },
        { key: "password", text: this.$t("cont.password") },
        { key: "cellphone", text: this.$t("cont.phone") },
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
          key: "gender",
          label: this.$t("cont.gender"),
          thStyle: "min-width:100px",
        },
        {
          key: "position",
          label: this.$t("cont.position"),
          thStyle: "min-width:100px",
        },
        {
          key: "cellphone",
          label: this.$t("cont.phone"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "level",
          label: this.$t("cont.level"),
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("cont.status"),
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
      target_array: [
        "inputgender",
        "inputposition",
        "inputcellphone",
        "inputlevel",
        "inputstatus",
        "gender",
        "position",
        "cellphone",
        "level",
        "status",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: ["gender", "position", "cellphone", "level", "status", "updbtn"],
      //確認資料欄位
      pregdata: [
        {
          key: "name",
          check: "reCn",
        },
        {
          key: "password",
          check: "reEn",
        },
        {
          key: "cellphone",
          check: "reMt",
        },
      ],
    };
  },
  computed: {
    rows() {
      return this.filterplayer.length;
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
    filterstatus: function () {
      this.search();
    },
    filtergender: function () {
      this.search();
    },
    filterposition: function () {
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
        .post(`${this.api}/account`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          this.isBusy = false;
          this.player = res.data.result.user;
          this.filterplayer = res.data.result.user;
          this.filterplayerbackup = JSON.stringify(res.data.result.user);
          this.totalpage = Math.ceil(this.filterplayer.length / this.perPage);
        });
      if (this.player.length == 0) {
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
        name: data.item.name,
        gender: data.item.gender,
        position: data.item.position,
        cellphone: data.item.cellphone,
        level: data.item.level,
        status: data.item.status,
      };
      var createPass = this.preg(upDatedata, this.pregdata);
      if (createPass) {
        this.updateData("account", upDatedata, data.item.id);
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
        this.createDate("account", this.createdata);
      }
    },
    async search() {
      this.filterplayer = this.player;
      if (this.filtername != "") {
        this.filterplayer = this.filterplayer.filter((item) =>
          item.name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      if (this.filterstatus != "") {
        var status;
        if (this.filterstatus == 0) {
          status = "deactivated";
        } else if (this.filterstatus == 1) {
          status = "activated";
        }
        this.filterplayer = this.filterplayer.filter(
          (item) => item.status == status
        );
      }
      if (this.filtergender != "") {
        this.filterplayer = this.filterplayer.filter(
          (item) => item.gender == this.filtergender
        );
      }
      if (this.filterposition != "") {
        this.filterplayer = this.filterplayer.filter(
          (item) => item.position == this.filterposition
        );
      }
      this.filterplayerbackup = JSON.stringify(this.filterplayer);
    },
  },
};
</script>
