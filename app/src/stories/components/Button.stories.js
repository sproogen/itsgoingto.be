import React from 'react'

import Button from 'components/button'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    text: {
      control: { type: 'text' },
      defaultValue: 'Click me',
    },
  },
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({});
Default.args = {
  callback: () => Promise.resolve(),
}

export const Disabled = Template.bind({});
Disabled.args = {
  callback: () => Promise.resolve(),
  disabled: true,
}

export const DelayedCallback = Template.bind({});
DelayedCallback.args = {
  callback: () => new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  }),
}
