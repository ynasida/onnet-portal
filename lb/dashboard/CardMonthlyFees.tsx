import React from 'react';
import { Table, Card } from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';

import styles from '@/pages/onnet-portal/core/style.less';

const CardMonthlyFees = props => {
  const { lb_account } = props;

  const columns = [
    {
      title: 'Fee name',
      dataIndex: 'fee_name',
      key: 'fee_name',
      width: '65%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      align: 'center',
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/CardMonthlyFees.png"
          />
        }
        title={formatMessage({
          id: 'reseller_portal.Current_month_services_incl_VAT',
          defaultMessage: 'Current month services, RUB (incl VAT)',
        })}
        description={
          <Table
            dataSource={lb_account.data.monthly_fees}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={record =>
              record.fee_name.replace(/[^A-Za-z0-9]/g, '') + record.quantity + record.cost
            }
          />
        }
      />
    </Card>
  );
};

export default CardMonthlyFees;