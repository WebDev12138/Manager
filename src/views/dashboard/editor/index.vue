<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb style="float: left" :image="'http://q00p4epjw.bkt.clouddn.com/'+avatar"> 你的权限:
        <span class="pan-info-roles" :key='item' v-for="item in roles">{{item}}</span>
      </pan-thumb>
      <div class="info-container">
        <span class="display_name">{{name}}</span>
        <span style='font-size:20px;padding-top:20px;display:inline-block;'>欢迎来到Vue后台管理系统</span>
      </div>
    </div>
    <div>
      <img class="emptyGif" :src="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'dashboard-editor',
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  components: { PanThumb },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.emptyGif {
		display: block;
		width: 45%;
		margin: 0 auto;
	}

	.dashboard-editor-container {
		background-color: #e3e3e3;
		min-height: 100vh;
		margin-top: -50px;
		padding: 100px 60px 0px;
		.pan-info-roles {
			font-size: 12px;
			font-weight: 700;
			color: #333;
			display: block;
		}
		.info-container {
			position: relative;
			margin-left: 190px;
			height: 150px;
			line-height: 200px;
			.display_name {
				font-size: 48px;
				line-height: 48px;
				color: #212121;
				position: absolute;
				top: 25px;
			}
		}
	}
</style>
