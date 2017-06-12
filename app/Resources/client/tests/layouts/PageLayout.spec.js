import React from 'react'
import PageLayout from 'layouts/PageLayout/PageLayout'
import Footer from 'components/Footer/Footer'
import Loader from 'components/Loader/Loader'
import { shallow } from 'enzyme'

describe('(Layout) PageLayout', () => {
  it('renders as a .container', () => {
    const wrapper = shallow(<PageLayout />)
    expect(wrapper.hasClass('container')).to.equal(true)
  })

  it('renders the footer', () => {
    const wrapper = shallow(<PageLayout />)
    expect(wrapper.find(Footer)).to.have.length(1)
  })

  it('renders the loader', () => {
    const wrapper = shallow(<PageLayout />)
    expect(wrapper.find(Loader)).to.have.length(1)
  })

  it('renders its children inside of the viewport', () => {
    const Child = () => <h2>child</h2>
    shallow(
      <PageLayout>
        <Child />
      </PageLayout>
    )
    .find('.page-layout__viewport')
    .should.contain(<Child />)
  })
})
