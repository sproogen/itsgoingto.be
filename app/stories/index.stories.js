import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import createStore from 'store/create-store'
import { setLoading } from 'store/loader/actions'
import Loader from 'components/loader'
import WordRotate from 'components/word-rotate'
import Footer from 'components/footer'
import Question from 'routes/ask/components/question/question'
import Sharing from 'routes/answer/components/sharing/sharing'
import Answer from 'routes/answer/components/answer/answer'
import '../src/styles/main.scss'

const store = createStore(window.__INITIAL_STATE__)

storiesOf('Core.Loader', module)
  .addDecorator((getStory) => {
    store.dispatch(setLoading(true))
    return <Provider store={store}>
      { getStory() }
    </Provider>
  })
  .add('Default', () => <Loader isLoading />)

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
