import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import Back from 'components/back'

export default {
  title: 'Components/Back',
  component: Back,
  decorators: [(Story) => (<MemoryRouter><Story /></MemoryRouter>)],
}

export const Default = () => <Back />
