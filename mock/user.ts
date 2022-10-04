import mock from 'mockjs'

const infoFake = {
  'username|+1': '@name',
  'nickname': '@last',
  'status': 1,
  avatar(): any {
    return mock.Random.image('64x64', mock.Random.color(), this.nickname)
  },
  'remark': '@cparagraph(1, 3)',
  'email': '@email',
  'roles_name': ['管理员'],
  'created_at': '@date("yyyy-MM-dd HH:mm:ss")',
  'updated_at': '@datetime',
}

export function info() {
  return mock.mock(infoFake)
}

function createLists(v: any) {
  const { query } = v
  return {
    code: 200,
    msg: '用户列表',
    data: {
      v,
      page: {
        total: 100,
        curpage: query.page,
      },
      [`items|${query.pagesize}`]: [
        {
          'id|+1': query.pagesize * (query.page - 1) + 1,
          ...infoFake,
        },
      ],
    },
  }
}

function UseriInfo(v: any) {
  const { query } = v
  return {
    code: 200,
    msg: '用户详情',
    data: {
      id: query.id,
      ...info(),
    },
  }
}

export default [
  {
    url: '/manage/user/index',
    method: 'get',
    response(v: any) {
      const { query } = v
      if (query.id)
        return UseriInfo(v)
      return createLists(v)
    },
  },
  {
    url: '/manage/user/index',
    method: 'put',
    timeout: 1000,
    response() {
      return {
        code: 0,
        msg: '更新完成',
        data: {},
      }
    },
  },
  {
    url: '/manage/user/index',
    method: 'post',
    timeout: 1000,
    response() {
      return {
        code: 0,
        msg: '添加完成',
        data: {},
      }
    },
  },
  {
    url: '/manage/user/index',
    method: 'delete',
    statusCode: 200,
    timeout: 1000,
    response() {
      return {
        code: 0,
        msg: '删除完成',
        data: {},
      }
    },
  },
  {
    url: '/manage/user/avatar.go',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: 'ok',
        data: {
          avatar: mock.Random.image('64x64', mock.Random.color(), 'new'),
        },
      }
    },
  },
  {
    url: '/_mock/lists',
    method: 'get',
    response: createLists,
  },
]
