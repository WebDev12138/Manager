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
          <el-input placeholder="ID,角色,权限" v-model="searchName" clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isShowAddVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="id" label="ID" min-width="200px">
      </el-table-column>
      <el-table-column prop="role" label="角色" min-width="150px">
      </el-table-column>
      <el-table-column prop="type" min-width="150px" label="权限">
      </el-table-column>
      <!-- <el-table-column prop="number" label="阅读数"  width="65">
      </el-table-column>
      <el-table-column prop="date" label="时间" width="110px">
      </el-table-column>
      <el-table-column  label="状态" width="120" >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag size="small"  :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 2">禁用</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="operation" label="操作 ">
        <template slot-scope="scope" >
         <el-button size="small" type="primary"  @click="handleUpdate(scope.row)">编辑</el-button>
         <!-- <el-button v-if="scope.row.status!='2'" size="mini" type="success" @click="handleModifyStatus(scope.row,'2')">启用
          </el-button>
          <el-button v-if="scope.row.status!='1'" size="mini" @click="handleModifyStatus(scope.row,'1')">禁用
          </el-button> -->
          <el-button size="small" type="danger" @click="deleteUpdate(scope.row)">删除</el-button>
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


    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="isShowAddVisible">
      <el-form label-width="80px" :model="add" :rules="addRules" ref="addForm">
        <el-form-item label="角色" prop="role">
          <el-input v-model="add.role"></el-input>
        </el-form-item>
        <el-form-item label="权限" v-model="add.type" prop="type">
         <el-select v-model="add.type" placeholder="权限">
            <el-option v-for="item in status"
                       :label="item.label"
                       :value="item.statusId"
                       :key="item.statusId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="addData('addForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="isShowUpdateVisible">
      <el-form label-width="80px" :model="update" :rules="updateRules" ref="updateForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="update.id"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="update.role"></el-input>
        </el-form-item>
        <el-form-item label="权限" v-model="update.type" prop="type">
         <el-select v-model="update.type" placeholder="权限">
            <el-option v-for="item in status"
                       :label="item.label"
                       :value="item.statusId"
                       :key="item.statusId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData('updateForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除弹框 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  inject: ['reload'],
  data() {
    return {
      addRules: {
        role: [
          { required: true, message: '角色不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '权限不可为空', trigger: 'blur' }
        ]
      },
      updateRules: {
        role: [
          { required: true, message: '角色不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '权限不可为空', trigger: 'blur' }
        ]
      },
      tableList: [],
      all: [],
      listLoading: true,
      isShowAddVisible: false,
      isShowUpdateVisible: false,
      deleteVisible: false,
      temp: {
        id: '',
        role: '',
        type: ''
      },
      add: {
        role: '',
        type: ''
      },
      update: {
        id: '',
        role: '',
        type: ''
      },
      delete: {
        id: '',
        role: '',
        type: ''
      },
      total: 0,
      page: 1,
      pageSize: 5,
      status: [
        {
          statusId: 0,
          label: '普通权限'
        }, {
          statusId: 1,
          label: '最高权限'
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
      axios.get('http://118.31.102.1:9200/role/getRole?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        const list = response.data.list
        for (let index = 0; index < list.length; index++) {
          list[index].type = list[index].type === '0' ? '普通权限' : '最高权限'
        }
        this.tableList = list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/role/getAllRole').then(res => {
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
        if (value.role) {
          if (value.role.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.type) {
          if (value.type.indexOf(this.searchName) >= 0) {
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
      this.isShowUpdateVisible = true
      this.update = Object.assign({}, row)
      console.log(row)
    },
    deleteUpdate(row) {
      console.log(row)
      this.deleteVisible = true
      this.delete = Object.assign({}, row)
      // console.log(row)
    },
    submitDelete() {
      axios.delete('http://118.31.102.1:9200/role/deleteRole?roleId=' + this.delete.id).then(() => {
        this.deleteVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.reload()
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
      // for (const v of this.tableList) {
      //   if (v.uid === this.temp.uid) {
      //     const index = this.tableList.indexOf(v)
      //     this.tableList.splice(index, 1)
      //     this.fetchData()
      //     console.log(this.tableList)
      //     break
      //   }
      // }
      // this.deleteVisible = false
      // this.$notify({
      //   title: '成功',
      //   message: '删除成功',
      //   type: 'success',
      //   duration: 2000
      // })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      console.log(row)
      row.status = status
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('http://118.31.102.1:9200/role/addRole', this.add).then(() => {
            this.isShowEditVisible = false
            this.$notify({
              title: '成功',
              message: '新增成功',
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
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('http://118.31.102.1:9200/role/updateRole', { id: this.update.id, role: this.update.role, type: this.update.type === '普通权限' ? '0' : this.update.type === '最高权限' ? '1' : this.update.type }).then(() => {
            this.isShowEditVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
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