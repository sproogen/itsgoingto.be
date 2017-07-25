import React from 'react'
import { storiesOf } from '@storybook/react'
import Button from 'components/Button/Button'
import Spinner from 'components/Spinner/Spinner'
import '../src/styles/main.scss'

storiesOf('Spinner', module)
  .add('Default', () => <Spinner />)

storiesOf('Button', module)
  .add('Default', () => <Button text="Click Me" callback={() => Promise.resolve()} />)
  .add('Disabled', () => <Button text="Click Me" disabled={true} callback={() => Promise.resolve()}/>)
  .add('Delayed Callback', () => <Button text="Click Me" callback={() => new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve()
      }, 1000)
    })
  }/>)
