import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from 'axios'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        axios.post('http://118.31.102.1:9200/managerUser/login', userInfo).then(response => {
          const data = response.data
          setToken(data.id)
          commit('SET_TOKEN', data.id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios.get('http://118.31.102.1:9200/managerUserInfo/getUserInfo?userId=' + state.token).then(response => {
          const data = response.data
          commit('SET_NAME', data.real_name)
          commit('SET_AVATAR', data.picture)
          axios.get('http://118.31.102.1:9200/role/getRoleByManagerId?managerId=' + state.token).then(res => {
            commit('SET_ROLES', res.data)
          })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // // 获取用户权限
    // GetRole({commit, state}) {

    // }

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
