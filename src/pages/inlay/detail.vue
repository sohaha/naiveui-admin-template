<script lang="ts" setup>
import { NUpload, uploadDark } from 'naive-ui'

const { config, setItems, setValues } = useDataForm({
  labelPlacement: 'top',
  size: 'medium',
})

const message = useMessage()
const user = userStore()
const { run: reload } = apiMe({
  onSuccess(data: any) {
    user.setUset(data.data?.info ?? {})
  },
})
setItems({
  _avatar: {
    component: 'div',
    render: (v) => {
      const p: any = {
        'max': 1,
        'listType': 'image-card',
        'onUpdate:file-list': async (r: any[]) => {
          if (r.length <= 0) {
            v.value.avatar = ''
            return
          }

          try {
            const res = await apiUploadAvatar(r[0].file)
            v.value.avatar = res.data[0]?.path

            message.success('头像更新成功')
            reload()
          }
          catch (err) {
            message.error('头像更新失败')
          }
        },
      }
      if (v.value.avatar) {
        const url = fixAvatar(v.value.avatar)
        p.fileList = [{ status: 'finished', name: 'avatar', id: url, url }]
      }

      else { p.fileList = [] }
      return h(NUpload, p)
    },
  },
  avatar: {
    label: '头像',
    component: 'NInput',
    required: true,
  },
  nickname: {
    label: '昵称',
    component: 'NInput',
    required: true,

  },
  created_at: {
    label: '创建时间',
    component: 'NInput',
    disabled: true,
  },
  remark: {
    label: '备注',
    component: 'NInput',
    disabled: true,
    props: {
      type: 'textarea',
      placeholder: '',
      autosize: {
        minRows: 3,
      },
    },
  },
})

setValues(user.getUser)

const { run: onSubmit } = useRequest(apiMeUpdate, {
  manual: true,
  onSuccess() {
    message.success('个人信息更新成功')
    reload()
  },
})
</script>

<template>
  <Card>
    <DataForm label-placement="top" v-bind="config" @submit="onSubmit" />
  </Card>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "title": "个人信息"
  }
}
</route>
