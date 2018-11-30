/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { Answer } from './answer'

const props = {
  identifier: 'Hd2eJ9Jk',
  poll: {
    question: 'Question?',
    ended: false,
    multipleChoice: false,
  },
  hasPoll: true,
  requiresPassphrase: false,
  answers: [],
  totalResponses: 0,
  userResponded: false,
  hasUser: false,
  fetchPoll: jest.fn(() => Promise.resolve()),
  clearAnswers: jest.fn(),
  setLoading: jest.fn(),
  setRequiresPassphrase: jest.fn(),
  postResponse: jest.fn(),
  updateResponses: jest.fn()
}
let wrapper

describe('(Route) answer', () => {
  beforeEach(() => {
    wrapper = shallow(<Answer {...props} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('componentDidMount', () => {
    describe('!hasPoll', () => {
      it('should set loading', () => {
        wrapper = shallow(<Answer {...props} hasPoll={false} />)
        expect(props.setLoading).toHaveBeenCalledWith(true)
      })
    })

    it('should clear answers', () => {
      expect(props.clearAnswers).toHaveBeenCalled()
    })

    it('should fetchPoll', () => {
      expect(props.fetchPoll).toHaveBeenCalled()
    })

    describe('poll succesfully fetched', () => {
      it('should set loading false', () => {
        expect(props.setLoading).toHaveBeenCalledWith(false)
      })
    })

    // TODO : Find a way to get these tests to work.
    // describe('fetch poll returns poll not found', () => {
    //   it('should redirect to 404', () => {
    //     browserHistory.push = jest.fn()
    //     const fetchPoll = jest.fn(() => Promise.resolve(new APIError()))
    //     wrapper = shallow(<Answer {...props} fetchPoll={fetchPoll} />)
    //     expect(browserHistory.push).toBeCalledWith('/404')
    //   })
    // })

    // describe('fetch poll returns incorrect passphrase', () => {
    //   it('should call setRequiresPassphrase', () => {
    //     browserHistory.push = jest.fn()
    //     const fetchPoll = jest.fn(() => Promise.resolve(new APIError({
    //       status: 403,
    //       error: { error: 'incorrect-passphrase' },
    //     })))
    //     wrapper = shallow(<Answer {...props} fetchPoll={fetchPoll} />)
    //     expect(props.setRequiresPassphrase).toBeCalledWith(true)
    //   })
    // })
  })

  describe('(Render)', () => {
    describe('!hasPoll and requiresPassphrase', () => {
      it('matches snapshot', () => {
        wrapper = shallow(<Answer {...props} hasPoll={false} requiresPassphrase={true} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('hasPoll', () => {
      it('matches snapshot', () => {
        wrapper = shallow(<Answer {...props} hasPoll={true} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('Poll is ended', () => {
      it('matches snapshot', () => {
        wrapper = shallow(<Answer {...props} poll={{
          question: 'Question?',
          ended: true,
        }} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('Poll has end date', () => {
      it('matches snapshot', () => {
        wrapper = shallow(<Answer {...props} poll={{
          question: 'Question?',
          ended: false,
          endDate: { date: '22/11/2018' },
        }} />)
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})