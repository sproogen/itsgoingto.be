import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'store/createStore'
import { storiesOf } from '@storybook/react'
import { setLoading } from 'store/loader'
import Back from 'components/Back/Back'
import Button from 'components/Button/Button'
import Footer from 'components/Footer/Footer'
import Loader from 'components/Loader/Loader'
import Modal from 'components/Modal/Modal'
import Spinner from 'components/Spinner/Spinner'
import WordRotate from 'components/WordRotate/WordRotate'
import '../src/styles/main.scss'

const store = createStore(window.__INITIAL_STATE__)

storiesOf('Back', module)
  .add('Default', () => <Back />)

storiesOf('Button', module)
  .add('Default', () => <Button text='Click Me' callback={() => Promise.resolve()} />)
  .add('Disabled', () => <Button text='Click Me' disabled callback={() => Promise.resolve()} />)
  .add('Delayed Callback', () =>
    <Button text='Click Me' callback={() =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    } />
  )

storiesOf('Footer', module)
  .add('Default', () => <Footer />)

storiesOf('Loader', module)
  .addDecorator((getStory) => {
    store.dispatch(setLoading(true))
    return <Provider store={store}>
      { getStory() }
    </Provider>
  })
  .add('Default', () => <Loader />)

let _modal
storiesOf('Modal', module)
  .add('Default', () =>
    <div>
      <Button text='Show' callback={() => {
        _modal.show()
        return Promise.resolve()
      }} />
      <Modal ref={component => { _modal = component }}>
        <h2 className='modal-title'>Poll Options</h2>
      </Modal>
    </div>)

storiesOf('Spinner', module)
  .add('Default', () => <Spinner />)

storiesOf('WordRotate', module)
  .add('Default', () =>
    <div className='header center-text'>
      <h1><WordRotate words='What,Where,When,Who' /></h1>
    </div>
  )
