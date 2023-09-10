<script lang="ts" setup>
</script>

<template>
  <Card height>
    当前页面是 admin 权限的用户才可见
  </Card>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "permission": ["admin"],
    "title": "admin权限"
  }
}
</route>
