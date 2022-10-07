<script lang="ts" setup>
import { NIcon, useMessage } from 'naive-ui'
import type { RefFormInst } from '@/types/global'

const props = defineProps<{
  collapsed: boolean
}>()

const { t } = useLanguage()
const state = stateStore()
const user = userStore()
const router = useRouter()

const logout = () => {
  state.setLoadingMsg(t('logouting'))
  apiLogout()
    .then(() => {
      user.setToken('')
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.value.fullPath,
        },
      })
    })
    .finally(() => {
      state.setLoadingMsg('')
    })
}

const isSmallHeight = useMediaQuery('(max-height: 380px)')
const showUpdatePassword = ref(false)
const formRef = ref<RefFormInst>()
const rPasswordFormItemRef: any = ref(null)
const modelPass = ref({
  oldPass: '',
  pass: '',
  reentered: '',
})
const rules = computed(() => ({
  oldPass: [
    {
      required: true,
      message: t('inputP'),
      trigger: ['input', 'blur'],
    },
  ],
  pass: [
    {
      required: true,
      trigger: 'input',
      validator(rule: Object, value: string) {
        if (!value)
          return new Error(t('inputNP'))
        if (modelPass.value.reentered)
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        return true
      },
    },
  ],
  reentered: [
    {
      required: true,
      trigger: ['blur', 'input', 'password-input'],
      validator(rule: Object, value: string) {
        if (!value)
          return new Error(t('inputRNP'))
        if (value !== modelPass.value.pass)
          return new Error(t('inputRNPErr'))
        return true
      },
    },
  ],
}))

const { run: updatePassword } = useRequest(apiEditPassword, { manual: true })
const message = useMessage()
function handleUpdatePassword(e: Event) {
  e.preventDefault()
  // @ts-expect-error ignore
  formRef.value?.validate(async (errors?: any[]) => {
    if (errors)
      return
    const data = await updatePassword(
      modelPass.value.oldPass,
      modelPass.value.pass,
    )
    if (data?.code === 0) {
      message.success(t('success'))
      showUpdatePassword.value = false
      modelPass.value = {
        oldPass: '',
        pass: '',
        reentered: '',
      }
    }
    else if (data?.msg) {
      message.error(data.msg)
    }
  })
}

const { loading } = useRequest(apiMe, {
  onBefore() {
    state.setLoadingMsg(t('loading'))
  },
  onAfter() {
    state.setLoadingMsg('')
  },
  onSuccess(data) {
    // TODO 后期可以动态设置菜单
    user.setUset(data.data?.info ?? {})
  },
  onError(err) {
    if (err)
      window.$message.error(err.message)
  },
})

function menuSelect(key: number) {
  switch (key) {
    case 0:
      // router.push({
      //   name: 'userDetail',
      // })
      break
    case 1:
      showUpdatePassword.value = true
      break
    case 2:
      logout()

      break
  }
}
const menuOptions = computed(() => [
  {
    label: t('me'),
    key: 0,
    icon() {
      return h(NIcon, {
        class: 'i-bx-bxs-user',
      })
    },
  },
  {
    label: t('pass'),
    key: 1,
    icon() {
      return h(NIcon, { class: 'i-bx-bxs-lock-alt' })
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: t('logout'),
    key: 2,
    icon() {
      return h(NIcon, { class: 'i-bx:bxs-log-out-circle' })
    },
  },
])
</script>

<template>
  <div v-if="loading" class="px-4 py-2 flex items-center group cursor-pointer">
    <NSkeleton class="flex-shrink-0" height="34px" width="34px" circle />
    <NSkeleton class=" ml-4" text />
  </div>
  <NDropdown
    v-else
    trigger="hover"
    placement="right"
    :options="menuOptions"
    @select="menuSelect"
  >
    <div class="px-4 py-2 flex items-center relative group cursor-pointer">
      <NAvatar
        v-if="user.getAvatar"
        round
        :src="user.getAvatar"
        class="flex-shrink-0"
        :class="{ 'm-auto': props.collapsed }"
      />
      <NAvatar
        v-else
        round
        :src="user.getAvatar"
        class="flex-shrink-0"
        :class="{ 'm-auto': props.collapsed }"
      >
        {{ user.getNickName }}
      </NAvatar>
      <div class="truncate flex-1 pl-3 " :class="{ hidden: props.collapsed }">
        {{ user.getNickName }}
      </div>
      <NIcon v-show="!props.collapsed " class="i-bx-log-out absolute right-2  m-auto" />
    </div>
  </NDropdown>
  <NModal
    v-model:show="showUpdatePassword"
    :mask-closable="false"
    preset="card"
    class="fixed h-[370px] w-7/12 min-w-[260px] inset-0"
    :class="{ '-top-[25%]': !isSmallHeight }"
  >
    <template #header>
      <div>{{ t('pass') }}</div>
    </template>
    <NForm
      ref="formRef"
      label-placement="top"
      :label-width="80"
      :model="modelPass"
      :rules="rules"
    >
      <NFormItem path="oldPass" :label="t('oPass')">
        <NInput
          v-model:value="modelPass.oldPass"
          autofocus
          :placeholder="t('inputP')"
          type="password"
          show-password-on="mousedown"
        />
      </NFormItem>
      <NFormItem path="pass" :label="t('nPass')">
        <NInput
          v-model:value="modelPass.pass"
          :placeholder="t('inputNP')"
          type="password"
          show-password-on="mousedown"
        />
      </NFormItem>
      <NFormItem
        ref="rPasswordFormItemRef"
        path="reentered"
        :label="t('rnPass')"
      >
        <NInput
          v-model:value="modelPass.reentered"
          :placeholder="t('inputRNP')"
          type="password"
          show-password-on="mousedown"
        />
      </NFormItem>

      <div class="flex justify-end">
        <NButton type="primary" @click="handleUpdatePassword">
          {{ t('submit') }}
        </NButton>
      </div>
    </NForm>
  </NModal>
</template>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "loading":"loading",
    "me": "Personal settings",
    "pass": "Change password",
    "logout": "Log out",
    "oPass": "Current",
    "nPass": "New",
    "rnPass": "Confirm",
    "inputP": "Please enter your current password",
    "inputNP": "Please enter a new password",
    "inputRNP": "Please enter the password again",
    "inputRNPErr": "Two input password is not consistent",
    "logouting": "Logging out of the login",
    "submit": "Update",
    "success": "update successfully"
  },
  "zh": {
    "me": "个人设置",
    "loading": "数据载入中",
    "pass": "修改密码",
    "logout": "退出登录",
    "oPass": "当前密码",
    "nPass": "新密码",
    "rnPass": "重复密码",
    "inputP": "请输入当前密码",
    "inputNP": "请输入新密码",
    "inputRNP": "请再次输入密码",
    "inputRNPErr": "两次输入的密码不一致",
    "logouting": "正在退出登录",
    "submit": "更新密码",
    "success": "更新成功"
  }
}
</i18n>
