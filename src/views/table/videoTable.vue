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
          <el-input placeholder="分区名,视频标题,作者" v-model="searchName" clearable @change="search"></el-input>
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
      <el-table-column prop="partition_name" label="分区名" min-width="65">
      </el-table-column>
      <el-table-column prop="video_title" label="视频标题" min-width="150px">
      </el-table-column>
      <!-- <el-table-column prop="video_describe" min-width="150px" label="视频描述">
      </el-table-column> -->
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
        <el-form-item label="分区名">
          <el-input v-model="detail.partition_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="视频标题">
          <el-input v-model="detail.video_title" readonly></el-input>
        </el-form-item>
        <el-form-item label="视频描述">
          <el-input v-model="detail.video_describe" readonly></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="detail.author" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="detail.created_date" readonly></el-input>
        </el-form-item>
        <el-form-item label="视频">
         <!-- <video-player  class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions">
        </video-player> -->
        <video controls preload="auto" width="100%" :src="'http://q00p4epjw.bkt.clouddn.com/'+this.detail.video_url">
        </video>
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
import { videoPlayer } from 'vue-video-player'
// import videojs from 'video.js'
// import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'

export default {
  components: {
    videoPlayer
    // videojs
  },
  inject: ['reload'],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: 'video/1.mp4', // 路径
          type: 'video/mp4' // 类型
        }],
        poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      tableList: [],
      all: [],
      listLoading: true,
      isShowEditVisible: false,
      deleteVisible: false,
      temp: {
        partition_name: '',
        id: '',
        video_title: '',
        author: '',
        created_date: ''
      },
      detail: {
        partition_name: '',
        id: '',
        video_title: '',
        video_describe: '',
        author: '',
        video_url: '',
        created_date: ''
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
      axios.get('http://118.31.102.1:9200/video/get?pageNum=' + this.page + '&pageSize=' + this.pageSize).then(response => {
        this.total = response.data.total
        this.tableList = response.data.list
        this.listLoading = false
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.listLoading = false
      })
    },
    getAllData() {
      axios.get('http://118.31.102.1:9200/video/getAll').then(res => {
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
        if (value.author) {
          if (value.author.indexOf(this.searchName) >= 0) {
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
      axios.get('http://118.31.102.1:9200/video/getVideoDetail?videoId=' + row.id).then(res => {
        this.detail = Object.assign({}, res.data)
        // this.playerOptions.sources[0].src = this.detail.video_url
        // this.playerOptions.sources[0].type = 'video/'+this.detail.video_url.substring(this.detail.video_url.indexOf('.')+1)
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.isShowEditVisible = false
      })
    },
    deleteUpdate(row) {
      console.log(row)
      this.deleteVisible = true
      this.temp = Object.assign({}, row)
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
      axios.post('http://118.31.102.1:9200/video/pass', { videoId: this.detail.id, createdBy: this.name }).then(() => {
        this.isShowEditVisible = false
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