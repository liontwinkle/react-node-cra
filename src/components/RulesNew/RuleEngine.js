/* eslint-disable import/prefer-default-export */
import { memo } from 'react';

export const View = memo(({ name }) => `Hi, I'm ${name}`);
