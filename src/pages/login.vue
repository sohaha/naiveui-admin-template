<script lang="ts" setup>
const { t, toggleLocale } = useLanguage()

const message = useMessage()

const user = userStore()

const login = ref(null)
const { theme } = settingStore()
const backgroundColor = computed(() => {
  return theme.PrimaryColor
})
{
  const localBackgroundImage = usePrefixStorage('login-bg', '')
  const backgroundImage = useCssVar('--backgroundImage', login)
  if (localBackgroundImage.value) {
    nextTick(() => {
      backgroundImage.value = localBackgroundImage.value as string
    })
  }
  const getBase64Image = (img: HTMLImageElement) => {
    if (import.meta.env.SSR)
      return

    const canvas = document.createElement('canvas')
    canvas.width = 675
    canvas.height = 800
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  }
  const background = new Image() as HTMLImageElement
  background.setAttribute('crossOrigin', 'anonymous')
  background.src
    = 'https://source.unsplash.com/675x800/?Work,Mac&auto=format,enhance,compress&crop=entropy&fit=crop&q=80'
  background.onload = () => {
    backgroundImage.value = `url(${getBase64Image(background)}`
    localBackgroundImage.value = backgroundImage.value
  }
}

// 表单
const rules = computed(() => {
  return {
    username: {
      required: true,
      trigger: ['input', 'blur'],
      message: t('username'),
    },
    password: {
      required: true,
      trigger: ['input', 'blur'],
      message: t('password'),
    },
  }
})

const defaultVal
  = import.meta.env.DEV || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true'
    ? {
        username: 'manage',
        password: '123456',
      }
    : {
        username: '',
        password: '',
      }
const username = usePrefixStorage('username', '')
if (username.value)
  defaultVal.username = username.value as string

const model = ref(defaultVal)
const formRef = ref()
const loading = ref(false)
const { run } = useRequest(apiLogin, {
  manual: true,
  onAfter() {
    loading.value = false
  },
  onBefore(params) {
    loading.value = true
    return params
  },
  onError(err) {
    if (err)
      window.$message.error(err.message)
  },
})

const route = useRoute()
const router = useRouter()

// const { run: getPermissions } = useRequest(apiPermissions, { manual: true })

const { run: getMe } = useRequest(apiMe, {
  cacheKey: 'me',
  manual: true,
  onAfter() {
    loading.value = false
  },
  onError(err) {
    if (err)
      window.$message.error(err.message)
  },
  onSuccess() {
    // if (!data?.is_super)
    //   console.log('不是超级管理员')

    // const p = await getPermissions()
    // if (p?.code === 0)
    //   userStore.setPermissions(p.data?.permissions || [])

    if (user.keepLogin)
      username.value = model.value.username

    router.replace((route?.query?.redirect as string) || '/')
  },
})

function onLogin() {
  formRef.value.validate(async (errors: string) => {
    if (errors)
      return
    const res = await run(model.value.username, model.value.password)

    if (!res)
      return

    const { data } = res!
    const token = data?.token
    if (!token) {
      message.error(res?.msg ?? '获取授权 Token 失败')
      return
    }

    message.success(t('success'))
    user.setToken(token)
    nextTick(getMe)
  })
}

const passwordRef = ref<any>(null)
function onTab() {
  passwordRef.value?.focus()
}
</script>

<template>
  <NLayout :inverted="true">
    <section id="login" ref="login" class="min-h-screen flex items-stretch">
      <div
        class="lg:flex w-3/5 hidden bg-black bg-no-repeat bg-cover relative items-center bg-image"
      >
        <div class="absolute bg-black opacity-50 inset-0 z-0" />
        <div class="w-full text-white mt-50 px-24 z-10 tracking-wide">
          <p class="text-xl" style="mix-blend-mode: multiply">
            {{ t('poetry1') }}
          </p>
          <p class="text-2xl mt-10 leading-loose">
            {{ t('poetry2') }}
          </p>
        </div>
      </div>
      <NElement
        class="w-full lg:min-w-[470px] flex items-center justify-center px-0 z-0 bg-[var(--a-bg-color)] md:px-16 lg:w-2/5"
      >
        <div
          class="lg:hidden fixed z-10 inset-0 bg-no-repeat bg-cover items-center bg-black bg-image"
        >
          <div class="absolute bg-black opacity-60 inset-0 z-0" />
        </div>
        <NElement
          class="w-full py-6 z-20 mb-10 min-h-[300px] min-w-[200px] max-w-[400px] p-14 shadow-lg bg-[var(--a-bg-color)] text-[var(--primary-color)] mx-4 sm:mx-auto lg:opacity-100 lg:shadow-none opacity-90"
        >
          <div class="text-center text-2xl font-bold relative">
            <div class="pb-1">
              {{ t('title') }}
            </div>
          </div>
          <NTabs
            type="line"
            default-value="signin"
            justify-content="space-evenly"
            tab-style="letter-spacing: 0.02em"
          >
            <NTabPane name="signin" :tab="t('account')">
              <div class="h-[246px]">
                <NForm
                  ref="formRef"
                  :model="model"
                  :rules="rules"
                  label-placement="left"
                >
                  <NFormItem path="username" class="pt-2">
                    <NInput
                      v-model:value="model.username"
                      :placeholder="t('username')"
                      @keyup.enter="onTab"
                    >
                      <template #prefix>
                        <NIcon class="i-bx-bxs-user" />
                      </template>
                    </NInput>
                  </NFormItem>
                  <NFormItem path="password" class="pt-2">
                    <NInput
                      ref="passwordRef"
                      v-model:value="model.password"
                      type="password"
                      show-password-on="mousedown"
                      :placeholder="t('password')"
                      @keyup.enter="onLogin"
                    >
                      <template #prefix>
                        <NIcon class="i-bx-bxs-lock-alt" />
                      </template>
                    </NInput>
                  </NFormItem>
                  <!--  <n-form-item> -->
                  <!--    <div class="flex w-full justify-between"> -->
                  <!--      <div class="flex-initial"> -->
                  <!--        <n-checkbox> 自动登录</n-checkbox> -->
                  <!--      </div> -->
                  <!--      <div class="flex-initial order-last"> -->
                  <!--        <NButton text> -->
                  <!--          忘记密码 -->
                  <!--        </NButton> -->
                  <!--      </div> -->
                  <!--    </div> -->
                  <!--  </n-form-item> -->

                  <div class="space-y-4">
                    <NCheckbox v-model:checked="user.keepLogin">
                      {{ t('keep') }}
                    </NCheckbox>
                    <NButton
                      v-throttled
                      type="primary"
                      block
                      :disabled="loading"
                      :loading="loading"
                      @click="onLogin"
                    >
                      {{ t('submit') }}
                    </NButton>
                  </div>
                </NForm>
                <div class="flex view-account-other mt-4">
                  <div class="flex-initial">
                    <span>{{ t('other') }}</span>
                  </div>
                  <div class="flex-initial mx-2">
                    <NPopover trigger="click">
                      <template #trigger>
                        <NIcon size="18" class="mi-wechat" />
                      </template>
                      <span>{{ t('not-open') }}</span>
                    </NPopover>
                  </div>
                  <div class="flex-initial" style="margin-left: auto">
                    <NPopover trigger="click">
                      <template #trigger>
                        <NButton text>
                          {{ t('register') }}
                        </NButton>
                      </template>
                      <span>{{ t('not-open') }}</span>
                    </NPopover>
                  </div>
                </div>
              </div>
            </NTabPane>
            <NTabPane name="signup" :tab="t('qr')">
              <NEmpty class="py-25 h-[246px]" :description="t('not-open')">
                <template #icon>
                  <!-- <NIcon size="40"> -->
                  <div class="i-bx:bxs-x-circle" />
                  <!-- </NIcon> -->
                </template>
              </NEmpty>
            </NTabPane>
          </NTabs>
        </NElement>
      </NElement>
    </section>
    <NElement>
      <NIcon
        size="18"
        class="fixed right-5 bottom-3 cursor-pointer animate-pulse i-bx-world"
        @click="() => toggleLocale()"
      />
    </NElement>
  </NLayout>
</template>

<style scoped>
#login {
  --background-color: v-bind(backgroundColor);
  --backgroundImage: linear-gradient(
      50deg,
      rgba(146, 146, 146, 0.02) 0%,
      rgba(146, 146, 146, 0.02) 25%,
      rgba(82, 82, 82, 0.02) 25%,
      rgba(82, 82, 82, 0.02) 50%,
      rgba(217, 217, 217, 0.02) 50%,
      rgba(217, 217, 217, 0.02) 75%,
      rgba(41, 41, 41, 0.02) 75%,
      rgba(41, 41, 41, 0.02) 100%
    ),
    linear-gradient(
      252deg,
      rgba(126, 126, 126, 0.01) 0%,
      rgba(126, 126, 126, 0.01) 25%,
      rgba(117, 117, 117, 0.01) 25%,
      rgba(117, 117, 117, 0.01) 50%,
      rgba(219, 219, 219, 0.01) 50%,
      rgba(219, 219, 219, 0.01) 75%,
      rgba(41, 41, 41, 0.01) 75%,
      rgba(41, 41, 41, 0.01) 100%
    ),
    linear-gradient(
      272deg,
      rgba(166, 166, 166, 0.01) 0%,
      rgba(166, 166, 166, 0.01) 20%,
      rgba(187, 187, 187, 0.01) 20%,
      rgba(187, 187, 187, 0.01) 40%,
      rgba(238, 238, 238, 0.01) 40%,
      rgba(238, 238, 238, 0.01) 60%,
      rgba(204, 204, 204, 0.01) 60%,
      rgba(204, 204, 204, 0.01) 80%,
      rgba(5, 5, 5, 0.01) 80%,
      rgba(5, 5, 5, 0.01) 100%
    ),
    linear-gradient(
      86deg,
      rgba(143, 143, 143, 0.02) 0%,
      rgba(143, 143, 143, 0.02) 12.5%,
      rgba(36, 36, 36, 0.02) 12.5%,
      rgba(36, 36, 36, 0.02) 25%,
      rgba(23, 23, 23, 0.02) 25%,
      rgba(23, 23, 23, 0.02) 37.5%,
      rgba(223, 223, 223, 0.02) 37.5%,
      rgba(223, 223, 223, 0.02) 50%,
      rgba(101, 101, 101, 0.02) 50%,
      rgba(101, 101, 101, 0.02) 62.5%,
      rgba(94, 94, 94, 0.02) 62.5%,
      rgba(94, 94, 94, 0.02) 75%,
      rgba(148, 148, 148, 0.02) 75%,
      rgba(148, 148, 148, 0.02) 87.5%,
      rgba(107, 107, 107, 0.02) 87.5%,
      rgba(107, 107, 107, 0.02) 100%
    ),
    linear-gradient(
      25deg,
      rgba(2, 2, 2, 0.02) 0%,
      rgba(2, 2, 2, 0.02) 16.667%,
      rgba(51, 51, 51, 0.02) 16.667%,
      rgba(51, 51, 51, 0.02) 33.334%,
      rgba(26, 26, 26, 0.02) 33.334%,
      rgba(26, 26, 26, 0.02) 50.001%,
      rgba(238, 238, 238, 0.02) 50.001%,
      rgba(238, 238, 238, 0.02) 66.668%,
      rgba(128, 128, 128, 0.02) 66.668%,
      rgba(128, 128, 128, 0.02) 83.335%,
      rgba(21, 21, 21, 0.02) 83.335%,
      rgba(21, 21, 21, 0.02) 100.002%
    ),
    linear-gradient(
      325deg,
      rgba(95, 95, 95, 0.03) 0%,
      rgba(95, 95, 95, 0.03) 14.286%,
      rgba(68, 68, 68, 0.03) 14.286%,
      rgba(68, 68, 68, 0.03) 28.572%,
      rgba(194, 194, 194, 0.03) 28.572%,
      rgba(194, 194, 194, 0.03) 42.858%,
      rgba(51, 51, 51, 0.03) 42.858%,
      rgba(51, 51, 51, 0.03) 57.144%,
      rgba(110, 110, 110, 0.03) 57.144%,
      rgba(110, 110, 110, 0.03) 71.43%,
      rgba(64, 64, 64, 0.03) 71.43%,
      rgba(64, 64, 64, 0.03) 85.716%,
      rgba(31, 31, 31, 0.03) 85.716%,
      rgba(31, 31, 31, 0.03) 100.002%
    ),
    linear-gradient(90deg, #575a71, var(--background-color));
}

.bg-image {
  background-repeat: no-repeat;
  background-image: var(--backgroundImage);
  /*background-image: url(https://source.unsplash.com/675x800/?Work&auto=format,enhance,compress&crop=entropy&fit=crop&q=80);*/
  /*background-image: url(https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw=&ixlib=rb-1.2.1&auto=format,enhance,compress&crop=entropy&fit=crop&w=675&h=800&q=80);*/
}

.mi-wechat {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M15.85 8.14c.39 0 .77.03 1.14.08C16.31 5.25 13.19 3 9.44 3c-4.25 0-7.7 2.88-7.7 6.43c0 2.05 1.15 3.86 2.94 5.04L3.67 16.5l2.76-1.19c.59.21 1.21.38 1.87.47c-.09-.39-.14-.79-.14-1.21c-.01-3.54 3.44-6.43 7.69-6.43zM12 5.89a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92zM6.87 7.82a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92z'/%3E%3Cpath fill='currentColor' d='M22.26 14.57c0-2.84-2.87-5.14-6.41-5.14s-6.41 2.3-6.41 5.14s2.87 5.14 6.41 5.14c.58 0 1.14-.08 1.67-.2L20.98 21l-1.2-2.4c1.5-.94 2.48-2.38 2.48-4.03zm-8.34-.32a.96.96 0 1 1 .96-.96c.01.53-.43.96-.96.96zm3.85 0a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92z'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  -webkit-mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  background-color: currentColor;
  width: 1.2em;
  height: 1.2em;
}
</style>

<route lang="json">
{
  "meta": {
    "title": "page_login",
    "i18n": true,
    "layout": "Empty"
  }
}
</route>

<i18n lang="json">
{
  "en": {
    "title": "Welcome back",
    "poetry1": "Life is mediocre, short and long,",
    "poetry2": "but there is no way to know what is good or bad, gain or loss is difficult.",
    "password": "Please enter the password",
    "username": "Please enter user username",
    "account": "Account login",
    "keep": "Keep the login",
    "not-open": "Temporarily closed",
    "other": "Other",
    "qr": "Scan code login",
    "register": "Register",
    "submit": "Log in",
    "success": "Login successful"
  },
  "zh": {
    "title": "欢迎回来",
    "poetry1": "人生碌碌，竞短论长，",
    "poetry2": "却不道枯荣有数，得失难量。",
    "password": "请输入密码",
    "username": "请输入用户名",
    "account": "账号登录",
    "not-open": "暂不开放",
    "other": "其它登录方式",
    "qr": "扫码登录",
    "keep": "保持登录",
    "register": "注册账号",
    "submit": "登 录",
    "success": "登录成功"
  }
}
</i18n>
