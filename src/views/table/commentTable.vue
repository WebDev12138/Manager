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
          <el-input placeholder="分区,视频标题,视频描述,作者" v-model="searchName"  clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="partition_name" label="分区名" min-width="65">
      </el-table-column>
      <el-table-column prop="video_title" label="视频标题" min-width="150px">
      </el-table-column>
      <el-table-column prop="video_describe" min-width="150px" label="视频描述">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="65">
      </el-table-column>
      <el-table-column prop="created_date" label="创建时间" min-width="110px">
      </el-table-column>
      <!-- <el-table-column  label="状态" width="120" >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag size="small"  :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 2">禁用</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="operation" label="操作 ">
        <template slot-scope="scope" >
         <el-button size="small" type="primary"  @click="showComment(scope.row)">查看评论</el-button>
         <!-- <el-button v-if="scope.row.status!='2'" size="mini" type="success" @click="handleModifyStatus(scope.row,'2')">启用
          </el-button>
          <el-button v-if="scope.row.status!='1'" size="mini" @click="handleModifyStatus(scope.row,'1')">禁用
          </el-button>
          <el-button size="small" type="danger" @click="deleteUpdate(scope.row)">删除</el-button> -->
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


    <!-- 评论 -->
    <el-dialog title="评论" :visible.sync="isShowEditVisible">
      <el-table
      :data="comment"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-if="props.row.children">
            <div class="two-huifu" v-if="props.row.children.length > 0">    
              <ul class="box twobox" v-for="reply in props.row.children" :key="reply.id">
                <!-- <li class="left">
                    <img src="../../../static/images/touxiang.png" alt="">
                </li> -->
                <li class="right">
                  <div>
                    <span class="author">{{reply.author}}:</span>
                    <span class="content">{{reply.comment_content}}</span>
                    <div class="huifu-btn">
                      <el-button v-if="reply.forbidden==='1' && props.row.forbidden==='0'" size="mini" type="success" @click="handleModifyStatus(reply,'0')">启用
                      </el-button>
                      <el-button v-if="reply.forbidden==='0'" size="mini" @click="handleModifyStatus(reply,'1')">禁用
                      </el-button>
                    </div>
                  </div>
                  <div>
                    <span class="comments">点赞数:{{reply.comments}}</span>
                    <span class="time">{{reply.created_date}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="props.row.children.length === 0">
            <span class="noContent">暂无评论</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="comment_content" label="评论内容" min-width="150px">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="65">
      </el-table-column>
      <el-table-column prop="comments" label="点赞数" min-width="65">
      </el-table-column>
      <el-table-column prop="created_date" label="创建时间" min-width="80px">
      </el-table-column>
      <el-table-column label="操作 ">
        <template slot-scope="scope" >
         <el-button v-if="scope.row.forbidden==='1'" size="mini" type="success" @click="handleModifyStatus(scope.row,'0')">启用
          </el-button>
          <el-button v-if="scope.row.forbidden==='0'" size="mini" @click="handleModifyStatus(scope.row,'1')">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next"
                    background
                    :page-size="5"
                    @size-change="handleCommentSizeChange"
                    :total="commentTotal"
                    @current-change="handleCommentCurrentChange"
                    style="text-align:center;">
    </el-pagination>
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
      tableList: [],
      all: [],
      listLoading: true,
      commentLoading: true,
      isShowEditVisible: false,
      deleteVisible: false,
      comment: [],
      rowId: '',
      total: 0,
      page: 1,
      commentTotal: 0,
      commentPage: 1,
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
      axios.get('http://118.31.102.1:9200/comment/getVideo?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        this.tableList = response.data.list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/comment/getAll').then(res => {
        this.all = res.data.list
      }).catch((error) => {
        Message.error(error.response.data.message)
      })
    },
    doFilter() {
      this.filterTableDataEnd = []
      if (this.searchName === '') {
        // this.$message.warning('查询条件不能为空！')
        return
      }
      this.all.forEach((value, index) => {
        if (value.partition_name) {
          if (value.partition_name.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.video_title) {
          if (value.video_title.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.video_describe) {
          if (value.video_describe.indexOf(this.searchName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
        if (value.author) {
          if (value.author.indexOf(this.searchName) >= 0) {
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
    CommentData() {
      axios.get('http://118.31.102.1:9200/comment/getCommentNumber?videoId=' + this.rowId).then(res => {
        this.commentTotal = res.data
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.commentLoading = false
      })
      axios.get('http://118.31.102.1:9200/comment/getComment?videoId=' + this.rowId + '&pageNum=' + this.commentPage + '&pageSize=' + this.pageSize).then(res => {
        this.comment = res.data.list
        this.commentLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.commentLoading = false
      })
    },
    showComment(row) {
      this.isShowEditVisible = true
      this.commentLoading = true
      this.rowId = row.id
      this.CommentData()
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
      axios.post('http://118.31.102.1:9200/comment/manage', { commentId: row.id, forbidden: status }).then(() => {
        row.forbidden = status
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        if (row.children && row.children.length > 0) {
          for (let index = 0; index < row.children.length; index++) {
            row.children[index].forbidden = status
          }
        }
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
    },
    updateData() {
      this.isShowEditVisible = false
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
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
    handleCommentSizeChange(val) {
      this.commentPage = val
      console.log(this.commentPage)
      this.CommentData()
    },
    handleCommentCurrentChange(val) {
      this.commentPage = val
      console.log(this.commentPage)
      this.CommentData()
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

<style scoped lang="scss" type="text/scss">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .two-huifu {
      margin: 10px 0;
      .right {
          width: 90%;
      }
  }
  .twobox {
      overflow: hidden;
      margin-left: 32px;
      background: #eaeaec;
      padding: 10px;
      border-bottom: solid 1px #d9d9d9;
      margin-bottom: 0
  }
  .twobox:last-child {
      border: 0
  }
  .huifu-btn {
      float: right;
  }
  .time {color: #808080;font-size: 12px;}
  .comments {float: right; color: #808080;font-size: 12px;}
  .noContent {color: #808080;font-size: 12px;}
  .dyn-huifu {
      padding-top: 15px;
      border-top: solid 1px #d9d9d9;
  }
</style>
