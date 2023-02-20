import React, { ReactNode } from 'react';
import './index.less';

interface TimeLineItem {
  title: string;
  content: string;
  status: string;
}

interface TimelineProps {
  items: TimeLineItem[],
  footer?: ReactNode | ((item: TimeLineItem) => ReactNode)
}

export function Timeline({items = [], footer}: TimelineProps) {
  return <div className="iotp-timeline">
    {items.map((item, index) => {
      return (
        <div className="iotp-timeline-item" key={index}>
          <div className="timeline-body">
            <div className="timeline-item-title">{item.title}</div>
            <div className="timeline-item-content">{item.content}</div>
          </div>
          {
            typeof footer === 'function' ? footer(item) : footer
          }
        </div>
      );
    })}
  </div>;
}