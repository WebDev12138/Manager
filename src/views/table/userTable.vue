<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <!-- <el-form-item>
          <el-select v-model="value" clearable placeholder="状态">
              <el-option
                v-for="item in status"
                :key="item.statusId"
                :label="item.label"
                :value="item.statusId">
              </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item >
          <el-input placeholder="ID,用户名,昵称" v-model="searchName" clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" >新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="id" label="ID" min-width="200px">
      </el-table-column>
      <el-table-column prop="user_name" label="用户名" min-width="150px">
      </el-table-column>
      <el-table-column prop="nick_name" min-width="150px" label="昵称">
      </el-table-column>
      <!-- <el-table-column prop="number" label="阅读数"  width="65">
      </el-table-column> -->
      <el-table-column prop="created_date" label="创建时间" min-width="150px">
      </el-table-column>
      <!-- <el-table-column  label="状态" width="120" >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag size="small"  :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 2">禁用</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="operation" label="操作 ">
        <template slot-scope="scope" >
         <el-button size="small" type="primary"  @click="handleUpdate(scope.row)">查看详细信息</el-button>
         <!-- <el-button v-if="scope.row.status!='2'" size="mini" type="success" @click="handleModifyStatus(scope.row,'2')">启用
          </el-button>
          <el-button v-if="scope.row.status!='1'" size="mini" @click="handleModifyStatus(scope.row,'1')">禁用
          </el-button> -->
          <!-- <el-button size="small" type="danger" @click="deleteUpdate(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination layout="total, prev, pager, next"
                    background
                    :page-size="5"
                    @size-change="handleSizeChange"
                    :total="total"
                    @current-change="handleCurrentChange"
                    style="text-align:center;">
    </el-pagination>


    <!-- 详细信息 -->
    <el-dialog title="详细信息" :visible.sync="isShowEditVisible">
      <el-form label-width="80px" :model="detail">
        <el-form-item label="ID" hidden>
          <el-input v-model="detail.id"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <img v-bind:src="'http://q00p4epjw.bkt.clouddn.com/'+this.detail.picture" style="width: 5rem;height: 5rem">
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="detail.user_name" readonly></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码">
          <el-input v-model="detail.password" readonly></el-input>
        </el-form-item> -->
        <el-form-item label="昵称">
          <el-input v-model="detail.nick_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="detail.profile" readonly></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="detail.sex" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="detail.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="detail.email" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="detail.created_date" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="handlePass" class="title1">审核</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审核信息" :visible.sync="isShowPassVisible">
      <el-form label-width="80px" :model="pass" :rules="rules" ref="dataForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="pass.id"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="picture">
          <img v-bind:src="'http://118.31.102.1:9200/managerUserInfo/getPicture?fileName='+this.detail.picture" style="width: 5rem;height: 5rem">
          <el-button @click="pass.picture = 'image/picture/default.jpg'">默认</el-button>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="pass.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" prop="profile">
          <el-input v-model="pass.profile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData('dataForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>



<script>
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  inject: ['reload'],
  data() {
    return {
      rules: {
        picture: [
          { required: true, message: '头像不可为空', trigger: 'blur' }
        ],
        nick_name: [
          { required: true, message: '昵称不可为空', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        profile: [
          { min: 0, max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur' }
        ]
      },
      tableList: [],
      all: [],
      listLoading: true,
      isShowEditVisible: false,
      isShowPassVisible: false,
      deleteVisible: false,
      temp: {
        id: '',
        user_name: '',
        nick_name: '',
        created_date: ''
      },
      detail: {
        id: '',
        user_name: '',
        nick_name: '',
        profile: '',
        user_password: '',
        created_date: '',
        sex: '',
        picture: '',
        email: '',
        phone: ''
      },
      pass: {
        id: '',
        nick_name: '',
        profile: '',
        picture: ''
      },
      total: 0,
      page: 1,
      pageSize: 5,
      status: [
        {
          statusId: 1,
          label: '启用'
        }, {
          statusId: 0,
          label: '禁用'
        }
      ],
      value: '',
      searchName: '',
      filterTableDataEnd: []
    }
  },
  created() {
    this.fetchData()
    this.getAllData()
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  methods: {
    search() {
      if (this.searchName === '') {
        this.filterTableDataEnd = []
        this.fetchData()
      } else {
        this.doFilter()
      }
    },
    fetchData() {
      this.listLoading = true
      axios.get('http://118.31.102.1:9200/user/get?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        this.tableList = response.data.list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/user/getAll').then(res => {
        this.all = res.data
      }).catch((error) => {
        Message.error(error.response.data.message)
      })
    },
    doFilter() {
      this.filterTableDataEnd = []
      if (this.searchName === '') {
        this.fetchData()
        // this.$message.warning('查询条件不能为空！')
        return
      }
      this.all.forEach((value, index) => {
        if (value.id) {
          if (value.id.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.user_name) {
          if (value.user_name.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.nick_name) {
          if (value.nick_name.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
      })
      // 页面数据改变重新统计数据数量和当前页
      // this.page = 1
      this.total = this.filterTableDataEnd.length
      // 渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd)
    },
    clickfun(e) {
      console.log(e.target.innerText)
    },
    handleUpdate(row) {
      this.isShowEditVisible = true
      axios.get('http://118.31.102.1:9200/user/getUserDetail?userId=' + row.id).then(res => {
        this.detail = Object.assign({}, res.data)
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
      // this.temp = Object.assign({}, row)
      // console.log(row)
    },
    deleteUpdate(row) {
      console.log(row)
      this.deleteVisible = true
      this.temp = Object.assign({}, row)
      // console.log(row)
    },
    submitDelete() {
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      console.log(this.tableList)
      for (const v of this.tableList) {
        if (v.uid === this.temp.uid) {
          const index = this.tableList.indexOf(v)
          this.tableList.splice(index, 1)
          this.fetchData()
          console.log(this.tableList)
          break
        }
      }
      this.deleteVisible = false
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      console.log(row)
      row.status = status
    },
    handlePass() {
      this.isShowEditVisible = false
      this.isShowPassVisible = true
      this.pass = this.detail
    },
    handleCancel() {
      this.isShowPassVisible = false
      this.isShowEditVisible = true
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://118.31.102.1:9200/user/editUserInfo', this.pass).then(() => {
            this.isShowPassVisible = false
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success',
              duration: 2000
            })
            this.reload()
          }).catch((error) => {
            Message.error(error.response.data.message)
            this.deleteVisible = false
          })
        } else {
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.page = val
      console.log(this.page)
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page = val
      console.log(this.page)
      if (this.filterTableDataEnd.length <= 0) {
        this.fetchData()
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    },
    currentChangePage(list) {
      let from = (this.page - 1) * this.pageSize
      const to = this.page * this.pageSize
      this.tableList = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableList.push(list[from])
        }
      }
    }
  }
}
</script>