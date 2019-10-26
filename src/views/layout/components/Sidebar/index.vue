
<template>
    <el-menu
    mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" 
    text-color="#bfcbd9" active-text-color="#409EFF" style="overflow-y :auto">
      <sidebar-item v-for="route in menu" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import axios from 'axios'
import { getToken } from '@/utils/auth' // 验权

export default {
  components: { SidebarItem },
  data() {
    return {
      menu: [],
      roleId: ''
    }
  },
  methods: {
    getNavData() {
      axios.get('http://localhost:9200/role/getRoleIdByManagerId?managerId=' + getToken()).then(response => {
        this.roleId = response.data
        axios.get('http://localhost:9200/navigation/get?roleId=' + this.roleId).then(response => {
          this.menu = response.data
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getNavData()
  }
}
</script>
