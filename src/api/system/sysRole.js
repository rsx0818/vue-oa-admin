/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

export default {
// 获取角色分页列表
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      //   如果是普通 对象参数 params: 对象参数名称
      // 如果是 json 格式 data: 对象参数名称
      params: searchObj
    })
  },
  saveRole(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  getRoleById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  update(sysRole) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: sysRole
    })
  },
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  },
  getRoles(adminId) {
    return request({
      url: `${api_name}/toAssign/${adminId}`,
      method: 'get'
    })
  },

  assignRoles(assginRoleVo) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      data: assginRoleVo
    })
  }

}

