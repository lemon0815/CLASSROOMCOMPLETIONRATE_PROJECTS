<template>
  <div className="basic-table">
    <basic-container>
      <el-row :gutter='20'>
        <el-col :span=6>
          <el-input v-model="search" placeholder="Key"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="env" placeholder="环境" @change="display">
            <el-option v-for="(env,index) in envList" :key="index" :value="env">{{env}}</el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="add">新增</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        >
        <el-table-column
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          prop="key"
          label="Key"
          width="460"
         >
        </el-table-column>
        <el-table-column
          prop="value"
          label="Value"
          width="460"
          >
          <template slot-scope="scope">
            <el-input v-if="scope.row.editing" v-model.trim="scope.row.value" @keyup.native.enter="handleEdit(scope)"></el-input>
            <span v-else>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
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
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-row  type='flex' justify="center" :gutter="30">
        <el-col :span="10">
          <el-input v-model="key" placeholder="Key"></el-input>
        </el-col>
        <el-col :span="10">
          <el-input v-model="value" placeholder="Value"></el-input>
        </el-col>        
      </el-row>
      <br>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BasicContainer from '@vue-materials/basic-container'
import md5 from 'js-md5'
import {handleURL} from 'utils/common.js'
import {params} from 'src/config.json'

export default {
  components: { BasicContainer },
  name: 'BasicTable',
  data() {
    return {
      data: [],
      tableData: [],
      dialogFormVisible: false,
      editData: {},
      formLabelWidth: '120px',
      editing: false,
      search: '',
      envList: ['dev','test','pre','prod','prod_ali','test_02'],
      env: 'dev',
      key: '',
      value: '',
    }
  },
  computed: {
    params(){
      let paramsArray = params.filter(v=>this.$route.params.appName==v.appName)
      paramsArray[0].env = this.env!==''?this.env:'dev'
      return paramsArray[0]
    },
  },
  watch: {
    '$route'(to,from){
      this.search = ''
      this.display()
    },
    search(){
      this.filter()
    }
  },
  created() {
    this.display()
    },
  methods: {
    add(){
      this.dialogFormVisible = true
    },
    handleAdd(){
      let data = {}
      data[this.key] = this.value
      console.log(data)
      if(data&&data[this.key]){
        this.postData(data)
          .then((res)=>{
            if(res.data == true){
              this.dialogFormVisible = false
              this.open('success','新增成功')
            } 
          })
          .catch((error)=>{
            console.log(error)
            this.open('error','新增失败')
            })
      }else{
        this.open('info','请完善数据')
      }
    },
    edit(scope){
      scope.row.editing = true
    },
    handleEdit(scope){
      let data = {}
      data[scope.row['key']] = scope.row['value']
      this.postData(data)
        .then((res)=>{
          if(res.data == true){
            scope.row.editing = false
            this.open('success','修改成功')
          } 
        })
        .catch((error)=>{
          this.open('error','修改失败')
          console.log(error)
          })
    },
    cancle(scope){
      scope.row.editing = false
    },
    filter(){
      if(this.search !== ''){
        this.tableData = this.data.filter(v => v.key.includes(this.search))
      }else{
        this.tableData == this.data
      }
    },
    display(){
      this.data = [];
      let api = '/configure/config/dynamic';
      let url = handleURL(api,this.params)
      this.$http.get(url)
        .then((response)=>{      
          let content = response.data.content
          let contentArr = content.split('\n')
          contentArr = contentArr.filter((v) => v!=='')
          contentArr.forEach((v,k)=>{
            let data = {}
            let index = v.match(/\=/).index
            let key = v.slice(0,index)
            let value = v.slice(index+1)
            data['key'] = key
            data['value'] = value
            data['editing'] = false
            this.data.push(data)
            this.tableData = this.data
            this.filter()
          })
        })
        .catch((error)=>{
          this.tableData = []
          console.log(error)
        })
    },
    postData(data){
      let api = '/configure/config/realtime/update';
      let timestamp = Date.parse(new Date());
      let userName = 'wangshuai8';
      let appName = this.$route.params.appName;
      let env = this.env!==''?this.env:'dev';
      let token = this.params.token;
      let secret = md5(userName + token + timestamp + env);
      let params = {userName,appName,env,timestamp,secret}
      let url = handleURL(api,params)
      return this.$http.post(url,data)
    },
    open(result,message) {
      this.$notify({
        title: '提示',
        message,
        type: result,
        duration: 2000
      });
    },
  },
  

}
</script>

<style>
  .basic-table {

  }
</style>
