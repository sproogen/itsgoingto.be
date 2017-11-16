/* eslint-env mocha */
/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import WordRotate from './WordRotate'

describe('(Component) WordRotate', () => {
  let wrapper
  let instance

  beforeEach(() => {
    wrapper = shallow(<WordRotate words='word1,word2' />)
    instance = wrapper.instance()
  })

  it('renders as a span', () => {
    expect(instance).to.be.instanceOf(WordRotate)
    expect(wrapper.name()).to.equal('span')
  })

  describe('(State)', () => {
    it('Should have initial state', () => {
      expect(wrapper.state()).to.deep.equal({ currentWord : 0 })
    })
  })

  describe('(Props)', () => {
    it('Should have props', () => {
      expect(instance.props.words).to.equal('word1,word2')
    })
  })

  describe('(Method) getWord', () => {
    it('Should return the word at index 0', () => {
      expect(instance.getWord(0)).to.equal('word1')
    })

    it('Should return the word at index 1', () => {
      expect(instance.getWord(1)).to.equal('word2')
    })
  })

  describe('(Method) updateWord', () => {
    it('Should update the state', () => {
      instance.updateWord()
      expect(wrapper.state()).to.deep.equal({ currentWord : 1 })

      instance.updateWord()
      expect(wrapper.state()).to.deep.equal({ currentWord : 0 })
    })
  })

  describe('(Render) WordRotate', () => {
    it('Should render the first word', () => {
      expect(wrapper.find('.word-rotate_word').at(0).text()).to.equal('word1')
    })

    it('Should render the second word', () => {
      expect(wrapper.find('.word-rotate_word').at(1).text()).to.equal('word2')
    })
  })
})
