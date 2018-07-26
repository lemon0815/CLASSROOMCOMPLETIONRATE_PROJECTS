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
      <el-table
        :data="data"
        style="width=100%"
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
            <template v-if="scope.row.key==switchVOP_CN">
              <el-switch v-if="!scope.row.editing" v-model="scope.row.value" disabled></el-switch>
              <el-switch v-else v-model="scope.row.value"></el-switch>
            </template>
            <template v-else-if="scope.row.key==days_CN">
              <el-checkbox-group v-if="!scope.row.editing" v-model="scope.row.value" class="clickForbidden">
                <el-checkbox-button v-for="day in allDays" :label="day" :key="day">{{mapDays[day]}}</el-checkbox-button>
              </el-checkbox-group>
              <el-checkbox-group v-else v-model="scope.row.value">
                <el-checkbox-button v-for="day in allDays" :label="day" :key="day">{{mapDays[day]}}</el-checkbox-button>
              </el-checkbox-group>
            </template>
            <template v-else-if="scope.row.key==timeRange_CN">
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
    <!-- <el-dialog title="编辑" :visible.sync="dialogFormVisible" center width="50%">
      <el-row type="flex" align="middle">
        <el-col :span="8">{{switchVOP_CN}}</el-col>
        <el-col :span="14"><el-switch v-model="formData[switchVOP]" ></el-switch></el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="8">{{lowestChrome_CN}}</el-col>
        <el-col :span="14">
          <el-input v-model="formData[lowestChrome]"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="8">{{disabledLines_CN}}</el-col>
        <el-col :span="14">
          <el-input v-model="formData[disabledLines]"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="8">{{days_CN}}</el-col>
        <el-col :span="14">
          <el-checkbox-group v-model="formDataEffectiveDays">
            <el-checkbox-button v-for="day in allDays" :label="day" :key="day">{{mapDays[day]}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row  type="flex" align="middle">
        <el-col :span="8">{{timeRange_CN}}</el-col>
        <el-col :span="14">
          <el-time-picker
            is-range
            v-model="timeRangePicker"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss">
          </el-time-picker>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="handleEdit">确定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import BasicContainer from '@vue-materials/basic-container'
import md5 from 'js-md5'
import {handleURL} from 'utils/common.js'
import {params} from 'src/config.json'
import {roomType} from 'src/mapConfig.js'

export default {
  components: { BasicContainer },
  name: 'BasicTable',
  data() {
    return {
      data: [],
      sendData: {},
      dialogFormVisible: false,
      editing: false,
      envList: ['dev','test','pre','prod','prod_ali','test_02'],
      env: 'dev',
      switchVOP_CN: roomType.get("room.type.vop.switch"),
      days_CN: roomType.get("room.type.vop.teacher.effective.days"),
      timeRange_CN: roomType.get("room.type.vop.teacher.active.time.range"),
      lowestChrome_CN: roomType.get("room.type.vop.teacher.chrome.lowest"),
      disabledLines_CN: roomType.get("room.type.vop.teacher.disable.lines"),
      switchVOP: "room.type.vop.switch",
      days: "room.type.vop.teacher.effective.days",
      timeRange: "room.type.vop.teacher.active.time.range",
      lowestChrome: "room.type.vop.teacher.chrome.lowest",
      disabledLines: "room.type.vop.teacher.disable.lines",
      allDays: ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'],
      mapDays: {
        'MONDAY': '一',
        'TUESDAY': '二',
        'WEDNESDAY': '三',
        'THURSDAY': '四',
        'FRIDAY': '五',
        'SATURDAY': '六',
        'SUNDAY': '日',
      },
      // formData: {
      //   'room.type.vop.switch': '',
      //   'room.type.vop.teacher.effective.days': '',
      //   'room.type.vop.teacher.active.time.range': '',
      //   'room.type.vop.teacher.chrome.lowest': '',
      //   'room.type.vop.teacher.disable.lines': '',
      // },
    }
  },
  computed: {
    params(){
      let paramsArray = params.filter(v=>'invoker'==v.appName)
      paramsArray[0].env = this.env!==''?this.env:'dev'
      return paramsArray[0]
    },
  },
  watch: {
    '$route'(to,from){
      this.display()
    },
  },
  created() {
    this.display()
  },
  methods: {
    display(){
      this.data = [];
      let api = '/configure/config/dynamic';
      let url = handleURL(api,this.params)
      this.$http.get(url)
        .then((response)=>{
          let content = response.data.content
          let contentArr = content.split('\n')
          contentArr = contentArr.filter(v => v!=='')
          contentArr.forEach((v,k)=>{
            let data = {}
            let index = v.match(/\=/).index
            let key = v.slice(0,index)
            let value = v.slice(index+1)
            if(roomType.has(key)){
              if(value=='true'){
                value = true
              }
              if(value=='false'){
                value = false
              }
              if(key==this.days&&value){
                value = value.split(',')
              }
              if(key==this.timeRange&&value){
                value = value.split('-')
              }
              data['key'] = roomType.get(key)
              data['value'] = value
              data['editing'] = false
              this.data.push(data)
            }
          })
        })
        .catch((error)=>{
          this.data = []
          console.log(error)
        })
    },
    cancle(scope){
      scope.row.editing = false
      scope.row.value = scope.row.oldValue
    },
    edit(scope){
      console.log(scope)
      scope.row.editing = true
      scope.row.oldValue = scope.row.value
    },
    handleEdit(scope){
      let sendData = {}
      switch(scope.row.key){
        case this.switchVOP_CN:
        let switchVOP = scope.row.value
        if(switchVOP===true||switchVOP===false){
          switchVOP = switchVOP===true?'true':'false'
          sendData[this.switchVOP] = switchVOP
        }else{
          this.errorOpen('总开关输入有误')
        }
        break;
        case this.lowestChrome_CN:
        let lowestChrome = scope.row.value
        if(!/^CHROME\d+$/.test(lowestChrome)){
          this.errorOpen('Chrome版本形如 CHROME56')
        }else{
          sendData[this.lowestChrome] = lowestChrome
          
        }
        break;
        case this.disabledLines_CN:
        let disabledLines = scope.row.value
        if(!/^(\d+\,)*\d+$/.test(disabledLines)){
          this.errorOpen('禁用线路用 ， 隔开')
        }else{
          sendData[this.disabledLines] = disabledLines
        }
        break;
        case this.days_CN:
        let days = scope.row.value
        if(Array.isArray(days)){
          days = days.join(',')
          sendData[this.days] = days
        }else{
          this.errorOpen('生效星期输入有误')
        }
        break;
        case this.timeRange_CN:
        let timeRange = scope.row.value
        if(timeRange){
          timeRange = timeRange.join('-')
        }
        if(!/^\d{2}\:\d{2}\:\d{2}\-\d{2}\:\d{2}\:\d{2}$/.test(timeRange)){
          this.errorOpen('生效时间输入有误')
        }else{
          sendData[this.timeRange] = timeRange
        }
        break;
      }
      console.log(sendData)
      if(JSON.stringify(sendData)!=='{}'){
        this.postData(sendData)
          .then((res)=>{
            if(res.data == true){
              this.successOpen('修改成功')
              scope.row.editing = false
            } 
          })
          .catch((error)=>{
            this.errorOpen('修改失败')
            console.log(error)
          })
      }












      // let lowestChrome = this.formData[this.lowestChrome]
      // let disabledLines = this.formData[this.disabledLines]
      // if(!/^CHROME\d+$/.test(lowestChrome)){
      //   this.errorOpen('Chrome版本形如 CHROME56')
      // }else if(!/^(\d\,)*\d$/.test(disabledLines)){
      //   this.errorOpen('禁用线路用 ， 隔开')
      // }else if(!this.timeRangePicker){
      //   this.errorOpen('请输入生效时间')
      // }else{
      //   this.sendData[this.days] = this.formDataEffectiveDays.join(',')
      //   this.sendData[this.timeRange] = this.timeRangePicker.join('-')
      //   this.sendData[this.switchVOP] = this.formData[this.switchVOP]?'true':'false'
      //   this.sendData[this.lowestChrome] = this.formData[this.lowestChrome]
      //   this.sendData[this.disabledLines] = this.formData[this.disabledLines]
      //   console.log(this.sendData)
      //   this.postData(this.sendData)
      //     .then((res)=>{
      //       if(res.data == true){
      //         this.successOpen('修改成功')
      //         this.dialogFormVisible = false
      //         this.display()
      //       } 
      //     })
      //     .catch((error)=>{
      //       this.errorOpen('修改失败')
      //       console.log(error)
      //     })
      // }
    },

    postData(data){
      let api = '/configure/config/realtime/update';
      let timestamp = Date.parse(new Date());
      let userName = 'wangshuai8';
      let appName = 'invoker';
      let env = this.env!==''?this.env:'dev';
      let token = this.params.token;
      let secret = md5(userName + token + timestamp + env);
      let params = {userName,appName,env,timestamp,secret}
      let url = handleURL(api,params)
      return this.$http.post(url,data)
    },
    successOpen(message) {
      this.$message.success(message)
    },
    errorOpen(message) {
      this.$message.error(message)
    },
  },
  

}
</script>

<style lang="scss">
  .basic-table {

  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0
    };
    .el-col:first-child {
      font-size: 16px
    }
  }
  .clickForbidden {
    pointer-events: none;
    cursor: default;
    opacity: 0.9;
  }
</style>