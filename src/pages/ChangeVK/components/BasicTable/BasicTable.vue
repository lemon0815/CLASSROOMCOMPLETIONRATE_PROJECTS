<template>
  <div className="basic-table">
    <basic-container>
      <el-row :gutter=20>
        <el-col :span=4>
          <el-select v-model="env" placeholder="环境" @change="display">
            <el-option v-for="(env,index) in envList" :key="index" :value="env">{{env}}</el-option>
          </el-select>
        </el-col>
      </el-row>
      <a href=""></a>
      <el-table
        :data="data"
        style="width:100%"
        >
        <el-table-column
          prop="key"
          label="key"
          width="440">
        </el-table-column>
        <el-table-column
          prop="value"
          label="value"
          width="480">
          <template slot-scope="scope">
            <template v-if="scope.row.key==switchVK">
              <el-switch v-if="!scope.row.editing" v-model="scope.row.value" disabled></el-switch>
              <el-switch v-else v-model="scope.row.value"></el-switch>
            </template>
            <template v-else-if="scope.row.key==days">
              <el-checkbox-group v-if="!scope.row.editing" v-model="scope.row.value" class="clickForbidden">
                <el-checkbox-button v-for="day in allDays" :label="day" :key="day">{{mapDays[day]}}</el-checkbox-button>
              </el-checkbox-group>
              <el-checkbox-group v-else v-model="scope.row.value">
                <el-checkbox-button v-for="day in allDays" :label="day" :key="day">{{mapDays[day]}}</el-checkbox-button>
              </el-checkbox-group>
            </template>
            <template v-else-if="scope.row.key==timeRange">
              <span v-if="!scope.row.editing">{{scope.row.value.join('-')}}</span>
              <el-time-picker
                v-else
                is-range
                v-model="scope.row.value"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss">
              </el-time-picker>
            </template>
            <template v-else>
              <span v-if="!scope.row.editing">{{scope.row.value}}</span>
              <el-input v-else v-model="scope.row.value"></el-input>
            </template>
        </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          style="width:20%"
          >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.editing" type="primary" icon="el-icon-edit" circle @click="edit(scope)"></el-button>
            <template v-else>
              <el-button type="success" icon="el-icon-check" circle @click="handleEdit(scope)"></el-button>
              <el-button type="danger" icon="el-icon-error" circle @click="cancle(scope)"></el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import BasicContainer from "@vue-materials/basic-container";
import md5 from "js-md5";
import { handleURL } from "utils/common.js";
import { params } from "src/config.json";
import { changeVK } from "src/mapConfig.js";

export default {
  components: { BasicContainer },
  name: "BasicTable",
  data() {
    return {
      data: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      envList: ["dev", "test", "pre", "prod", "prod_ali", "test_02"],
      env: "dev",
      switchVK: changeVK.get("changeVK.switch"),
      days: changeVK.get("changeVK.effective.days"),
      timeRange: changeVK.get("changeVK.active.time.range"),
      msgPipeline: changeVK.get("changeVK.msgPipeline.threshold"),
      capacity: changeVK.get("changeVK.capacity.threshold"),
      // formData: {
      //   "changeVK.switch": '',
      //   "changeVK.msgPipeline.threshold": '',
      //   "changeVK.capacity.threshold": '',
      //   "changeVK.effective.days": '',
      //   "changeVK.active.time.range": '',
      // },
      allDays: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
      ],
      mapDays: {
        MONDAY: "一",
        TUESDAY: "二",
        WEDNESDAY: "三",
        THURSDAY: "四",
        FRIDAY: "五",
        SATURDAY: "六",
        SUNDAY: "日"
      }
      // formDataEffectiveDays: [],
      // timeStart: '',
      // timeEnd: '',
      // timeRangePicker: [],
    };
  },
  computed: {
    params() {
      let paramsArray = params.filter(v => "invoker" == v.appName);
      paramsArray[0].env = this.env !== "" ? this.env : "dev";
      return paramsArray[0];
    }
  },
  watch: {
    $route(to, from) {
      this.display();
    }
  },
  created() {
    this.display();
    console.log(this.data);
  },
  methods: {
    display() {
      this.data = [];
      let api = "/configure/config/dynamic";
      let url = handleURL(api, this.params);
      this.$http
        .get(url)
        .then(response => {
          let content = response.data.content;
          let contentArr = content.split("\n");
          contentArr = contentArr.filter(v => v !== "");
          contentArr.forEach((v, k) => {
            let data = {};
            let index = v.match(/\=/).index;
            let key = v.slice(0, index);
            let value = v.slice(index + 1);
            if (changeVK.has(key)) {
              if (value == "true") {
                value = true;
              }
              if (value == "false") {
                value = false;
              }
              if (key == "changeVK.effective.days" && value) {
                value = value.split(",");
              }
              if (key == "changeVK.active.time.range" && value) {
                value = value.split("-");
              }
              data["key"] = changeVK.get(key);
              data["value"] = value;
              data["editing"] = false;
              this.data.push(data);
            }
          });
        })
        .catch(error => {
          this.data = [];
          console.log(error);
        });
    },
    cancle(scope) {
      scope.row.editing = false;
      scope.row.value = scope.row.oldValue;
    },
    edit(scope) {
      console.log(scope);
      scope.row.editing = true;
      scope.row.oldValue = scope.row.value;
    },
    handleEdit(scope) {
      let sendData = {};
      switch (scope.row.key) {
        case this.switchVK:
          let switchVK = scope.row.value;
          if (switchVK === true || switchVK === false) {
            switchVK = switchVK === true ? "true" : "false";
            sendData["changeVK.switch"] = switchVK;
          } else {
            this.errorOpen("总开关输入有误");
          }
          break;
        case this.msgPipeline:
          let msgPipeline = scope.row.value;
          if (
            msgPipeline == "" ||
            msgPipeline < 0 ||
            Object.is(Number(msgPipeline), NaN)
          ) {
            this.errorOpen("请正确输入信令阈值");
          } else {
            sendData["changeVK.msgPipeline.threshold"] = msgPipeline;
          }
          break;
        case this.capacity:
          let capacity = scope.row.value;
          if (!/^(\w+\=\d+\,)*(\w+\=\d+)$/.test(capacity)) {
            this.errorOpen("各线路并发阈值形如 S0_V3_L1=2000,S8_V1_L1=2000");
          } else {
            sendData["changeVK.capacity.threshold"] = capacity;
          }
          break;
        case this.days:
          let days = scope.row.value;
          if (Array.isArray(days)) {
            days = days.join(",");
            sendData["changeVK.effective.days"] = days;
          } else {
            this.errorOpen("生效星期输入有误");
          }
          break;
        case this.timeRange:
          let timeRange = scope.row.value;
          if (timeRange) {
            timeRange = timeRange.join("-");
          }
          if (!/^\d{2}\:\d{2}\:\d{2}\-\d{2}\:\d{2}\:\d{2}$/.test(timeRange)) {
            this.errorOpen("生效时间输入有误");
          } else {
            sendData["changeVK.active.time.range"] = timeRange;
          }
          break;
      }
      console.log(sendData);
      if (JSON.stringify(sendData) !== "{}") {
        this.postData(sendData)
          .then(res => {
            if (res.data == true) {
              this.successOpen("修改成功");
              scope.row.editing = false;
            }
          })
          .catch(error => {
            this.errorOpen("修改失败");
            console.log(error);
          });
      }
    },
    postData(data) {
      let api = "/configure/config/realtime/update";
      let timestamp = Date.parse(new Date());
      let userName = "wangshuai8";
      let appName = "invoker";
      let env = this.env !== "" ? this.env : "dev";
      let token = this.params.token;
      let secret = md5(userName + token + timestamp + env);
      let params = { userName, appName, env, timestamp, secret };
      let url = handleURL(api, params);
      return this.$http.post(url, data);
    },
    successOpen(message) {
      this.$message.success(message);
    },
    errorOpen(message) {
      this.$message.error(message);
    }
  }
};
</script>

<style lang="scss">
.basic-table {
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col:first-child {
    font-size: 16px;
  }
}
.clickForbidden {
  pointer-events: none;
  cursor: default;
  opacity: 0.9;
}
</style>