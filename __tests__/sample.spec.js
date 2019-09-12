/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

const props = {
  navigation: {
    navigate: jest.fn()
  }
};
describe('<App />', () => {
  const tree = shallow(<App {...props} />);
  it('Should render correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});
