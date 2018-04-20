/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { sequelize } from '../src/models'

Enzyme.configure({ adapter: new Adapter() })

afterAll(async () => sequelize.close())
