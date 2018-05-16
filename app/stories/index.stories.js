import React from 'react'
import { Provider } from 'react-redux'
import LocaleProvider from 'antd/lib/locale-provider'
import enGB from 'antd/lib/locale-provider/en_GB'
import createStore from 'store/createStore'
import { storiesOf } from '@storybook/react'
import { setLoading } from 'store/loader'
import Back from 'components/Back'
import Button from 'components/Button'
import Loader from 'components/Loader'
import Modal from 'components/Modal'
import Spinner from 'components/Spinner'
import WordRotate from 'components/WordRotate'
import Footer from 'layouts/Footer'
import OptionsModalWrapper from './OptionsModalWrapper'
import Question from 'routes/Ask/components/Question/Question'
import Sharing from 'routes/Answer/components/Sharing/Sharing'
import Answer from 'routes/Answer/components/Answer/Answer'
import '../src/styles/main.scss'

const store = createStore(window.__INITIAL_STATE__)

storiesOf('Core.Back', module)
  .add('Default', () => <Back />)

storiesOf('Core.Button', module)
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

storiesOf('Core.Loader', module)
  .addDecorator((getStory) => {
    store.dispatch(setLoading(true))
    return <Provider store={store}>
      { getStory() }
    </Provider>
  })
  .add('Default', () => <Loader isLoading />)

let _modal

storiesOf('Core.Modal', module)
  .add('Default', () =>
    <div>
      <Button text='Show' callback={() => {
        _modal.show()
        return Promise.resolve()
      }} />
      <Modal ref={(component) => { _modal = component }}>
        <h2 className='modal-title'>Poll Options</h2>
      </Modal>
    </div>)

storiesOf('Core.Spinner', module)
  .add('Default', () => <Spinner />)

storiesOf('Core.WordRotate', module)
  .add('Default', () =>
    <div className='header center-text'>
      <h1><WordRotate words='What,Where,When,Who' /></h1>
    </div>
  )

storiesOf('Layouts.Footer', module)
  .add('Default', () => <Footer />)

let _optionsModal

storiesOf('Ask.OptionsModal', module)
  .addDecorator((getStory) => {
    return <LocaleProvider locale={enGB}>
      <Provider store={store}>
        { getStory() }
      </Provider>
    </LocaleProvider>
  })
  .add('Default', () => {
    return (
      <div>
        <Button text='Show' callback={() => {
          _optionsModal.getWrappedInstance().show()
          return Promise.resolve()
        }} />
        <OptionsModalWrapper ref={(component) => { _optionsModal = component }} />
      </div>
    )
  })

storiesOf('Ask.Question', module)
  .addDecorator((getStory) => {
    return <Provider store={store}>
      { getStory() }
    </Provider>
  })
  .add('Default', () =>
    <div style={{ marginTop : '200px' }}>
      <Question />
    </div>
  )

storiesOf('Answer.Sharing', module)
  .add('Default', () =>
    <div className='container center-text'>
      <Sharing poll={{ question : 'This is a poll' }} />
    </div>
  )

storiesOf('Answer.Answer', module)
  .addDecorator((getStory) => {
    return <Provider store={store}>
      <div className='container answer-container'>
        { getStory() }
      </div>
    </Provider>
  })
  .add('Radio', () =>
    <Answer
      index={0}
      type='radio'
      answer={{ id : 0, answer : 'This is an answer' }}
      totalResponses={5}
      params={{ identifier : 'fk7ysy8' }} />
  )
  .add('Checkbox', () =>
    <Answer
      index={0}
      type='checkbox'
      answer={{ id : 0, answer : 'This is an answer' }}
      totalResponses={5}
      params={{ identifier : 'fk7ysy8' }} />
  )