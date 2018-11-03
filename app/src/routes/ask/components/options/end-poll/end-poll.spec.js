/* global expect, jest */
import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment'
import Slider from 'react-rangeslider'
import DatePicker from 'react-datepicker'
import TimePicker from 'antd/lib/time-picker'
import { EndPoll } from './end-poll'

Date.now = jest.fn(() => new Date(Date.UTC(2018, 2, 10, 10, 30, 0)).valueOf())

const props = {
  poll          : { endType: 'endNever' },
  updateOptions : jest.fn(),
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) EndPoll', () => {
    describe('(Action) onChange', () => {
      describe('input endNever', () => {
        it('should call prop updateOptions', () => {
          const wrapper = mount(<EndPoll {...props} />)

          wrapper.find('#end-never').simulate('change')
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endType    : 'endNever',
          })
        })
      })

      describe('input endAt', () => {
        it('should call prop updateOptions', () => {
          const wrapper = mount(<EndPoll {...props} />)

          wrapper.find('#end-at').simulate('change')
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endType    : 'endAt',
          })
        })
      })

      describe('input endIn', () => {
        it('should call prop updateOptions', () => {
          const wrapper = mount(<EndPoll {...props} />)

          wrapper.find('#end-in').simulate('change')
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endType    : 'endIn',
          })
        })
      })

      describe('endAt DatePicker', () => {
        it('should call prop updateOptions', () => {
          const date = moment('2018-03-12')
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt', endAt: date }} />)

          wrapper.find(DatePicker).simulate('change', date)
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endAt      : date,
          })
        })
      })

      describe('endAt TimePicker', () => {
        it('should call prop updateOptions with date', () => {
          const date = moment('2018-03-12 10:30:00')
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt', endAt: date }} />)

          wrapper.find(TimePicker).simulate('change', date)
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endAt      : date,
          })
        })

        it('should call prop updateOptions with min date', () => {
          const date = moment('2018-03-10 10:45:00')
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt', endAt: date }} />)

          wrapper.find(TimePicker).simulate('change', date)
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endAt      : expect.any(moment), // One day figure out how to properly test this value
          })
        })
      })

      describe('endIn Slider', () => {
        it('should call prop updateOptions', () => {
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endIn', endIn: 5 }} />)

          wrapper.find(Slider).simulate('change', 6)
          expect(props.updateOptions).toHaveBeenCalledWith({
            identifier : '',
            endIn      : 6,
          })
        })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<EndPoll {...props} />)

        expect(wrapper).toMatchSnapshot()
      })

      describe('when endType is endAt', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt' }} />)

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when endType is endIn', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endIn' }} />)

          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})