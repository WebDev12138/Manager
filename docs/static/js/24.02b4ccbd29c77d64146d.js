webpackJsonp([24],{"Gs1+":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("woOf"),i=a.n(l),s=a("mtWM"),n=a.n(s),o=a("zL8q"),r={inject:["reload"],data:function(){return{addRules:{label:[{required:!0,message:"标签不可为空",trigger:"blur"},{min:1,max:10,message:"长度在 1 到 10 个字符",trigger:"blur"}],type:[{required:!0,message:"类型不可为空",trigger:"blur"}]},updateRules:{label:[{required:!0,message:"标签不可为空",trigger:"blur"},{min:1,max:10,message:"长度在 1 到 10 个字符",trigger:"blur"}],type:[{required:!0,message:"类型不可为空",trigger:"blur"}]},tableList:[],all:[],listLoading:!0,isShowAddVisible:!1,isShowUpdateVisible:!1,deleteVisible:!1,temp:{id:"",label:"",type:""},add:{label:"",type:""},update:{id:"",label:"",type:""},delete:{id:"",label:"",type:""},total:0,page:1,pageSize:5,status:[{statusId:0,label:"用户标签"},{statusId:1,label:"视频标签"}],value:"",searchName:"",filterTableDataEnd:[]}},created:function(){this.fetchData(),this.getAllData()},filters:{statusFilter:function(e){return{1:"success",2:"danger"}[e]}},methods:{search:function(){""===this.searchName?(this.filterTableDataEnd=[],this.fetchData()):this.doFilter()},fetchData:function(){var e=this;this.listLoading=!0,n.a.get("http://118.31.102.1:9200/label/?pageNum="+this.page+"&pageSize="+this.pageSize).then(function(t){console.log(t);for(var a=t.data.list,l=0;l<a.length;l++)a[l].type="0"===a[l].type?"用户标签":"视频标签";console.log(a),e.tableList=a,e.total=t.data.total,e.listLoading=!1}).catch(function(t){o.Message.error(t.response.data.message),e.listLoading=!1})},getAllData:function(){var e=this;n.a.get("http://118.31.102.1:9200/label/getAll").then(function(t){for(var a=t.data,l=0;l<a.length;l++)a[l].type="0"===a[l].type?"用户标签":"视频标签";e.all=a}).catch(function(e){o.Message.error(e.response.data.message)})},doFilter:function(){var e=this;this.filterTableDataEnd=[],""!==this.searchName?(this.all.forEach(function(t,a){t.id&&t.id.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t),t.label&&t.label.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t),t.type&&t.type.indexOf(e.searchName)>=0&&e.filterTableDataEnd.push(t)}),this.total=this.filterTableDataEnd.length,this.currentChangePage(this.filterTableDataEnd)):this.fetchData()},clickfun:function(e){console.log(e.target.innerText)},handleUpdate:function(e){this.isShowUpdateVisible=!0,this.update=i()({},e),console.log(e),console.log("标签更新",this.update)},deleteUpdate:function(e){console.log(e),this.deleteVisible=!0,this.delete=i()({},e)},submitDelete:function(){var e=this;console.log("标签删除",this.delete),n.a.delete("http://118.31.102.1:9200/label/delete?labelId="+this.delete.id).then(function(){e.deleteVisible=!1,e.$notify({title:"成功",message:"删除成功",type:"success",duration:2e3}),e.reload()}).catch(function(t){o.Message.error(t.response.data.message),e.deleteVisible=!1})},handleModifyStatus:function(e,t){this.$message({message:"操作成功",type:"success"}),console.log(e),e.status=t},addData:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;n.a.post("http://118.31.102.1:9200/label/add",t.add).then(function(){t.isShowEditVisible=!1,t.$notify({title:"成功",message:"新增成功",type:"success",duration:2e3}),t.reload()}).catch(function(e){o.Message.error(e.response.data.message),t.deleteVisible=!1})})},updateData:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;n.a.post("http://118.31.102.1:9200/label/update",{id:t.update.id,label:t.update.label,type:"用户标签"===t.update.type?"0":"视频标签"===t.update.type?"1":t.update.type}).then(function(){t.isShowEditVisible=!1,t.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3}),t.reload()}).catch(function(e){o.Message.error(e.response.data.message),t.deleteVisible=!1})})},handleSizeChange:function(e){this.page=e,console.log(this.page),this.fetchData()},handleCurrentChange:function(e){this.page=e,console.log(this.page),this.filterTableDataEnd.length<=0?this.fetchData():this.currentChangePage(this.filterTableDataEnd)},currentChangePage:function(e){var t=(this.page-1)*this.pageSize,a=this.page*this.pageSize;for(this.tableList=[];t<a;t++)e[t]&&this.tableList.push(e[t])}}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-col",{staticClass:"toolbar",staticStyle:{"padding-bottom":"0px"},attrs:{span:24}},[a("el-form",{attrs:{inline:!0}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"ID,标签,类型",clearable:""},on:{change:e.search},model:{value:e.searchName,callback:function(t){e.searchName=t},expression:"searchName"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.doFilter()}}},[a("i",{staticClass:"el-icon-search"}),e._v("搜索")])],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.isShowAddVisible=!0}}},[e._v("新增")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableList,border:"","element-loading-text":"拼命加载中"}},[a("el-table-column",{attrs:{prop:"id",label:"ID","min-width":"200px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"label","min-width":"150px",label:"标签"}}),e._v(" "),a("el-table-column",{attrs:{prop:"type","min-width":"150px",label:"类型"}}),e._v(" "),a("el-table-column",{attrs:{prop:"operation",label:"操作 "},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(a){return e.handleUpdate(t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(a){return e.deleteUpdate(t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("el-pagination",{staticStyle:{"text-align":"center"},attrs:{layout:"total, prev, pager, next",background:"","page-size":5,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}),e._v(" "),a("el-dialog",{attrs:{title:"新增标签",visible:e.isShowAddVisible},on:{"update:visible":function(t){e.isShowAddVisible=t}}},[a("el-form",{ref:"addForm",attrs:{"label-width":"80px",model:e.add,rules:e.addRules}},[a("el-form-item",{attrs:{label:"标签",prop:"label"}},[a("el-input",{model:{value:e.add.label,callback:function(t){e.$set(e.add,"label",t)},expression:"add.label"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"类型",prop:"type"},model:{value:e.add.type,callback:function(t){e.$set(e.add,"type",t)},expression:"add.type"}},[a("el-select",{attrs:{placeholder:"标签类型"},model:{value:e.add.type,callback:function(t){e.$set(e.add,"type",t)},expression:"add.type"}},e._l(e.status,function(e){return a("el-option",{key:e.statusId,attrs:{label:e.label,value:e.statusId}})}),1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.isShowAddVisible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{staticClass:"title1",attrs:{type:"primary",loading:e.listLoading},on:{click:function(t){return e.addData("addForm")}}},[e._v("确定")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:"编辑标签",visible:e.isShowUpdateVisible},on:{"update:visible":function(t){e.isShowUpdateVisible=t}}},[a("el-form",{ref:"updateForm",attrs:{"label-width":"80px",model:e.update,rules:e.updateRules}},[a("el-form-item",{attrs:{label:"ID",hidden:""}},[a("el-input",{model:{value:e.update.id,callback:function(t){e.$set(e.update,"id",t)},expression:"update.id"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"标签",prop:"label"}},[a("el-input",{model:{value:e.update.label,callback:function(t){e.$set(e.update,"label",t)},expression:"update.label"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"类型",prop:"type"},model:{value:e.update.type,callback:function(t){e.$set(e.update,"type",t)},expression:"update.type"}},[a("el-select",{attrs:{placeholder:"标签类型"},model:{value:e.update.type,callback:function(t){e.$set(e.update,"type",t)},expression:"update.type"}},e._l(e.status,function(e){return a("el-option",{key:e.statusId,attrs:{label:e.label,value:e.statusId}})}),1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.isShowUpdateVisible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{staticClass:"title1",attrs:{type:"primary",loading:e.listLoading},on:{click:function(t){return e.updateData("updateForm")}}},[e._v("确定")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:"删除",visible:e.deleteVisible,width:"30%"},on:{"update:visible":function(t){e.deleteVisible=t}}},[a("span",[e._v("确认删除吗")]),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.deleteVisible=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.submitDelete}},[e._v("确 定")])],1)])],1)},staticRenderFns:[]},u=a("VU/8")(r,d,!1,null,null,null);t.default=u.exports}});