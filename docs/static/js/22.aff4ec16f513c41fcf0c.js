webpackJsonp([22],{UGSa:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("BO1k"),l=a.n(i),s=a("woOf"),n=a.n(s),r=a("zL8q"),o=a("mtWM"),d=a.n(o),c={inject:["reload"],data:function(){return{rules:{role:[{required:!0,message:"角色不可为空",trigger:"blur"}]},tableList:[],all:[],listLoading:!0,isShowEditVisible:!1,deleteVisible:!1,temp:{manager_user_id:"",real_name:"",role_id:"",role:""},edit:{manager_user_id:"",real_name:"",role_id:"",role:""},total:0,page:1,pageSize:5,status:[],value:"",searchName:"",filterTableDataEnd:[]}},created:function(){this.fetchData(),this.getAllData()},filters:{statusFilter:function(e){return{1:"success",2:"danger"}[e]}},methods:{search:function(){""===this.searchName?(this.filterTableDataEnd=[],this.fetchData()):this.doFilter()},fetchData:function(){var e=this;this.listLoading=!0,d.a.get("http://118.31.102.1:9200/role/getUserRole?pageNum="+this.page+"&pageSize="+this.pageSize).then(function(t){e.total=t.data.total,e.tableList=t.data.list,e.listLoading=!1}).catch(function(t){r.Message.error(t.response.data.message),e.listLoading=!1}),d.a.get("http://118.31.102.1:9200/role/getAllRole").then(function(t){e.status=t.data}).catch(function(e){r.Message.error(e.response.data.message)})},getAllData:function(){var e=this;d.a.get("http://118.31.102.1:9200/role/getAllUserRole").then(function(t){e.all=t.data}).catch(function(e){r.Message.error(e.response.data.message)})},doFilter:function(){var e=this;this.filterTableDataEnd=[],""!==this.searchName?(this.all.forEach(function(t,a){t.manager_user_id&&t.manager_user_id.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t),t.real_name&&t.real_name.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t),t.role&&t.role.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t)}),this.total=this.filterTableDataEnd.length,this.currentChangePage(this.filterTableDataEnd)):this.fetchData()},clickfun:function(e){console.log(e.target.innerText)},handleUpdate:function(e){this.isShowEditVisible=!0,this.edit=n()({},e),console.log(e)},deleteUpdate:function(e){console.log(e),this.deleteVisible=!0,this.temp=n()({},e)},submitDelete:function(){var e=n()({},this.temp);console.log(e),console.log(this.tableList);var t=!0,a=!1,i=void 0;try{for(var s,r=l()(this.tableList);!(t=(s=r.next()).done);t=!0){var o=s.value;if(o.uid===this.temp.uid){var d=this.tableList.indexOf(o);this.tableList.splice(d,1),this.fetchData(),console.log(this.tableList);break}}}catch(e){a=!0,i=e}finally{try{!t&&r.return&&r.return()}finally{if(a)throw i}}this.deleteVisible=!1,this.$notify({title:"成功",message:"删除成功",type:"success",duration:2e3})},handleModifyStatus:function(e,t){this.$message({message:"操作成功",type:"success"}),console.log(e),e.status=t},updateData:function(e){var t=this;console.log("管理员角色更新",this.edit),this.$refs[e].validate(function(e){if(!e)return!1;d.a.post("http://118.31.102.1:9200/role/updateUserRole",{managerId:t.edit.manager_user_id,roleId:t.edit.role_id}).then(function(){t.isShowEditVisible=!1,t.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3}),t.reload()}).catch(function(e){r.Message.error(e.response.data.message),t.deleteVisible=!1})})},handleSizeChange:function(e){this.page=e,console.log(this.page),this.fetchData()},handleCurrentChange:function(e){this.page=e,console.log(this.page),this.filterTableDataEnd.length<=0?this.fetchData():this.currentChangePage(this.filterTableDataEnd)},currentChangePage:function(e){var t=(this.page-1)*this.pageSize,a=this.page*this.pageSize;for(this.tableList=[];t<a;t++)e[t]&&this.tableList.push(e[t])}}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-col",{staticClass:"toolbar",staticStyle:{"padding-bottom":"0px"},attrs:{span:24}},[a("el-form",{attrs:{inline:!0}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"管理员ID,真实姓名,角色",clearable:""},on:{change:e.search},model:{value:e.searchName,callback:function(t){e.searchName=t},expression:"searchName"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.doFilter()}}},[a("i",{staticClass:"el-icon-search"}),e._v("搜索")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableList,border:"","element-loading-text":"拼命加载中"}},[a("el-table-column",{attrs:{prop:"manager_user_id",label:"管理者ID","min-width":"160px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"real_name",label:"真实姓名","min-width":"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"role_id","min-width":"160px",label:"角色ID"}}),e._v(" "),a("el-table-column",{attrs:{prop:"role",label:"角色","min-width":"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"operation",label:"操作 "},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(a){return e.handleUpdate(t.row)}}},[e._v("编辑")])]}}])})],1),e._v(" "),a("el-pagination",{staticStyle:{"text-align":"center"},attrs:{layout:"total, prev, pager, next",background:"","page-size":5,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}),e._v(" "),a("el-dialog",{attrs:{title:"编辑角色",visible:e.isShowEditVisible},on:{"update:visible":function(t){e.isShowEditVisible=t}}},[a("el-form",{ref:"dataForm",attrs:{"label-width":"80px",model:e.edit,rules:e.rules}},[a("el-form-item",{attrs:{label:"管理者ID"}},[a("el-input",{attrs:{hidden:""},model:{value:e.edit.manager_user_id,callback:function(t){e.$set(e.edit,"manager_user_id",t)},expression:"edit.manager_user_id"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"真实姓名"}},[a("el-input",{attrs:{readonly:""},model:{value:e.edit.real_name,callback:function(t){e.$set(e.edit,"real_name",t)},expression:"edit.real_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"角色",prop:"role"},model:{value:e.edit.role_id,callback:function(t){e.$set(e.edit,"role_id",t)},expression:"edit.role_id"}},[a("el-select",{attrs:{placeholder:"角色"},model:{value:e.edit.role_id,callback:function(t){e.$set(e.edit,"role_id",t)},expression:"edit.role_id"}},e._l(e.status,function(e){return a("el-option",{key:e.id,attrs:{label:e.role,value:e.id}})}),1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.isShowEditVisible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{staticClass:"title1",attrs:{type:"primary",loading:e.listLoading},on:{click:function(t){return e.updateData("dataForm")}}},[e._v("确定")])],1)],1)],1)},staticRenderFns:[]},h=a("VU/8")(c,u,!1,null,null,null);t.default=h.exports}});