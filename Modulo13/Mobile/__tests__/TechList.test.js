import React from 'react';

import TechList from '~/components/TechList';

import {render, fireEvent} from '@testing-library/react-native';

describe('TechList', () => {
  it('should be able to add new tech', () => {
    const {getByText, getByTestId} = render(<TechList />);

    const techInput = getByTestId('tech-input');
    fireEvent.changeText(techInput, 'Node.js');
    fireEvent.press(getByText('Adicionar'));

    expect(getByText('Node.js')).toBeTruthy();
    expect(techInput).toHaveProp('value', '');
  });
});
