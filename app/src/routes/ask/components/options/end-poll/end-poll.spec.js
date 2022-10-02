import React from 'react'
import {
  render, fireEvent, screen,
} from '@testing-library/react'
import EndPoll from './end-poll'

jest.mock('react-datepicker', () => () => (<div>Mocked DatePicker</div>))
jest.mock('antd/lib/time-picker', () => () => (<div>Mocked TimePicker</div>))
jest.mock('react-rangeslider', () => () => (<div>Mocked Slider</div>))

Date.now = jest.fn(() => new Date(Date.UTC(2018, 2, 10, 10, 30, 0)).valueOf())

const defaultProps = {
  poll: { endType: 'endNever' },
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) EndPoll', () => {
    describe('(Action) onChange', () => {
      describe('input endNever', () => {
        it('should call prop updateOptions', () => {
          render(<EndPoll {...defaultProps} />)

          const endNeverCheckbox = screen.getByLabelText('Don\'t End Poll')
          fireEvent.click(endNeverCheckbox)
          expect(defaultProps.updateOptions).toHaveBeenCalledWith({
            identifier: '',
            endType: 'endNever',
          })
        })
      })

      describe('input endAt', () => {
        it('should call prop updateOptions', () => {
          render(<EndPoll {...defaultProps} />)

          const endAtCheckbox = screen.getByLabelText('End Poll At')
          fireEvent.click(endAtCheckbox)
          expect(defaultProps.updateOptions).toHaveBeenCalledWith({
            identifier: '',
            endType: 'endAt',
          })
        })
      })

      describe('input endIn', () => {
        it('should call prop updateOptions', () => {
          render(<EndPoll {...defaultProps} />)

          const endAtCheckbox = screen.getByLabelText('End Poll In')
          fireEvent.click(endAtCheckbox)
          expect(defaultProps.updateOptions).toHaveBeenCalledWith({
            identifier: '',
            endType: 'endIn',
          })
        })
      })

      // TODO: Figure out how to test callbacks for these components
      // describe('endAt DatePicker', () => {
      //   it('should call prop updateOptions', () => {
      //     const date = moment('2018-03-12')
      //     render(<EndPoll {...defaultProps} poll={{ endType: 'endAt', endAt: date }} />)

      //     wrapper.find(DatePicker).simulate('change', date)
      //     expect(props.updateOptions).toHaveBeenCalledWith({
      //       identifier : '',
      //       endAt      : date,
      //     })
      //   })
      // })

      // describe('endAt TimePicker', () => {
      //   it('should call prop updateOptions with date', () => {
      //     const date = moment('2018-03-12 10:30:00')
      //     const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt', endAt: date }} />)

      //     wrapper.find(TimePicker).simulate('change', date)
      //     expect(props.updateOptions).toHaveBeenCalledWith({
      //       identifier : '',
      //       endAt      : date,
      //     })
      //   })

      //   it('should call prop updateOptions with min date', () => {
      //     const date = moment('2018-03-10 10:45:00')
      //     const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endAt', endAt: date }} />)

      //     wrapper.find(TimePicker).simulate('change', date)
      //     expect(props.updateOptions).toHaveBeenCalledWith({
      //       identifier : '',
      //       endAt      : expect.any(moment), // One day figure out how to properly test this value
      //     })
      //   })
      // })

      // describe('endIn Slider', () => {
      //   it('should call prop updateOptions', () => {
      //     const wrapper = shallow(<EndPoll {...props} poll={{ endType: 'endIn', endIn: 5 }} />)

      //     wrapper.find(Slider).simulate('change', 6)
      //     expect(props.updateOptions).toHaveBeenCalledWith({
      //       identifier : '',
      //       endIn      : 6,
      //     })
      //   })
      // })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<EndPoll {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })

      describe('when endType is endAt', () => {
        it('matches snapshot', () => {
          const { container } = render(<EndPoll {...defaultProps} poll={{ endType: 'endAt' }} />)

          expect(container).toMatchSnapshot()
        })
      })

      describe('when endType is endIn', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<EndPoll {...defaultProps} poll={{ endType: 'endIn' }} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})
