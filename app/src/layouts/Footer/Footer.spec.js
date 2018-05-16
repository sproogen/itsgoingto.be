/* global expect */
import React from 'react'
import Footer from 'layouts/Footer'
import JWGMediaImage from './assets/jwgmedia.png'
import { mount, shallow } from 'enzyme'

describe('(Layout) Footer', () => {
  const wrapper = shallow(<Footer />)

  it('renders as a Footer', () => {
    const wrapper = mount(<Footer />)

    expect(wrapper.name()).toBe('Footer')
  })

  it('renders as a .footer-container', () => {
    expect(wrapper.name()).toBe('div')
    expect(wrapper.hasClass('footer-container')).toBe(true)
  })

  it('renders a mailto link', () => {
    expect(wrapper.find('a[href="mailto:itsgoingtobe@jwgmedia.co.uk"]').text()).toBe('itsgoingtobe@jwgmedia.co.uk')
  })

  it('renders the jwg_logo', () => {
    wrapper.find('a[href="http://jwgmedia.co.uk"]').should.contain(<img src={JWGMediaImage} />)
  })
})
