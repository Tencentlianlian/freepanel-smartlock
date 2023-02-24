import { Cell } from 'qcloud-iot-panel-component';
import { useParams } from 'react-router-dom';
import { useUser } from '@src/hooks/useUser';

import './index.less';

export function UserSetting() {
  const { id } = useParams();
  const [{ userInfo }] = useUser({ id: id as string });
  return <div className='page user-setting'>
    用户信息设置
    <Cell
      title="用户名称"
      showArrow
      footer={
        userInfo.name
      }
    />
    <Cell.Group style={{ marginTop: 12 }}>
      <Cell
        title="权限类型"
        showArrow
      ></Cell>
      <>
        <Cell
          title="开始日期"
          showArrow
        ></Cell>
        <Cell
          title="结束日期"
          showArrow
        ></Cell>
        <Cell
          title="有效时间段"
          showArrow
        ></Cell>
        <Cell
          title="有效日"
          showArrow
        ></Cell>
      </>
    </Cell.Group>
  </div>;
}