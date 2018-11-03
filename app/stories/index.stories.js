import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import createStore from 'store/create-store'
import { setLoading } from 'store/loader'
import Back from 'components/back'
import Button from 'components/button'
import Loader from 'components/loader'
import Modal from 'components/modal'
import Spinner from 'components/spinner'
import WordRotate from 'components/word-rotate'
import Footer from 'layouts/footer'
import Question from 'routes/ask/components/question/question'
import Sharing from 'routes/answer/components/sharing/sharing'
import Answer from 'routes/answer/components/answer/answer'
import '../src/styles/main.scss'

const store = createStore(window.__INITIAL_STATE__)

storiesOf('Core.Back', module)
  .add('Default', () => <Back />)

storiesOf('Core.Button', module)
  .add('Default', () => <Button text='Click Me' callback={() => Promise.resolve()} />)
  .add('Disabled', () => <Button text='Click Me' disabled callback={() => Promise.resolve()} />)
  .add('Delayed Callback', () =>
    <Button text='Click Me' callback={() =>
      new Promise((resolve) => {
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
