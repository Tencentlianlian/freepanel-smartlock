import { Timeline } from '@components/Timeline';
import React from 'react';

export function Log({date}) {
  return (
    <Timeline items={[{
      title: '123',
      content: 'weee',
      status: '222'
    }]}/>
  );
}