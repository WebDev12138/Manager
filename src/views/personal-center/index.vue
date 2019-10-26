<template>
    <div style="overflow: auto">
        <div style="text-align: right;margin: 1rem 2rem 0.5rem 0rem;">
            <el-button class="button" size="small" type="primary" @click="handleUpdateInfo">修改信息</el-button>
            <el-button class="button" size="small" type="primary" @click="handleUpdatePassword">修改密码</el-button>
        </div>
        <div class="userInfo">
            <div class="avator">
                <img v-bind:src="'http://localhost:9200/managerUserInfo/getPicture?fileName='+this.info.picture">
            </div>
            <div class="info">
                <div class="basic">
                    真实姓名：<label v-text="this.info.real_name"/>
                    性别：<label v-text="this.info.sex"/>
                </div>
                <div class="ext">
                    手机号：<label v-text="this.info.phone"/>
                    邮箱：<label v-text="this.info.email"/>
                </div>
            </div>
        </div>

        <el-dialog title="修改信息" :visible.sync="isShowUpdateInfo">
            <el-form label-width="80px" :model="userinfo" ref="updateInfoForm" :rules="userInfoRules">
              <el-form-item label="ID" hidden>
                <el-input v-model="userinfo.ID"></el-input>
              </el-form-item>
                <el-form-item label="头像" prop="picture">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        v-model="userinfo.picture"
                        accept="image/jpeg,image/png">
                        <img v-if="this.userinfo.picture" :src="this.userinfo.picture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="真实姓名" prop="real_name">
                    <el-input v-model="userinfo.real_name" readonly></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="userinfo.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                        <el-radio label="保密"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userinfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userinfo.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowUpdateInfo = false">取消</el-button>
                <el-button type="primary" :loading="listLoading" @click="updateUserInfo" class="title1">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="isShowUpdatePassword">
            <el-form label-width="80px" :model="passwordinfo" ref="updatePasswordForm" :rules="passwordInfoRules">
                <el-form-item label="用户名" prop="user_name">
                    <el-input v-model="passwordinfo.user_name" readonly></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="passwordinfo.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passwordinfo.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="sure">
                    <el-input type="password" v-model="passwordinfo.sure"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowUpdatePassword = false">取消</el-button>
                <el-button type="primary" :loading="listLoading" @click="updatePassword" class="title1">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

export default {
  inject: ['reload'],
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.info.password) {
        callback(new Error('旧密码错误'))
      } else {
        callback()
      }
    }
    const validateSome = (rule, value, callback) => {
      if (value === this.form.password) {
        callback()
      } else {
        callback(new Error('密码不一致'))
      }
    }
    return {
      listLoading: false,
      isShowUpdateInfo: false,
      isShowUpdatePassword: false,
      info: {
        ID: '',
        user_name: '',
        real_name: '',
        password: '',
        sex: '',
        phone: '',
        email: '',
        picture: ''
      },
      userinfo: {
        ID: '',
        real_name: '',
        sex: '',
        phone: '',
        email: '',
        file: '',
        picture: ''
      },
      passwordinfo: {
        ID: '',
        user_name: '',
        oldPassword: '',
        newPassword: '',
        sure: ''
      },
      userInfoRules: {
        real_name: [
          { required: true, message: '真实姓名不可为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不可为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不可为空', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须是 11 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不可为空', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '头像不可为空', trigger: 'blur' }
        ]
      },
      passwordInfoRules: {
        oldPassword: [
          { required: true, trigger: 'blur', validator: validatePassword },
          { required: true, message: '旧密码不可为空', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不可为空', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        sure: [
          { required: true, trigger: 'blur', validator: validateSome },
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getInfo() {
      axios.get('http://localhost:9200/managerUserInfo/getUserInfo?userId=' + getToken()).then(res => {
        const info = res.data
        if (info.sex === '' || info.sex === null) {
          info.sex = '保密'
        }
        this.info = info
      }).catch((error) => {
        Message.error(error.response.data.message)
        this.deleteVisible = false
      })
    },
    handleUpdateInfo() {
      this.isShowUpdateInfo = true
      this.userinfo = Object.assign({}, this.info)
      if (this.userinfo.picture !== '') {
        this.userinfo.picture = 'http://localhost:9200/managerUserInfo/getPicture?fileName=' + this.userinfo.picture
      }
    },
    handleUpdatePassword() {
      this.isShowUpdatePassword = true
      this.passwordinfo = Object.assign({}, this.info)
    },
    updateUserInfo() {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$refs.updateInfoForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.userinfo.sex === '保密') {
            this.userinfo.sex = ''
          }
          const param = new FormData()
          param.append('ID', this.userinfo.id)
          param.append('real_name', this.userinfo.real_name)
          param.append('sex', this.userinfo.sex)
          param.append('phone', this.userinfo.phone)
          param.append('email', this.userinfo.email)
          if (this.userinfo.file) {
            param.append('file', this.userinfo.file)
          }
          axios.post('http://localhost:9200/managerUserInfo/updateUserInfo', param, config).then(() => {
            this.isShowUpdateInfo = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('GetInfo').then(() => {
              this.reload()
            })
          }).catch((error) => {
            Message.error(error.response.data.message)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    updatePassword() {
      this.$refs.updatePasswordForm.validate(valid => {
        if (valid) {
          axios.post('http://localhost:9200/managerUserInfo/updatePassword', this.passwordinfo).then(() => {
            this.isShowUpdatePassword = false
            this.$notify({
              title: '成功',
              message: '修改密码成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('LogOut').then(() => {
              location.reload()
            })
          }).catch((error) => {
            Message.error(error.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      // var fr = new FileReader()
      // this.userinfo.file = URL.createObjectURL(file.raw);
      // this.userinfo.file = fr.readAsDataURL(file.raw)
      this.userinfo.file = file.raw
      this.userinfo.picture = file.url
    },
    beforeAvatarUpload(file) {
      const isJPGOrPNG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG和PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGOrPNG && isLt2M
    }
  },
  created() {
    this.getInfo()
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.button{
    margin-top: 1rem;
}
.userInfo{
    margin: 0.4rem 2rem 0.4rem 2rem;
    border: 1px solid #DCDFE6;
    box-shadow: 0 0 25px #909399;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
}
.basic{
    font-size: 1.6rem;
    margin: 1rem;
}
.ext{
    font-size: 1.6rem;
    margin: 1rem;
}
.avator{
    width: 10rem;
    height: 10rem;
    margin: 2rem 2rem 2rem 8rem;
    display: inline-block;
    vertical-align: top;
}
.info{
    display: inline-block;
    vertical-align: top;
    margin: 5rem 0rem 0rem 2rem;
}
img{
    width: 10rem;
    height: 10rem;
}
label{
    margin-right: 2rem;
}
</style>