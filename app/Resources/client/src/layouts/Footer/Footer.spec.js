/* eslint-env mocha */
/* global expect */
import React from 'react'
import Footer from 'layouts/Footer'
import JWGMediaImage from './assets/jwgmedia.png'
import { mount, shallow } from 'enzyme'

describe('(Layout) Footer', () => {
  const wrapper = shallow(<Footer />)

  it('renders as a Footer', () => {
    const wrapper = mount(<Footer />)

    expect(wrapper.name()).to.equal('Footer')
  })

  it('renders as a .footer-container', () => {
    expect(wrapper.name()).to.equal('div')
    expect(wrapper.hasClass('footer-container')).to.equal(true)
  })

  it('renders a mailto link', () => {
    expect(wrapper.find('a[href="mailto:itsgoingtobe@jwgmedia.co.uk"]')).to.be.present()
    expect(wrapper.find('a[href="mailto:itsgoingtobe@jwgmedia.co.uk"]')).to.have.text('itsgoingtobe@jwgmedia.co.uk')
  })

  it('renders the jwg_logo', () => {
    expect(wrapper.find('a[href="http://jwgmedia.co.uk"]')).to.be.present()
    wrapper.find('a[href="http://jwgmedia.co.uk"]').should.contain(<img src={JWGMediaImage} />)
  })
})
