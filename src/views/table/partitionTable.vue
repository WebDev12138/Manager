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
          <el-input placeholder="分区ID,分区名" v-model="searchName" clearable @change="search"></el-input>
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
      <el-table-column prop="partition_name" min-width="150px" label="分区名">
      </el-table-column>
      <!-- <el-table-column prop="title" min-width="150px" label="标题">
      </el-table-column>
      <el-table-column prop="number" label="阅读数"  width="65">
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


    <!-- 新增分区 -->
    <el-dialog title="新增分区" :visible.sync="isShowAddVisible">
      <el-form label-width="80px" :model="add" :rules="addRules" ref="addForm">
        <el-form-item label="分区名" prop="partition_name">
          <el-input v-model="add.partition_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="addData('addForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑分区" :visible.sync="isShowUpdateVisible">
      <el-form label-width="80px" :model="update" :rules="updateRules" ref="updateForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="update.id"></el-input>
        </el-form-item>
        <el-form-item label="分区名" prop="partition_name">
          <el-input v-model="update.partition_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData('updateForm')" class="title1">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分区视频" :visible.sync="isShowChangeVisible">
      <el-table :data="video" v-loading="Loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="partition_name" label="分区名" min-width="65">
      </el-table-column>
      <el-table-column prop="video_title" label="视频标题" min-width="100px">
      </el-table-column>
      <el-table-column prop="video_describe" min-width="120px" label="视频描述">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="65">
      </el-table-column>
      <el-table-column prop="created_date" label="创建时间" min-width="90px">
      </el-table-column>
      <el-table-column label="操作 ">
        <template slot-scope="scope" >
          <el-button size="small" type="primary"  @click="handleChange(scope.row)">编辑分区</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next"
                    background
                    :page-size="5"
                    @size-change="handleVideoSizeChange"
                    :total="videoTotal"
                    @current-change="handleVideoCurrentChange"
                    style="text-align:center;">
    </el-pagination>
    </el-dialog>

    <el-dialog title="编辑视频分区" :visible.sync="isShowChangeEditVisible">
      <el-form label-width="80px" :model="changeEdit" :rules="changeEditRules" ref="changeEditForm">
        <el-form-item label="ID" hidden>
          <el-input v-model="changeEdit.id"></el-input>
        </el-form-item>
        <el-form-item label="视频标题">
          <el-input v-model="changeEdit.video_title" readonly></el-input>
        </el-form-item>
        <el-form-item label="分区名" prop="partition_name">
          <el-select v-model="changeEdit.partition_name" placeholder="分区">
            <el-option v-for="item in tableList"
                       :label="item.partition_name"
                       :value="item.id"
                       :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateVideoData('changeEditForm')" class="title1">确定</el-button>
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
        partition_name: [
          { required: true, message: '分区名不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      updateRules: {
        partition_name: [
          { required: true, message: '分区名不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      changeEditRules: {
        partition_name: [
          { required: true, message: '分区名不可为空', trigger: 'blur' }
        ]
      },
      tableList: [],
      all: [],
      listLoading: true,
      Loading: true,
      isShowAddVisible: false,
      isShowUpdateVisible: false,
      isShowChangeVisible: false,
      isShowChangeEditVisible: false,
      deleteVisible: false,
      video: [],
      add: {
        partition_name: ''
      },
      update: {
        id: '',
        partition_name: ''
      },
      delete: {
        id: ''
      },
      changeEdit: {
        id: '',
        video_title: '',
        partition_name: '',
        partitionId: ''
      },
      rowId: '',
      total: 0,
      page: 1,
      pageSize: 5,
      videoPage: 1,
      videoPageSize: 5,
      videoTotal: 0,
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
      axios.get('http://118.31.102.1:9200/partition/?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        this.tableList = response.data.list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/partition/getAll').then(res => {
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
        if (value.partition_name) {
          if (value.partition_name.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        console.log(this.filterTableDataEnd)
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
    VideoData() {
      axios.get('http://118.31.102.1:9200/partition/getVideoInDeletePartition?partitionId=' + this.rowId + '&pageNum=' + this.videoPage + '&pageSize=' + this.videoPageSize).then(res => {
        this.videoTotal = res.data.total
        this.video = res.data.list
        this.Loading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.Loading = false
      })
    },
    deleteUpdate(row) {
      axios.get('http://118.31.102.1:9200/partition/getVideoNumber?partitionId=' + row.id).then(res => {
        if (res.data > 0) {
          this.isShowChangeVisible = true
          this.Loading = true
          this.rowId = row.id
          this.VideoData()
        } else {
          this.deleteVisible = true
          this.delete = Object.assign({}, row)
        }
      }).catch((error) => {
        Message.error(error.response.data.message)
      })
    },
    submitDelete() {
      axios.delete('http://118.31.102.1:9200/partition/delete?partitionId=' + this.delete.id).then(() => {
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
    handleCancel() {
      this.isShowChangeEditVisible = false
      this.isShowChangeVisible = true
    },
    handleChange(row) {
      this.isShowChangeVisible = false
      this.isShowChangeEditVisible = true
      this.changeEdit = Object.assign({}, row)
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
          axios.post('http://118.31.102.1:9200/partition/add', this.add).then(() => {
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
          })
        } else {
          return false
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('http://118.31.102.1:9200/partition/update', this.update).then(() => {
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
          })
        } else {
          return false
        }
      })
    },
    updateVideoData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('http://118.31.102.1:9200/partition/editVideo', { partitionId: this.changeEdit.partition_name, videoId: this.changeEdit.id }).then(() => {
            this.isShowChangeEditVisible = false
            this.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 2000
            })
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
    handleVideoSizeChange(val) {
      this.videoPage = val
      console.log(this.videoPage)
      this.VideoData()
    },
    handleVideoCurrentChange(val) {
      this.videoPage = val
      console.log(this.videoPage)
      this.VideoData()
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