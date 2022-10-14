<script lang="ts" setup>
const router = useRouter()

// const route = useRoute()
// const redirect = route?.query?.redirect

router.go(-1)
</script>

<template>
  <div />
</template>

<route lang="json">
{
  "meta": {
    "multiWindow": false,
    "title": "Loading"
  }
}
</route>
