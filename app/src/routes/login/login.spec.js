/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Cookies } from 'react-cookie'
import { Login } from './login'

const props = {
  postLogin: jest.fn(),
  hasUser: false,
  setLoading: jest.fn(),
  clearUser: jest.fn(),
  cookies: new Cookies(),
}

describe('(Route) Login', () => {
  // describe('(Lifecycle) componentDidMount', () => {
  //   describe('has user', () => {
  //     it('should call clearUser', () => {
  //     })

  //     it('should remove cookie', () => {
  //     })
  //   })
  //   it('should set loading false', () => {
  //   })
  // })

  // describe('(Action) Submit click', () => {
  //   describe('validation', () => {
  //     it('should resolve empty promise if validations fails', () => {
  //     })

  //     describe('username', () => {
  //       it('should add error if fails validation', () => {
  //       })

  //       it('should remove error if fails validation', () => {
  //       })
  //     })

  //     describe('password', () => {
  //       it('should add error if fails validation', () => {
  //       })

  //       it('should remove error if fails validation', () => {
  //       })
  //     })
  //   })

  //   it('should call postLogin if validation passes', () => {
  //   })

  //   describe('postLogin success', () => {
  //     it('should call setLoading with true', () => {
  //     })

  //     it('should set a user token cookie', () => {
  //     })

  //     it('should redirect to /admin', () => {
  //     })
  //   })

  //   describe('postLogin failure', () => {
  //     it('should set state with api errors', () => {
  //     })

  //     it('should set state with unknown error', () => {
  //     })
  //   })
  // })

  // describe('(Action) Username onChange', () => {
  //   it('should update state', () => {
  //   })

  //   it('should remove error if passes validation', () => {
  //   })

  //   it('should not remove error if fails validation', () => {
  //   })
  // })

  // describe('(Action) Password onChange', () => {
  //   it('should update state', () => {
  //   })

  //   it('should remove error if passes validation', () => {
  //   })

  //   it('should not remove error if fails validation', () => {
  //   })
  // })

  // describe('(Action) Password onKeyPress', () => {
  //   it('should emit \'login-submit\' to eventBus', () => {
  //   })
  // })

  describe('(Render)', () => {
    describe('initial login page', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Login {...props} />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    // describe('with data', () => {
    //   it('matches snapshot', () => {
    //     const wrapper = shallow(<Login {...props} />)

    //     expect(wrapper).toMatchSnapshot()
    //   })
    // })

    // describe('with username error', () => {
    //   it('matches snapshot', () => {
    //     const wrapper = shallow(<Login {...props} />)

    //     expect(wrapper).toMatchSnapshot()
    //   })
    // })

    // describe('with password error', () => {
    //   it('matches snapshot', () => {
    //     const wrapper = shallow(<Login {...props} />)

    //     expect(wrapper).toMatchSnapshot()
    //   })
    // })

    // describe('with api error', () => {
    //   it('matches snapshot', () => {
    //     const wrapper = shallow(<Login {...props} />)

    //     expect(wrapper).toMatchSnapshot()
    //   })
    // })

    // describe('with loading', () => {
    //   it('matches snapshot', () => {
    //     const wrapper = shallow(<Login {...props} />)

    //     expect(wrapper).toMatchSnapshot()
    //   })
    // })
  })
})
