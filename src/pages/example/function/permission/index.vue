<script lang="ts" setup>
const user = userStore()
const permissionAdmin = ['admin', 'editor']
const permissionUser = ['user']

const admin = ref(user.getPermission.includes('admin'))
function toggle() {
  admin.value = !admin.value
  if (admin.value)
    user.setPermission(permissionAdmin)
  else
    user.setPermission(permissionUser)
}

const router = useRouter()
function go(path: string) {
  router.push(path)
}
</script>

<template>
  <Card height>
    当前权限：{{ user.getPermission }}
    <div class="space-x-5 mt-4">
      <NButton v-throttled @click="toggle">
        切换权限
      </NButton>

      <NButton v-throttled @click="go('/example/function/permission/user')">
        进入用户权限页面
      </NButton>
    </div>
    <h1 v-permission="['user']" class="text-lg">
      这文字用户权限可见
    </h1>
  </Card>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "en": "Permission",
      "zh": "权限测试"
    }
  }
}
</route>
