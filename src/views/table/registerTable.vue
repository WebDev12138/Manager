<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="value" clearable placeholder="状态">
              <el-option
                v-for="item in status"
                :key="item.statusId"
                :label="item.label"
                :value="item.statusId">
              </el-option>
          </el-select>
        </el-form-item>
                <el-form-item >
          <el-input placeholder="姓名" v-model="searchName"></el-input>
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
      <el-table-column prop="id" label="ID" min-width="160px">
      </el-table-column>
      <el-table-column prop="user_name" label="用户名" min-width="100px">
      </el-table-column>
      <el-table-column prop="real_name" min-width="100px" label="真实姓名">
      </el-table-column>
      <el-table-column prop="picture" label="头像路径"  min-width="150px">
      </el-table-column>
      <!-- <el-table-column prop="date" label="时间" width="110px">
      </el-table-column>
      <el-table-column  label="状态" width="120" >
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
      <el-form label-width="80px" :model="detail" ref="dataForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="detail.id"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <img v-bind:src="this.detail.picture" style="width: 5rem;height: 5rem">
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="detail.user_name" readonly></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码">
          <el-input v-model="detail.password" readonly></el-input>
        </el-form-item> -->
        <el-form-item label="真实姓名">
          <el-input v-model="detail.real_name" readonly></el-input>
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
        <el-form-item label="角色" v-model="detail.roleId">
         <el-select v-model="detail.roleId" placeholder="角色">
            <el-option v-for="item in status"
                       :label="item.role"
                       :value="item.id"
                       :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData" class="title1">审核通过</el-button>
      </div>
    </el-dialog>

    <!-- 删除弹框 -->
    <!-- <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDelete">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>



<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  inject: ['reload'],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      tableList: [],
      listLoading: true,
      isShowEditVisible: false,
      deleteVisible: false,
      temp: {
        id: '',
        user_name: '',
        real_name: '',
        picture: ''
      },
      detail: {
        id: '',
        user_name: '',
        password: '',
        real_name: '',
        sex: '',
        picture: '',
        phone: '',
        email: '',
        roleId: ''
      },
      total: 0,
      page: 1,
      pageSize: 5,
      status: [],
      value: '',
      searchName: '',
      filterTableDataEnd: []
    }
  },
  created() {
    this.fetchData()
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
    fetchData() {
      this.listLoading = true
      axios.get('http://localhost:9200/managerUser/getRegister?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        // const limit = 10
        // const pageList = response.data.filter((item, index) => index < limit * this.page && index >= limit * (this.page - 1))
        // console.log(pageList)
        // this.total = response.data.length
        // this.tableList = pageList
        this.total = response.data.total
        this.tableList = response.data.list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
      axios.get('http://localhost:9200/role/getRoles').then(res => {
        this.status = res.data
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
    },
    doFilter() {
      if (this.searchName === '') {
        this.fetchData()
        // this.$message.warning('查询条件不能为空！')
        return
      }
      console.log(this.searchName)
      // 每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = []
      this.tableList.forEach((value, index) => {
        if (value.cname) {
          if (value.cname.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
            console.log(this.filterTableDataEnd)
          }
        }
      })
      // 页面数据改变重新统计数据数量和当前页
      this.page = 1
      this.total = this.filterTableDataEnd.length
      // 渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd)
    },
    clickfun(e) {
      console.log(e.target.innerText)
    },
    handleUpdate(row) {
      this.isShowEditVisible = true
      axios.get('http://localhost:9200/managerUser/getManagerUserDetail?managerId=' + row.id).then(res => {
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
    updateData() {
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      axios.post('http://localhost:9200/managerUser/pass', { managerId: this.detail.id, createdBy: this.name, roleId: this.detail.roleId }).then(() => {
        // for (const v of this.tableList) {
        //   if (v.uid === this.temp.uid) {
        //     const index = this.tableList.indexOf(v)
        //     this.tableList.splice(index, 1, this.temp)
        //     break
        //   }
        // }
        this.isShowEditVisible = false
        this.$notify({
          title: '成功',
          message: '审核通过',
          type: 'success',
          duration: 2000
        })
        this.reload()
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
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
      this.fetchData()
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