import React from 'react'
import { shallow } from 'enzyme'
import WordRotate from './word-rotate'

describe('(Component) WordRotate', () => {
  let wrapper
  let instance

  beforeEach(() => {
    wrapper = shallow(<WordRotate words="word1,word2" />)
    instance = wrapper.instance()
  })

  describe('(State)', () => {
    it('should have initial state', () => {
      expect(wrapper.state()).toEqual({ currentWord : 0 })
    })
  })

  describe('(Props)', () => {
    it('should be set', () => {
      expect(instance.props.words).toBe('word1,word2')
    })
  })

  describe('(Method) updateWord', () => {
    it('should update the state', () => {
      instance.updateWord()
      expect(wrapper.state('currentWord')).toEqual(1)

      instance.updateWord()
      expect(wrapper.state('currentWord')).toEqual(0)
    })
  })

  describe('(Render)', () => {
    describe('with words', () => {
      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with word updated', () => {
      it('matches snapshot', () => {
        wrapper.setState({ currentWord: 1 })
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
