import React from 'react'
import createStore from 'store/createStore'
import PageLayout from 'layouts/PageLayout'
import Footer from 'components/Footer'
import Loader from 'components/Loader'
import { mount } from 'enzyme'

const store = createStore(window.__INITIAL_STATE__)

describe('(Layout) PageLayout', () => {
  const wrapper = mount(<PageLayout store={store} />)

  it('renders as a .container', () => {
    expect(wrapper.hasClass('container')).to.equal(true)
  })

  it('renders the footer', () => {
    expect(wrapper.find(Footer)).to.have.length(1)
  })

  it('renders the loader', () => {
    expect(wrapper.find(Loader)).to.have.length(1)
  })

  it('renders its children inside of the viewport', () => {
    const Child = () => <h2>child</h2>
    mount(
      <PageLayout store={store}>
        <Child />
      </PageLayout>
    )
    .find('.page-layout__viewport')
    .should.contain(<Child />)
  })
})
