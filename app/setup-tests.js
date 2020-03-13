/* eslint-disable import/no-extraneous-dependencies */

import { configure } from 'enzyme'
import 'should'
import 'should-enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
