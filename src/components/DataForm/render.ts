import type {
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  DynamicInputProps,
  FormProps,
  GridProps,
  SwitchProps,
} from 'naive-ui'
import {
  NButton,
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDynamicInput,
  NFormItem,
  NFormItemGridItem,
  NGridItem,
  NInput,
  NInputNumber,
  NRadio,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSlider,
  NSwitch,
  NTimePicker,
  NTreeSelect,
} from 'naive-ui'
import type { FormItemRule, FormRules } from 'naive-ui/lib/form/src/interface'
import type { AllowedComponentProps, Component, VNodeArrayChildren } from 'vue'

export type Components =
  | 'NInput'
  | 'NInputNumber'
  | 'NDynamicInput'
  | 'NSelect'
  | 'NSwitch'
  | 'NSlider'
  | 'NTreeSelect'
  | 'NDatePicker'
  | 'NTimePicker'
  | 'NCascader'
  | 'NRadioGroup'
  | 'NCheckboxGroup'
  | 'NRadioButtonGroup'
  | 'div'

export type ComponentMap<T> = { [_c in Components]: T }

export interface renderData {
  component: Component
  props?: any
  slots?: any
}

function render(v: FormItemProps) {
  const { props, options, placeholder, slots } = v
  return {
    props: {
      ...(options ? { options } : {}),
      ...(placeholder ? { placeholder } : {}),
      ...props,
    },
    slots,
  }
}

export const renderMap: ComponentMap<Function> = {
  div: (v: FormItemProps): renderData => ({
    component: h('div', v.props, v.slots),
  }),
  NInput: (v: FormItemProps): renderData => ({
    component: NInput,
    ...render(v),
  }),
  NInputNumber: (v: FormItemProps): renderData => ({
    component: NInputNumber,
    ...render(v),
  }),
  NDynamicInput: (v: FormItemProps): renderData => ({
    component: NDynamicInput,
    ...render(v),
  }),
  NSwitch: (v: FormItemProps): renderData => ({
    component: NSwitch,
    ...render(v),
  }),
  NSlider: (v: FormItemProps): renderData => ({
    component: NSlider,
    ...render(v),
  }),
  NCascader: (v: FormItemProps): renderData => ({
    component: NCascader,
    ...render(v),
  }),
  NTreeSelect: (v: FormItemProps): renderData => ({
    component: NTreeSelect,
    ...render(v),
  }),
  NDatePicker: (v: FormItemProps): renderData => ({
    component: NDatePicker,
    ...render(v),
  }),
  NTimePicker: (v: FormItemProps): renderData => ({
    component: NTimePicker,
    ...render(v),
  }),
  NSelect: (v: FormItemProps): renderData => ({
    component: NSelect,
    ...render(v),
  }),
  NCheckboxGroup: (v: FormItemProps): renderData => {
    const component = NCheckboxGroup
    const solts = (v.options as OptionProps[])?.map((o: OptionProps) => {
      const { label, ...props } = o
      return h(NCheckbox, props, { default: () => label })
    })
    return {
      component,
      props: v.props,
      slots: {
        default: () => solts,
      },
    }
  },
  NRadioGroup: (v: FormItemProps): renderData => {
    const component = NRadioGroup
    const solts = (v.options as OptionProps[])?.map((o: OptionProps) => {
      const { label, ...props } = o
      return h(NRadio, props, { default: () => label })
    })
    return {
      component,
      props: v.props,
      slots: {
        default: () => solts,
      },
    }
  },
  NRadioButtonGroup: (v: FormItemProps): renderData => {
    const component = NRadioGroup
    const solts = (v.options as OptionProps[])?.map((o: OptionProps) => {
      return h(NRadioButton, o, { default: () => o.label })
    })
    return {
      component,
      props: v.props,
      slots: {
        default: () => solts,
      },
    }
  },
}

export interface DynamicFormProps extends FormProps {
  submitBtn?: string
  resetBtn?: string
  grid?: GridProps
}

export interface OptionProps {
  label: string
  value: string | number
  disabled?: boolean
  children?: any
}
interface inputProps {
  type: 'textarea' | 'text' | 'password'
  autosize:
  | boolean
  | {
    minRows?: number | undefined
    maxRows?: number | undefined
  }
}

export interface FormItemProps {
  label?: string
  labelRender?: () => {}
  placeholder?: string
  component: Components
  path?: string
  options?: Array<OptionProps> | OptionProps
  props?:
  | Object
  | inputProps
  | SwitchProps
  | CheckboxProps
  | DatePickerProps
  | CascaderProps
  | DynamicInputProps
  | AllowedComponentProps
  defaultValue?: any
  validator?: FormRules | FormItemRule | FormItemRule[]
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  hidden?: boolean
  slots?: any
}

export function formBtns(opt: any, isGrid = false) {
  const children: VNodeArrayChildren = []
  if (opt.submit[0] && opt.reset[0]) {
    children.push(
      h(
        NButton,
        {
          class: 'px-3',
          secondary: true,
          onClick: opt.reset[1],
        },
        {
          default: () => opt.reset[0],
        },
      ),
    )
    opt.submit[0]
      && children.push(
        h(
          NButton,
          {
            type: 'primary',
            class: 'px-3',
            onClick: opt.submit[1],
          },
          {
            default: () => opt.submit[0],
          },
        ),
      )
  }
  const btns = h(
    'div',
    { class: 'flex justify-center space-x-5 w-full' },
    children,
  )

  return isGrid
    ? h(
      NGridItem,
      { span: 24 },
      {
        default: () => btns,
      },
    )
    : btns
}

export function formItem(
  key: string,
  v: FormItemProps,
  model: any,
  isGrid = false,
  isNew: any,
  update: any,
) {
  const name = v.component
  const { component, props, slots } = renderMap[name]
    ? renderMap[name](v)
    : ({} as renderData)
  if (!component || v.hidden)
    return ''

  const itemSlots: Record<string, any> = {
    default: () => {
      if (name === 'div')
        return component

      const { onUpdateValue } = props || {}
      const value = model.value[key]
      if (v.readonly && !isNew.value && (value !== undefined && value !== null))
        props.readonly = true

      return h(
        component,
        {
          disabled: v.disabled,
          ...props,
          value,
          onUpdateValue: (n: any) => {
            update(n)
            onUpdateValue && onUpdateValue(n)
          },
        },
        slots,
      )
    },
  }
  if (v.labelRender)
    itemSlots.label = v.labelRender

  return h(
    isGrid ? NFormItemGridItem : NFormItem,
    {
      label: v.label || '',
      first: true,
      path: v.path || key,
    },
    itemSlots,
  )
}
