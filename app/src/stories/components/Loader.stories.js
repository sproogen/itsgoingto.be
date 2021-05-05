import React from 'react'

import Loader from 'components/loader'

export default {
  title: 'Components/Loader',
  component: Loader
}

const Template = (args) => <Loader {...args} />

export const Default = Template.bind({})
Default.args = {
  isLoading: true
}
