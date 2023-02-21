import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './index.less';

interface TimeLineItem {
  title: ReactNode;
  content: ReactNode;
  status: 'info' | 'alert';
}

interface TimelineProps {
  items: TimeLineItem[],
  footer?: ReactNode | ((item: TimeLineItem) => ReactNode)
}

export function Timeline({ items = [], footer }: TimelineProps) {
  console.log({items});
  return <div className="iotp-timeline">
    {items.map((item, index) => {
      return (
        <div className={classNames('iotp-timeline-item', item.status)} key={index}>
          <div className="timeline-item-dot"></div>
          <div className="timeline-item-body">
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