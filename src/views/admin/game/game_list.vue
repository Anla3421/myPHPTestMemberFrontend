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
            prepend="遊戲名稱"
            style="margin: 15px auto; max-width: 240px"
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
            prepend="代理商"
            style="margin: 15px auto; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filterprovider" :options="searchprovider" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            :prepend="$t('cont.status')"
            style="margin: 15px auto; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filterstatus" :options="searchstatus" />
          </b-input-group>
          <b-input-group class="col-sm" style="margin: 15px auto" text-right>
            <b-button
              v-b-modal.create
              size="sm"
              variant="primary"
              style="min-width: 60px; max-width: 60px; margin-left: auto"
            >
              新增
            </b-button>
            <b-modal id="create" centered title="新增遊戲">
              <form style="font-size: 14px">
                <b-form-group label="遊戲ID" size="sm">
                  <b-form-input
                    v-model="createdata.gid"
                    placeholder="限輸入數字"
                  />
                </b-form-group>
                <b-form-group label="遊戲資訊ID" size="sm">
                  <b-form-input
                    v-model="createdata.info_id"
                    placeholder="限輸入數字"
                  />
                </b-form-group>
                <b-form-group label="供應商ID" size="sm">
                  <b-form-input
                    v-model="createdata.provider_id"
                    placeholder="限輸入數字"
                  />
                </b-form-group>
                <b-form-group :label="$t('cont.status')" size="sm">
                  <b-form-select
                    :options="status"
                    v-model="createdata.status"
                  />
                </b-form-group>
              </form>
              <template #modal-footer="{ cancel }">
                <b-button variant="success" @click="create()" size="sm"
                  >新增</b-button
                >
                <b-button variant="danger" @click="cancel()" size="sm"
                  >{{$t('cont.cancel')}}</b-button
                >
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
          :busy="isBusy"
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
          <template #cell(gid)="data">
            <b-input-group size="sm">
              <b-form-text style="display: block" :id="`gid_${data.item.id}`">
                {{ data.item.gid }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(game_with_gameinfo)="data">
            <b-input-group size="sm">
              <b-form-text style="display: block" :id="`gid_${data.item.id}`">
                {{ data.item.game_with_gameinfo.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(info_id)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.info_id"
                :id="`inputinfo_${data.item.id}`"
                placeholder="限輸入數字"
                style="display: none"
              />
              <b-form-text style="display: block" :id="`info_${data.item.id}`">
                {{ data.item.info_id }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(provider_name)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.provider_name"
                :id="`inputprovider_${data.item.id}`"
                placeholder="限輸入數字"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`provider_${data.item.id}`"
              >
                {{ data.item.provider_id }}
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
                  data.item.status == 1 ? '#00BB00' : '#FF0000'
                }!important`"
                :id="`status_${data.item.id}`"
              >
                {{ data.item.status == 1 ? "啟用" : "下架" }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(updata)="data" class="row">
            <b-button
              size="sm"
              style="width: 60px; display: none"
              variant="success "
              :id="`subbtn_${data.item.id}`"
              @click="submit(data)"
            >
              {{$t('cont.submit')}}
            </b-button>
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
              size="sm"
              style="width: 60px; display: block"
              :id="`updbtn_${data.item.id}`"
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
              <b-form-select v-model="perPage" :options="per" />
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
      isBusy: false,
      loading: false,
      color:'',
      perPage: 10,
      currentPage: 1,
      totalpage: "",
      chmod: true,
      filter: null,
      filtername: "",
      filterstatus: "",
      filterprovider: "",
      per: [
        { text: "10", value: 10 },
        { text: "3", value: 3 },
        { text: "2", value: 2 },
      ],
      searchstatus: [
        { text: "下架", value: 0 },
        { text: "啟用", value: 1 },
        { text: "全部", value: "" },
      ],
      searchprovider: [],
      createdata: [
        {
          gid: null,
          info_id: null,
          provider_id: null,
          status: null,
        },
      ],
      game: [],
      filtergame: [],
      filtergamebackup: [],
      status: [
        { text: "下架", value: 0 },
        { text: "啟用", value: 1 },
      ],
      fields: [
        {
          key: "game_with_gameinfo",
          label: "遊戲名稱",
          thStyle: "min-width:100px",
        },
        {
          key: "info_id",
          label: "遊戲資訊ID",
          thStyle: "min-width:90px",
        },
        {
          key: "provider_name",
          label: "供應商",
          thStyle: "min-width:90px",
          sortable: true,
        },
        {
          key: "status",
          label: "狀態",
          thStyle: "min-width:70px",
          sortable: true,
        },
        {
          key: "created_at",
          label: "建立時間",
          thStyle: "min-width:90px",
          sortable: true,
        },
        {
          key: "updated_at",
          label: "更新時間",
          thStyle: "min-width:90px",
          sortable: true,
        },
        {
          key: "updata",
          label: this.$t('cont.Update'),
        },
      ],
      target_array: [
        "inputinfo",
        "inputprovider",
        "inputstatus",
        "info",
        "provider",
        "status",
        "subbtn",
        "updbtn",
        "cancel",
      ],
    };
  },
  computed: {
    rows() {
      return this.filtergame.length;
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
    filterstatus: function () {
      this.search();
    },
    filterprovider: function () {
      this.search();
    },
  },
  created: async function () {
    this.color = await this.randomColor()
    this.createdata.gid = "";
    this.createdata.info_id = "";
    this.createdata.provider_id = "";
    this.createdata.status = 1;
    this.isBusy = await true;
    if (sessionStorage.getItem("status")) {
      await this.getdata();
    } else {
      this.loading = await false;
    }
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
        .post(`${this.api}/game`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.isBusy = false;
          this.game = res.data.result.game;
          this.filtergame = res.data.result.game;
          this.filtergamebackup = JSON.stringify(res.data.result.game)
          this.searchprovider = this.game.map(function (item, index) {
            return { text: item.provider_name, value: item.provider_id };
          });
          this.searchprovider.push({ text: "全部", value: "" });
          const set = new Set();
          this.searchprovider = this.searchprovider.filter((item) =>
            !set.has(item.text) ? set.add(item.text) : false
          );
          this.totalpage = Math.ceil(this.filtergame.length / this.perPage);
        });
      if (this.game.length == 0) {
        this.$swal({
          title: "很抱歉！",
          text: "查無相關資料",
          icon: "warning",
        });
      }
    },
    update(id) {
      this.target_array.forEach((item, index) => {
        if (
          item == "info" ||
          item == "provider" ||
          item == "status" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    submit(data) {
      var info_id = String(data.item.info_id);
      var provider_id = String(data.item.provider_id);
      var status = String(data.item.status);
      if (info_id == "" || provider_id == "" || status == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        info_id != info_id.replace(this.reMt, "") ||
        provider_id != provider_id.replace(this.reMt, "")
      ) {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可含特殊符號",
          icon: "error",
        });
      } else {
        var api = this.api;
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
              .post(`${api}/game/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                update_id: data.item.id,
                gid: data.item.gid,
                info_id: data.item.info_id,
                provider_id: data.item.provider_id,
                status: data.item.status,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "info" ||
                      item == "provider" ||
                      item == "status" ||
                      item == "updbtn"
                    ) {
                      document.getElementById(
                        `${item}_${data.item.id}`
                      ).style.display = "block";
                    } else {
                      document.getElementById(
                        `${item}_${data.item.id}`
                      ).style.display = "none";
                    }
                  });
                  this.$swal({
                    title: "更新成功",
                    icon: "success",
                    timer: 3000,
                    confirmButtonText: "確定",
                  });
                  this.getdata();
                } else {
                  this.$swal({
                    title: "更新失敗",
                    icon: "error",
                    confirmButtonText: "確定",
                  });
                }
              });
          } else if (res.isDenied) {
          }
        });
      }
    },
    async cancel(data) {
      this.filtergame = JSON.parse(this.filtergamebackup)
      this.target_array.forEach((item, index) => {
        if (
          item == "info" ||
          item == "provider" ||
          item == "status" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${data.item.id}`).style.display =
            "block";
        } else {
          document.getElementById(`${item}_${data.item.id}`).style.display =
            "none";
        }
      });
    },
    create() {
      var gid = this.createdata.gid;
      var info_id = this.createdata.info_id;
      var provider_id = this.createdata.provider_id;
      console.log(gid);
      console.log(info_id);
      console.log(provider_id);
      if (gid == "" || info_id == "" || provider_id == "") {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        gid != gid.replace(this.reMt, "") ||
        info_id != info_id.replace(this.reMt, "") ||
        provider_id != provider_id.replace(this.reMt, "")
      ) {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可含特殊符號",
          icon: "error",
        });
      } else {
        this.$root.$emit("bv::hide::modal", "create");
        this.loading = true;
        axios
          .post(`${this.api}/game/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            gid: this.createdata.gid,
            info_id: this.createdata.info_id,
            provider_id: this.createdata.provider_id,
            status: this.createdata.status,
          })
          .then((res) => {
            this.loading = false;
            console.log(res);
            if (res.data.status == 200) {
              this.$swal({
                title: "新增成功！",
                icon: "success",
              });
              this.getdata();
            } else {
              this.$swal({
                title: "新增失敗！",
                icon: "error",
              });
            }
          });
      }
    },
    async search() {
      this.filtergame = this.game;
      if (this.filtername != "") {
        this.filtergame = this.filtergame.filter(
          (item) => item.game_with_gameinfo.name.indexOf(this.filtername) != -1
        );
      }
      if (this.filterstatus !== "") {
        this.filtergame = this.filtergame.filter(
          (item) => item.status == this.filterstatus
        );
      }
      if (this.filterprovider != "") {
        this.filtergame = this.filtergame.filter(
          (item) => item.provider_id == this.filterprovider
        );
      }
      this.filtergamebackup = JSON.stringify(this.filtergame)
    },
  },
};
</script>
