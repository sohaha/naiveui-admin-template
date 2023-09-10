<script lang="ts" setup>
</script>

<template>
  <Card height>
    当前页面是 user 权限的用户才可见
  </Card>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "permission": ["user"],
    "title": "user权限"
  }
}
</route>
