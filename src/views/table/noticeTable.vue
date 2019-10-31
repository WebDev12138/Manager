<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="value" clearable placeholder="状态" @change="statusSearch">
              <el-option
                v-for="item in status"
                :key="item.statusId"
                :label="item.label"
                :value="item.statusId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="通知标题,创建人" v-model="searchName" clearable @change="search"></el-input>
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
      <el-table-column prop="notice_title" label="通知标题" min-width="150px">
      </el-table-column>
      <el-table-column prop="notice_content" label="通知内容" min-width="150px">
      </el-table-column>
      <el-table-column prop="created_by" min-width="65" label="创建人">
      </el-table-column>
      <el-table-column prop="created_date" label="创建时间"  min-width="55px">
      </el-table-column>
      <el-table-column prop="time_out" label="过期时间" min-width="55px">
      </el-table-column>
      <el-table-column  label="状态" width="80" >
        <template slot-scope="scope">
          <el-tag size="small" type="danger" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.time_out < currentTime">已过期</el-tag>
          <el-tag size="small"  type="success" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.time_out >= currentTime">未过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作 ">
        <template slot-scope="scope" >
         <el-button size="small" type="primary"  @click="handleUpdate(scope.row)">编辑</el-button>
         <el-button size="small" type="primary"  @click="handleTime(scope.row)">延时</el-button><br>
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


    <!-- 新增公告 -->
    <el-dialog title="新增公告" :visible.sync="isShowAddVisible">
      <el-form label-width="80px" :model="add" :rules="addRules" ref="addForm">
        <el-form-item label="公告标题" prop="notice_title">
          <el-input v-model="add.notice_title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="notice_content">
          <el-input v-model="add.notice_content"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="time_out">
          <el-date-picker
            v-model="add.time_out"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="addData('addForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑公告" :visible.sync="isShowUpdateVisible">
      <el-form label-width="80px" :model="update" :rules="updateRules" ref="updateForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="update.id"></el-input>
        </el-form-item>
        <el-form-item label="公告标题" prop="notice_title">
          <el-input v-model="update.notice_title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="notice_content">
          <el-input v-model="update.notice_content"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="time_out">
          <el-date-picker
            v-model="update.time_out"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData('updateForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="延长时间" :visible.sync="isShowTimeVisible">
      <el-form label-width="80px" :model="updateTime" :rules="timeRules" ref="timeForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="updateTime.id"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="time_out">
          <el-date-picker
            v-model="updateTime.time_out"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowTimeVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateTimeData('timeForm')" class="title1">确定</el-button>
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
      addRules: {
        notice_title: [
          { required: true, message: '公告标题不可为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        notice_content: [
          { required: true, message: '公告内容不可为空', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        time_out: [
          { required: true, message: '结束时间不可为空', trigger: 'blur' }
        ]
      },
      updateRules: {
        notice_title: [
          { required: true, message: '公告标题不可为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        notice_content: [
          { required: true, message: '公告内容不可为空', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        time_out: [
          { required: true, message: '结束时间不可为空', trigger: 'blur' }
        ]
      },
      timeRules: {
        time_out: [
          { required: true, message: '结束时间不可为空', trigger: 'blur' }
        ]
      },
      tableList: [],
      all: [],
      listLoading: true,
      isShowAddVisible: false,
      isShowUpdateVisible: false,
      isShowTimeVisible: false,
      deleteVisible: false,
      currentTime: '',
      temp: {
        id: '',
        notice_title: '',
        notice_content: '',
        created_by: '',
        modified_by: '',
        created_date: '',
        modified_date: '',
        time_out: ''
      },
      add: {
        notice_title: '',
        notice_content: '',
        created_by: '',
        time_out: ''
      },
      update: {
        id: '',
        notice_title: '',
        notice_content: '',
        modified_by: '',
        time_out: ''
      },
      updateTime: {
        id: '',
        modified_by: '',
        time_out: ''
      },
      delete: {
        id: ''
      },
      total: 0,
      page: 1,
      pageSize: 5,
      status: [
        {
          statusId: '未过期',
          label: '未过期'
        }, {
          statusId: '已过期',
          label: '已过期'
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
        if (this.value !== '') {
          this.statusSearch()
        } else {
          this.filterTableDataEnd = []
          this.fetchData()
        }
      } else {
        if (this.value === '') {
          this.doFilter()
        } else {
          this.filterTableDataEnd = []
          this.all.forEach((value, index) => {
            if ((this.value === '已过期' && value.time_out < this.currentTime) || (this.value === '未过期' && value.time_out >= this.currentTime)) {
              this.filterTableDataEnd.push(value)
            }
          })
          const list = this.filterTableDataEnd
          this.filterTableDataEnd = []
          list.forEach((value, index) => {
            if (value.notice_title) {
              if (value.notice_title.indexOf(this.searchName) >= 0) {
                this.filterTableDataEnd.push(value)
              }
            }
            if (value.created_by) {
              if (value.created_by.indexOf(this.searchName) >= 0) {
                this.filterTableDataEnd.push(value)
              }
            }
          })
          // this.page = 1
          this.total = this.filterTableDataEnd.length
          // 渲染表格,根据值
          this.currentChangePage(this.filterTableDataEnd)
        }
      }
    },
    statusSearch() {
      if (this.value === '') {
        this.search()
      } else {
        if (this.filterTableDataEnd.length <= 0 || this.searchName === '') {
          this.filterTableDataEnd = []
          this.all.forEach((value, index) => {
            if ((this.value === '已过期' && value.time_out < this.currentTime) || (this.value === '未过期' && value.time_out >= this.currentTime)) {
              this.filterTableDataEnd.push(value)
            }
          })
          // 页面数据改变重新统计数据数量和当前页
          // this.page = 1
          this.total = this.filterTableDataEnd.length
          // 渲染表格,根据值
          this.currentChangePage(this.filterTableDataEnd)
        } else {
          const list = this.filterTableDataEnd
          this.filterTableDataEnd = []
          list.forEach((value, index) => {
            if ((this.value === '已过期' && value.time_out < this.currentTime) || (this.value === '未过期' && value.time_out >= this.currentTime)) {
              this.filterTableDataEnd.push(value)
            }
          })
          // this.page = 1
          this.total = this.filterTableDataEnd.length
          // 渲染表格,根据值
          this.currentChangePage(this.filterTableDataEnd)
        }
      }
    },
    fetchData() {
      this.listLoading = true
      axios.get('http://118.31.102.1:9200/notice/get?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        this.tableList = response.data.list
        this.currentTime = this.format(new Date(), 'yyyy-MM-dd')
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    format(date, fmt) {
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/notice/getAll').then(res => {
        this.all = res.data
        this.currentTime = this.format(new Date(), 'yyyy-MM-dd')
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
        if (value.notice_title) {
          if (value.notice_title.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.created_by) {
          if (value.created_by.indexOf(this.searchName) >= 0) {
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
    },
    handleTime(row) {
      this.isShowTimeVisible = true
      this.updateTime = Object.assign({}, row)
    },
    deleteUpdate(row) {
      console.log(row)
      this.deleteVisible = true
      this.delete = Object.assign({}, row)
    },
    submitDelete() {
      axios.delete('http://118.31.102.1:9200/notice/delete?noticeId=' + this.delete.id).then(() => {
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
          this.add.created_by = this.name
          axios.post('http://118.31.102.1:9200/notice/add', this.add).then(() => {
            this.isShowAddVisible = false
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
          this.update.modified_by = this.name
          axios.post('http://118.31.102.1:9200/notice/update', this.update).then(() => {
            this.isShowUpdateVisible = false
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
    updateTimeData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateTime.modified_by = this.name
          axios.post('http://118.31.102.1:9200/notice/updateTime', this.updateTime).then(() => {
            this.isShowTimeVisible = false
            this.$notify({
              title: '成功',
              message: '延时成功',
              type: 'success',
              duration: 2000
            })
            this.currentTime = this.format(new Date(), 'yyyy-MM-dd')
            this.reload()
          }).catch((error) => {
            Message.error(error.response.data.message)
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