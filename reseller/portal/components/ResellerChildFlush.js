import React from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';

const ResellerChildFlush = props => {
  const { dispatch, rs_child_account } = props;

  const clearRsChild = () => {
    dispatch({
      type: 'rs_child_account/flush',
    });
    dispatch({
      type: 'rs_child_users/flush',
    });
  };

  if (!rs_child_account.data) {
    return null;
  }

  return (
    <Button key="ResellerChildFlushKey" type="link" onClick={clearRsChild}>
      <Icon type="user-delete" />
    </Button>
  );
};

export default connect(({ rs_child_account }) => ({ rs_child_account }))(ResellerChildFlush);