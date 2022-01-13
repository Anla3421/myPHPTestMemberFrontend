<template>
  <div>
    <loading :active.sync="loading" />
    <!-- <nav-bar /> -->
    <!-- <smooth-scrollbar> -->
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
            cols="auto"
            prepend="供應商"
            style="margin: 15px auto; max-width: 240px"
            size="sm"
          >
            <b-form-select v-model="filterprovider" :options="searchprovider" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            cols="auto"
            :prepend="$t('cont.status')"
            style="margin: 15px auto; max-width: 240px"
            size="sm"
          >
            <b-form-select
              v-model="filterstatus"
              :options="this.searchstatus"
            />
          </b-input-group>
          <b-input-group class="col-sm" style="margin: 15px auto">
            <b-button
              v-b-modal.create
              size="sm"
              variant="primary"
              style="min-width: 60px; max-width: 60px; margin-left: auto"
            >
              新增
            </b-button>
            <b-modal id="create" centered title="新增代理商">
              <form style="font-size: 14px">
                <b-form-group label="名稱" size="sm">
                  <b-form-input v-model="createdata.agent_name" />
                </b-form-group>
                <b-form-group label="供應商" size="sm">
                  <b-form-select
                    :options="provider"
                    v-model="createdata.provider"
                  />
                </b-form-group>
                <b-form-group :label="$t('cont.status')" size="sm">
                  <b-form-select
                    :options="status"
                    v-model="createdata.status"
                  />
                </b-form-group>
                <b-form-group label="remark" size="sm">
                  <b-form-input v-model="createdata.remark" />
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
          style="font-size: 10px; margin: auto"
          :items="filteragents"
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
          <template #cell(name)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.agent_name"
                :id="`inputname_${data.item.id}`"
              />
              <b-form-text style="display: block" :id="`name_${data.item.id}`">
                {{ data.item.agent_name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(members)="data">
            <b-input-group size="sm">
              <b-form-text
                style="display: block"
                :id="`members_${data.item.id}`"
              >
                {{ data.item.members }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(products)="data">
            <b-input-group size="sm">
              <b-form-select
                style="display: none"
                v-model="data.item.products"
                :options="provider"
                :id="`inputproducts_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`products_${data.item.id}`"
              >
                {{ data.item.agent_with_provider.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(remark)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.remark"
                :id="`inputremark_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`remark_${data.item.id}`"
              >
                {{ data.item.remark }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(currency)="data">
            <b-input-group size="sm">
              <b-form-text :id="`currency_${data.item.id}`">
                {{
                  data.item.agent_with_provider.provider_with_currency
                    .game_currency
                }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(status)="data">
            <b-input-group size="sm">
              <b-form-select
                style="display: none"
                v-model="data.item.status"
                :options="status"
                :id="`inputstatus_${data.item.id}`"
              />
              <b-form-text
                :style="`display: block;color:${
                  data.item.status == 1 ? '#00BB00' : '#FF0000'
                }!important`"
                :id="`status_${data.item.id}`"
              >
                {{ data.item.status == 1 ? "啟用" : "停用" }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(updata)="data">
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
              修改
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
    <!-- </smooth-scrollbar> -->
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
      //搜尋供應商
      filterprovider: "",
      //搜尋供應商清單
      searchprovider: [],
      //狀態清單
      status: [
        { text: "停用", value: 0 },
        { text: "啟用", value: 1 },
      ],
      //供應商清單
      provider: [],
      //總資料
      agents: [],
      //搜尋後總資料
      filteragents: [],
      //搜尋後總資料備份
      filteragentsBackup: [],
      //新增資料
      createdata: {
        agent_name: null,
        provider: null,
        remark: null,
        status: null,
      },
      fields: [
        {
          key: "name",
          label: "名稱",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "members",
          label: "會員人數",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "products",
          label: "供應商",
          thStyle: "min-width:100px",
        },
        {
          key: "status",
          label: "狀態",
          thStyle: "min-width:70px",
          sortable: true,
        },
        {
          key: "remark",
          label: "備註",
          thStyle: "min-width:100px",
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
          label: "更新時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "updata",
          label: this.$t('cont.Update'),
        },
      ],
      //欄位id
      target_array: [
        "inputname",
        "inputproducts",
        "inputremark",
        "inputstatus",
        "name",
        "products",
        "remark",
        "status",
        "subbtn",
        "updbtn",
        "cancel",
      ],
      //文字欄位id
      target: ["name", "products", "remark", "status", , "updbtn"],
    };
  },
  computed: {
    rows() {
      return this.filteragents.length;
    },
  },
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.filteragents.length / this.perPage);
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
    this.color = await this.randomColor();
    this.isBusy = true;
    this.createdata.status = 0;
    this.createdata.provider = 1;
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
        .post(`${this.api}/agent`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          this.isBusy = false;
          this.agents = res.data.result.agents;
          this.filteragents = res.data.result.agents;
          this.filteragentsBackup = JSON.stringify(res.data.result.agents);
          this.totalpage = Math.ceil(this.filteragents.length / this.perPage);
          //廠商清單
          this.provider = res.data.result.provider.map((item, index) => {
            return { text: item.name, value: item.id };
          });
          //搜尋廠商清單
          this.searchprovider = res.data.result.provider.map((item, index) => {
            return { text: item.name, value: item.id };
          });
          this.searchprovider.push({ text: "全部", value: "" });
        });
      if (this.agents.length == 0) {
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
      const upDatedata = {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
        update_id: data.item.id,
        agent_name: String(data.item.agent_name),
        products: data.item.products,
        remark: String(data.item.remark),
        status: data.item.status,
      };
      if (upDatedata.remark == "") {
        upDatedata.remark = "　";
      }
      var createPass = this.preg(upDatedata);
      if (createPass) {
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
              .post(`${this.api}/agent/u`, upDatedata)
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
          }
        });
      }
    },
    //取消
    async cancel(data) {
      this.filteragents = JSON.parse(this.filteragentsBackup);
      //顯示文字欄位，關閉修改欄位
      this.target_array.forEach((item) => {
        document.getElementById(
          `${item}_${data.item.id}`
        ).style.display = this.target.includes(item) ? "block" : "none";
      });
    },
    //新增
    create() {
      if (this.createdata.remark == "" || this.createdata.remark == null)
        this.createdata.remark = "　";
      var createPass = this.preg(this.createdata);
      if (createPass) {
        this.$root.$emit("bv::hide::modal", "create");
        this.loading = true;
        this.createdata.api_token = VueCookies.get("token");
        this.createdata.id = sessionStorage.getItem("id");
        axios.post(`${this.api}/agent/c`, this.createdata).then((res) => {
          this.loading = false;
          if (res.data.status == 200) this.getdata();
          this.$swal({
            title:
              Number(res.data.status) === 200 ? "新增成功！" : "新增失敗！",
            icon: Number(res.data.status) === 200 ? "success" : "error",
          });
        });
      }
    },
    //判斷資料
    preg(checkdata) {
      const pregdata = [
        {
          key: "agent_name",
          check: "reCn",
        },
      ];
      var dataNullPass = true;
      var dataReplacePass = false;
      Object.values(checkdata).forEach((item) => {
        if (item === "" || item === null) {
          dataNullPass = false;
        }
      });
      if (dataNullPass) {
        dataReplacePass = true;
        pregdata.forEach((item) => {
          if (
            String(checkdata[item.key]) !=
            String(checkdata[item.key]).replace(this[item.check], "")
          ) {
            dataReplacePass = false;
          }
        });
      }
      if (!dataReplacePass || !dataNullPass) {
        this.$swal({
          title: "失敗！",
          text: "內容為空或含有特殊符號",
          icon: "error",
        });
      }
      if (dataNullPass && dataReplacePass) {
        return true;
      } else {
        return false;
      }
    },
    //搜尋
    async search() {
      this.filteragents = this.agents;
      if (this.filtername != "") {
        this.filteragents = this.filteragents.filter((item) =>
          item.agent_name.toLowerCase().includes(this.filtername.toLowerCase())
        );
      }
      if (this.filterstatus != "") {
        this.filteragents = this.filteragents.filter(
          (item) => item.status == this.filterstatus
        );
      }
      if (this.filterprovider != "") {
        this.filteragents = this.filteragents.filter(
          (item) => item.products == this.filterprovider
        );
      }
      this.filteragentsBackup = JSON.stringify(this.filteragents);
    },
  },
};
</script>