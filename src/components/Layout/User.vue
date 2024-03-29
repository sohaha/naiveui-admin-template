<script lang="ts" setup>
import { NIcon, useMessage } from 'naive-ui'
import inlayMenu from '@/menu'
import type { RefFormInst } from '@/types/global'
import { fixAvatar } from '@/utils/utils'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'loaded'): void
}>()

const { t } = useLanguage()
const state = stateStore()
const user = userStore()
const router = useRouter()

const { say, ask, time } = useHello()
const tip = computed(() => `${ask.value}，${say.value}`)

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
      const newToken = data?.data?.token
      if (newToken)
        user.setToken(newToken)
    }
    else if (data?.msg) {
      message.error(data.msg)
    }
  })
}

const { loading, data } = apiMe({
  manual: false,
})
watch(data, (data) => {
  if (data) {
    user.setUset(data.data?.info ?? {})
    const menu = data.data?.menu
    if (import.meta.env.VITE_APP_REMOVE_MENU && menu && Array.isArray(menu))
      user.setMenus(menu)
    else if (inlayMenu)
      user.setMenus(inlayMenu)

    user.appendMenus(data.data?.alone_menu ?? [])

    const permission = data.data?.permission
    if (permission && Array.isArray(permission))
      user.setPermission(permission)

    nextTick(() => {
      user.setLogged()
    })
  }
}, { immediate: true })

function menuSelect(key: number) {
  switch (key) {
    case 0:
      router.push('/inlay/detail')
      break
    case 1:
      showUpdatePassword.value = true
      break
    case 2:
      logout()
      break
    case 3:
      router.push('/inlay/message')
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
    label: t('logs'),
    key: 3,
    icon() {
      return h(NIcon, {
        class: 'i-bx-bxs-bell-ring',
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
  <div v-if="loading" class="p-4 py-2 flex items-center group cursor-pointer">
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
    <div class="flex items-center relative group cursor-pointer p-2">
      <NAvatar
        v-if="user.getAvatar"
        round
        :src="fixAvatar(user.getAvatar)"
        class="flex-shrink-0"
        :class="{ 'm-auto': props.collapsed }"
      />
      <NAvatar
        v-else
        round
        class="flex-shrink-0"
        :class="{ 'm-auto': props.collapsed }"
      >
        {{ user.getNickName }}
      </NAvatar>
      <div class="truncate flex-1 pl-2 pr-3" :class="{ hidden: props.collapsed }">
        {{ user.getNickName }}
        <span class="block text-xs opacity-70">{{ tip }}</span>
      </div>
      <NIcon v-show="!props.collapsed " class="i-bx-dots-vertical absolute right-2 m-auto top-1.5" />
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
    "logs": "Log view",
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
    "logs": "日志查看",
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
