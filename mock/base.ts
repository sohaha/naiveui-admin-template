import { info } from './user'

let username = ''
export default [
  {
    url: '/manage/base/login',
    timeout: 0,
    method: 'post',
    response: ({ body }: { body: any }) => {
      let result = {}
      username = body.username || ''
      switch (body?.password) {
        case '123456':
          result = {
            code: 0,
            msg: '登录成功',
            data: {
              token: '@string',
              ...info(),
            },
          }
          break
        default:
          result = {
            code: 400,
            msg: '用户名/密码错误',
          }
      }
      return result
    },
  },
  {
    url: '/manage/base/logout',
    method: 'post',
    response: () => {
      return { code: 0, msg: '退出成功' }
    },
  },
  {
    url: '/manage/base/me',
    method: 'get',
    statusCode: 200,
    timeout: 0,
    response: () => {
      const data: any = {
        info: info(),
        alone_menu: [
          {
            title: '追加菜单',
            redirect: '/example/readme',
          },
        ],
      }

      if (username === 'manage')
        data.permission = ['admin']
      else
        data.permission = ['user']

      data.avatar = 'data:image/svg+xml,%3Csvg viewBox=\'0 0 36 36\' fill=\'none\' role=\'img\' xmlns=\'http://www.w3.org/2000/svg\' width=\'128\' height=\'128\'%3E%3Ctitle%3EMary Roebling%3C/title%3E%3Cmask id=\'mask__beam\' maskUnits=\'userSpaceOnUse\' x=\'0\' y=\'0\' width=\'36\' height=\'36\'%3E%3Crect width=\'36\' height=\'36\' fill=\'%23FFFFFF\'%3E%3C/rect%3E%3C/mask%3E%3Cg mask=\'url(%23mask__beam)\'%3E%3Crect width=\'36\' height=\'36\' fill=\'%23f0f0d8\'%3E%3C/rect%3E%3Crect x=\'0\' y=\'0\' width=\'36\' height=\'36\' transform=\'translate(5 -1) rotate(155 18 18) scale(1.2)\' fill=\'%23000000\' rx=\'6\'%3E%3C/rect%3E%3Cg transform=\'translate(3 -4) rotate(-5 18 18)\'%3E%3Cpath d=\'M15 21c2 1 4 1 6 0\' stroke=\'%23FFFFFF\' fill=\'none\' stroke-linecap=\'round\'%3E%3C/path%3E%3Crect x=\'14\' y=\'14\' width=\'1.5\' height=\'2\' rx=\'1\' stroke=\'none\' fill=\'%23FFFFFF\'%3E%3C/rect%3E%3Crect x=\'20\' y=\'14\' width=\'1.5\' height=\'2\' rx=\'1\' stroke=\'none\' fill=\'%23FFFFFF\'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
      return {
        code: 0,
        msg: '当前用户信息',
        data,
      }
    },
  },
  {
    url: '/manage/base/message',
    method: 'get',
    timeout: 0,
    response: () => {
      return { code: 0, msg: '获取未读信息', data: { unread: 100 } }
    },
  },
  {
    url: '/manage/base/password',
    method: 'put',
    response: () => {
      return { code: 0, msg: '更新成功' }
    },
  },
  {
    url: '/manage/base/logs',
    method: 'get',
    response: (v) => {
      const { query } = v
      return {
        code: 0,
        data: {
          page: {
            total: 100,
            curpage: query.page,
          },
          [`items|${query.pagesize}`]: [
            {
              'id|+1': query.pagesize * (query.page - 1) + 1,
              ...logsFake(),
            },
          ],
        },
      }
    },
  },
]

const logsFake = () => {
  return {
    _id: '@id',
    action: '@pick([\'登录\', \'退出\', \'添加\', \'删除\', \'修改\'])',
    os: '@pick(["Windows", "MacOS", "android"])',
    path: '@url',
    result: '@pick([1,2])',
    nickname: '@cname',
    module: '@pick(["用户管理", "角色管理", "菜单管理", "日志管理", "系统设置"])',
    os_version: '',
    method: '@pick(["GET", "POST", "PUT", "DELETE"])',
    browser: 'Edge',
    browser_version: '108.0.1462.46',
    ip: '@ip',
    ip_region: '@county',
    roles_name: ['管理员'],
    created_at: '@date("yyyy-MM-dd HH:mm:ss")',
    updated_at: '@datetime',
  }
}
