import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, Table, Input, Switch } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';
import MoneyFormat from '@/pages/onnet-portal/core/components/MoneyFormat';
import Highlighter from 'react-highlight-words';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from '@/pages/onnet-portal/core/style.less';

const CardCDR = props => {
  let searchInput;

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [searchText, setSearchText] = useState('');
  const [currentTableLength, setCurrentTableLength] = useState(0);
  const [currentFilter, setCurrentFilter] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const { lb_statistics } = props;

  useEffect(() => {
    if (lb_statistics.data) {
      const { cdrs } = lb_statistics.data;
      if (cdrs) {
        const currTL = cdrs.length;
        const totalMinutes = cdrs.reduce((acc, call) => acc + parseInt(call.duration, 10), 0);
        console.log('useEffect totalMinutes: ', totalMinutes);
        const totalAmount = cdrs.reduce((acc, call) => acc + parseFloat(call.amount), 0.0);
        console.log('useEffect totalAmount: ', totalAmount);
        setCurrentTableLength(currTL);
        setCurrentFilter({});
        setSearchText('');
        setTotalAmount(totalAmount);
        setTotalMinutes(totalMinutes);
      }
    }
  }, [lb_statistics]);

  const handlePagination = e => {
    console.log('handlePagination e: ', e);
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  const countSelectedRows = () => `Selected rows amount: ${currentTableLength}`;

  const columns = [
    {
      title: formatMessage({ id: 'reseller_portal.Start_time', defaultMessage: 'Start time' }),
      dataIndex: 'timefrom',
      render: text => <Moment format="YYYY-MM-DD HH:mm:ss">{text}</Moment>,
      key: 'timefrom',
    },
    {
      title: formatMessage({ id: 'reseller_portal.Caller', defaultMessage: 'Caller' }),
      dataIndex: 'numfrom',
      filteredValue: currentFilter.numfrom || '',
      key: 'numfrom',
      align: 'center',
      ...getColumnSearchProps('numfrom'),
    },
    {
      title: formatMessage({ id: 'reseller_portal.Callee', defaultMessage: 'Callee' }),
      dataIndex: 'numto',
      filteredValue: currentFilter.numto || '',
      key: 'numto',
      align: 'center',
      ...getColumnSearchProps('numto'),
    },
    {
      title: formatMessage({ id: 'reseller_portal.Min', defaultMessage: 'Min' }),
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'reseller_portal.Rub', defaultMessage: 'Rub' }),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
  ];

  const footer = () => (
    <div style={{ width: '100%' }}>
      <div style={{ paddingRight: '1em', display: 'inline' }}>
        {formatMessage({ id: 'reseller_portal.Total_calls', defaultMessage: 'Total calls' })}:{' '}
        {currentTableLength}
      </div>
      <div style={{ paddingRight: '0.5em', float: 'right', display: 'inline' }}>
        <MoneyFormat amount={totalAmount} />
      </div>
      <div style={{ paddingRight: '1em', float: 'right', display: 'inline' }}>
        {totalMinutes}{' '}
        {formatMessage({ id: 'reseller_portal.minutes_short', defaultMessage: 'min.' })}
      </div>
      <div style={{ paddingRight: '1em', float: 'right', display: 'inline' }}>
        {formatMessage({
          id: 'reseller_portal.Total_all_pages',
          defaultMessage: 'Total (all pages)',
        })}
        :
      </div>
    </div>
  );

  return (
    <Card className={styles.card}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/CardCDR.png"
          />
        }
        title={
          <span>
            {formatMessage({
              id: 'reseller_portal.Calls_report',
              defaultMessage: 'Calls report',
            })}
            <p style={{ float: 'right', display: 'inline-flex' }}>
              {formatMessage({
                id: 'core.pagination',
                defaultMessage: 'pagination',
              })}
              :
              <Switch
                style={{ marginLeft: '1em' }}
                checked={!!isPaginated}
                onChange={handlePagination}
              />
            </p>
          </span>
        }
        description={
          <Table
            bordered
            dataSource={lb_statistics.data ? lb_statistics.data.cdrs : []}
            columns={columns}
            pagination={isPaginated}
            loading={lb_statistics.is_loading}
            size="small"
            rowKey={record =>
              record.timefrom.toString().replace(/[^A-Za-z0-9]/g, '') +
              record.numfrom.toString().replace(/[^A-Za-z0-9]/g, '') +
              record.numto.toString().replace(/[^A-Za-z0-9]/g, '')
            }
            onRow={(record, rowIndex) => ({
              onClick: event => {
                console.log('Clicked row event: ', event);
                console.log('Clicked row rowIndex: ', rowIndex);
                console.log('Clicked row record: ', record);
              },
            })}
            onChange={(filter, sorter, { currentDataSource = [] }) => {
              const totalMinutes = currentDataSource.reduce(
                (acc, call) => acc + parseInt(call.duration, 10),
                0,
              );
              console.log('onChange totalMinutes: ', totalMinutes);
              const totalAmount = currentDataSource.reduce(
                (acc, call) => acc + parseFloat(call.amount),
                0.0,
              );
              console.log('onChange totalAmount: ', totalAmount);
              console.log('onChange sorter: ', sorter);
              setCurrentTableLength(currentDataSource.length);
              setCurrentFilter(filter);
              setTotalAmount(totalAmount);
              setTotalMinutes(totalMinutes);
            }}
            footer={footer}
            style={{ backgroundColor: 'white' }}
          />
        }
      />
    </Card>
  );
};

export default connect(({ lb_statistics }) => ({
  lb_statistics,
}))(CardCDR);
