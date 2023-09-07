<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchObj.roleName" style="width: 100%" placeholder="角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" />

      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
          <el-button type="warning" icon="el-icon-baseball" size="mini" title="分配权限" @click="showAssignAuth(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 工具条 -->
    <div class="tools-div">
      <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button> -->
      <el-button class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
      <el-button type="success" icon="el-icon-plus" size="mini" :disabled="$hasBP('bnt.sysRole.add') === false" @click="add">添 加</el-button>
    </div>

    <!-- 弹出层 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>
<script>
import api from '@/api/system/sysRole'
export default {
  // 定义数据模型
  data() {
    return {
      loading: true,
      listLoading: true,
      list: [], // 总记录数
      page: 1, // 当前页
      total: 0, // 总记录数
      limit: 10,
      searchObj: {}, // 查询条件
      dialogVisible: false, // 弹出层默认 设置为false
      sysRole: {}, // from 表单数据
      saveBtnDisabled: false,
      multipleSelection: []// 批量删除选中的记录列表
    }
  },
  // 页面渲染成功后获取数据
  created() {
    // debugger
    this.fetchData()
    this.loading = false
    this.listLoading = false
  },
  // 定义方法
  methods: {
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id=' + row.id + '&roleName=' + row.roleName)
    },
    // 当多选触发时调用
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 当选删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        this.multipleSelection.forEach(item => {
          // 循环 遍历 添加元素
          ids.push(item.id)
        })
        return api.batchRemove(ids)
      }).then((res) => {
        this.fetchData()
        this.$message.success(res.message)
      })
    },
    // 查询分页后的数据
    fetchData() {
      api.getPageList(this.page, this.limit, this.searchObj).then(res => {
        this.list = res.data.records
        this.total = res.data.total
      })
    },

    // 删除方法
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })
    },
    // 弹出框
    add() {
      this.dialogVisible = true
    },
    // 添加
    saveData() {
      api.saveRole(this.sysRole).then(res => {
        this.$message.success(res.message || '操作成功')
        this.dialogVisible = false
        // 执行钩子 函数
        this.fetchData(this.page)
      })
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 修改
    updateData() {
      api.update(this.sysRole).then(res => {
        this.$message.success(res.message || '操作成功')
        this.dialogVisible = false
        // 执行钩子 函数
        this.fetchData(this.page)
      })
    },
    // 根据id 查询值
    edit(id) {
      this.dialogVisible = true
      api.getRoleById(id).then(response => {
        this.sysRole = response.data
      })
    },

    // 判断执行对应的条件
    saveOrUpdate() {
      // 判断是否有id
      if (!this.sysRole.id) {
        // this.saveBtnDisabled = true
        this.saveData()
      } else {
        this.updateData()
      }
    }
  }

}
</script>
