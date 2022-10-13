import { info } from './user'

export default [
  {
    url: '/manage/base/login',
    timeout: 0,
    method: 'post',
    response: ({ body }: { body: any }) => {
      let result = {}
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
      return {
        code: 0,
        msg: '当前用户信息',
        data: {
          info: info(),
        },
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
]
