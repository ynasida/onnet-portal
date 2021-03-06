import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import Masonry from 'react-masonry-css';
import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';
import CardAccountDetails from './CardAccountDetails';
import CardBillingDetails from './CardBillingDetails';
import CardMonthlyFees from './CardMonthlyFees';
import CardTelephonyNumbers from './CardTelephonyNumbers';
import CardInternet from './CardInternet';

const LBAccountDashboard = (props) => {
  const { dispatch, kz_account, lb_account } = props;

  useEffect(() => {
    if (kz_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kz_account.data.id },
      });
    }
  }, [kz_account]);

  if (!lb_account.data) {
    return Spin;
  }

  if (!lb_account.data.account_info) {
    return Spin;
  }

  return (
    <PageHeaderWrapper title={lb_account.data.account_info.name}>
      <Masonry
        breakpointCols={masonryBreakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <CardBillingDetails key="CardBillingDetails" />
        <CardMonthlyFees key="CardMonthlyFees" />
        <CardAccountDetails key="CardAccountDetails" />
        <CardTelephonyNumbers key="CardTelephonyNumbers" />
        <CardInternet key="CardInternet" />
      </Masonry>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account, lb_account }) => ({
  kz_account,
  lb_account,
}))(LBAccountDashboard);
