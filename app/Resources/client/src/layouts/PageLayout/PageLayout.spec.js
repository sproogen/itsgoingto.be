/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { Cookies } from 'react-cookie'
import { PageLayout } from 'layouts/PageLayout/PageLayout'
import Footer from 'layouts/Footer'
import Loader from 'components/Loader'

describe('(Layout) PageLayout', () => {
  const Child = () => <h2>child</h2>
  const props = {
    children  : <Child />,
    isLoading : false,
    hasUser   : false,
    clearUser : () => {},
    cookies   : new Cookies(),
  }
  const wrapper = shallow(<PageLayout {...props} />)

  it('renders as a .container', () => {
    expect(wrapper.hasClass('container')).toBe(true)
  })

  it('renders the footer', () => {
    expect(wrapper.find(Footer)).toHaveLength(1)
  })

  it('renders the loader', () => {
    expect(wrapper.find(Loader)).toHaveLength(1)
  })

  it('renders its children inside of the viewport', () => {
    wrapper
    .find('.page-layout__viewport')
    .should.contain(<Child />)
  })
})
