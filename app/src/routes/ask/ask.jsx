import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty, isNil } from 'ramda'
import { useHistory } from 'react-router-dom'
import WordRotate from 'components/word-rotate'
import Question from './components/question'
import Answers from './components/answers'
import Options from './components/options'
import Actions from './components/actions'
import './ask.scss'

const WORDS = 'What,Where,When,Who'

const Ask = ({
  question, hasQuestion, canSubmitPoll, poll, answers, clearPoll,
  postPoll, updateQuestion, onAnswerChange, onRemoveAnswer, updateOptions, setPassphrase,
}) => {
  const history = useHistory()
  useEffect(() => {
    clearPoll()
  }, [])

  const description = 'Wondering where to go or what to see?'
                      + ' Start a poll and share it with your friends or colleagues.'

  const submit = () => postPoll()
    .then((response) => {
      if (response !== false) {
        if (!isNil(poll.passphrase) && !isEmpty(poll.passphrase)) {
          setPassphrase(poll.passphrase, response.identifier)
        }
        history.push(`/${response.identifier}`)
        return false
      }
      return true
    })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>It&#39;s Going To Be</title>
        <meta
          name="description"
          content={description}
        />
        <meta name="keywords" content="question vote poll result" />
      </Helmet>
      <div
        className={classNames(
          'container header-container hideable',
          {
            gone: hasQuestion,
          },
        )}
      >
        <div className="header center-text">
          <h1>
            <WordRotate words={WORDS} />
            is it going to be?
          </h1>
        </div>
      </div>
      <div
        className={classNames(
          'container question-container',
          {
            'move-up': hasQuestion,
          },
        )}
      >
        <Question question={question} onQuestionChange={updateQuestion} />
        {hasQuestion ? (
          <>
            <Answers
              answers={answers}
              onAnswerChange={onAnswerChange}
              onRemoveAnswer={onRemoveAnswer}
            />
            <Options poll={poll} updateOptions={updateOptions} />
            <Actions
              canSubmitPoll={canSubmitPoll}
              submitPoll={submit}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

Ask.propTypes = {
  question: PropTypes.string.isRequired,
  hasQuestion: PropTypes.bool.isRequired,
  canSubmitPoll: PropTypes.bool.isRequired,
  poll: PropTypes.shape({
    multipleChoice: PropTypes.bool,
    passphrase: PropTypes.string,
    endType: PropTypes.string,
  }).isRequired,
  answers: PropTypes.oneOfType([
    PropTypes.arrayOf({
      id: PropTypes.number,
      answer: PropTypes.string,
    }),
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  clearPoll: PropTypes.func.isRequired,
  postPoll: PropTypes.func.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onRemoveAnswer: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  setPassphrase: PropTypes.func.isRequired,
}

export default Ask
