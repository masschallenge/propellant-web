import * as React from 'react';
import { SingleComboBox } from './SingleComboBox';
import type { ComboBoxOption, ComboBoxSize, SingleComboBoxProps } from './SingleComboBox';
import { MultiComboBox } from './MultiComboBox';
import type { MultiComboBoxOption, MultiComboBoxProps } from './MultiComboBox';

export type { ComboBoxOption, ComboBoxSize, MultiComboBoxOption };

export type ComboBoxProps =
  (SingleComboBoxProps & { multiple?: false }) | (MultiComboBoxProps & { multiple: true });

export const ComboBox = (props: ComboBoxProps) => {
  if (props.multiple) {
    const { multiple, ...multipleProps } = props;
    return <MultiComboBox {...multipleProps} />;
  }
  const { multiple, ...singleProps } = props;
  return <SingleComboBox {...singleProps} />;
};
