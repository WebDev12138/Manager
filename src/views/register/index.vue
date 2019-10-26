<template>
    <div>
        <el-form ref="registerForm" :model="form" :rules="rules" label-width="80px" class="register-box">
          <el-button class="cancel" icon="el-icon-back" size="mini" v-on:click="onCancel"></el-button>
        <h3 class="register-title">注册页面</h3>
        <el-form-item label="用户名" prop="user_name">
            <el-input type="text" placeholder="请输入用户名" v-model="form.user_name" clearable/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="form.password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="sure">
            <el-input type="password" placeholder="请确认密码" v-model="form.sure" show-password/>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
            <el-input type="text" placeholder="请输入真实姓名" v-model="form.real_name" clearable/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input type="text" placeholder="请输入手机号" v-model="form.phone" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input type="text" placeholder="请输入邮箱" v-model="form.email" clearable/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" v-on:click="onSubmit('registerForm')">注册</el-button>
            <el-button type="primary" v-on:click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'Register',
  data() {
    const validatePass = (rule, value, callback) => {
      axios.get('http://localhost:9200/managerUser/userExist?userName=' + value).then(res => {
        if (res.data) {
          callback(new Error('用户名已存在'))
        } else {
          callback()
        }
      })
    }
    const validateSome = (rule, value, callback) => {
      if (value === this.form.password) {
        callback()
      } else {
        callback(new Error('密码不一致'))
      }
    }
    return {
      form: {
        user_name: '',
        password: '',
        sure: '',
        real_name: '',
        phone: '',
        email: ''
      },
      rules: {
        user_name: [
          { required: true, trigger: 'blur', validator: validatePass },
          { required: true, message: '用户名不可为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        sure: [
          { required: true, trigger: 'blur', validator: validateSome },
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '真实姓名不可为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不可为空', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须是 11 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          axios.post('http://localhost:9200/managerUser/register', this.form).then(() => {
            this.$router.push({ path: '/login' })
          }).catch((error) => {
            Message.error(error.response.data.message)
            this.$router.push({ path: '/register' })
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onCancel() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped>
.register-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 0 auto;
    margin-top: 2rem;
    padding: 15px 35px 15px 25px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .register-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }

  .cancel {
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
  }
</style>