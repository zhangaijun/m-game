import request from '../http'
import url from '../url'

export const getList = (params) => {
  return request({
    url: url.GET_INDEX_SALE,
    method: 'get',
    headers: {
      'X-Access-Token': store.state.token,
      'menu-id': store.state.menuId,
    },
    params,
  })
}