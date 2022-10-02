import React from 'react'

import WordRotate from 'components/word-rotate'

export default {
  title: 'Components/WordRotate',
  component: WordRotate,
}

const Template = (args) => (
  <div className="header center-text">
    <h1><WordRotate {...args} /></h1>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  words: 'What,Where,When,Who',
}
