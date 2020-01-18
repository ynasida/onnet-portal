import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Button, Icon, Table, Modal, Input } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Highlighter from 'react-highlight-words';
import ReactJson from 'react-json-view';
import AccountName from '@/pages/onnet-portal/core/components/account_name';

function info(reg_details) {
  const defaultProps = {
    theme: 'rjv-default',
    collapsed: false,
    collapseStringsAfter: 15,
    onAdd: false,
    onEdit: false,
    onDelete: false,
    displayObjectSize: false,
    enableClipboard: false,
    indentWidth: 4,
    displayDataTypes: false,
    iconStyle: 'triangle',
  };

  Modal.info({
    title: 'Registration details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={reg_details} {...defaultProps} />,
    onOk() {},
  });
}

class CurrentRegistrations extends Component {
  state = {
    searchText: '',
    currentTableLength: 0,
  };

  static getDerivedStateFromProps(props, state) {
    console.log('Inside getDerivedStateFromProps');
    console.log(props.kazoo_account.data);
    console.log(!state.registrationsLoaded);
    console.log(state);
    console.log(props);
    if (props.kazoo_account.data && !props.rs_registrations.data) {
      console.log('Inside IF getDerivedStateFromProps');
      props.dispatch({
        type: 'rs_registrations/refresh',
        payload: { account_id: props.kazoo_login.data.account_id },
      });
      return null;
    }

    return null;
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  countSelectedRegs = () => {
    if (this.state.currentTableLength) {
      return `Registrations amount: ${this.state.currentTableLength}`;
    }
    return this.props.rs_registrations.data
      ? `Registrations amount: ${this.props.rs_registrations.data.length}`
      : 'No registrations found!';
  };

  render() {
    const { rs_registrations } = this.props;

    const dataSource = rs_registrations.data
      ? rs_registrations.data.map((u, i) => ({
          key: `idx_${i}_reg_${u.username}@${u.realm}`,
          username: `${u.username}@${u.realm}`,
          source_ip: u.source_ip,
          user_agent: u.user_agent,
        }))
      : [];

    const columns = [
      {
        title: 'Account Name',
        dataIndex: 'account_name',
        key: 'account_name',
        render: (text, record) => <AccountName realm={record.key.split('@').pop(-1)} />,
      },
      {
        title: 'Device',
        dataIndex: 'username',
        key: 'username',
        ...this.getColumnSearchProps('username'),
      },
      {
        title: 'IP Address',
        dataIndex: 'source_ip',
        key: 'source_ip',
        align: 'center',
        ...this.getColumnSearchProps('source_ip'),
      },
      {
        title: 'User Agent',
        dataIndex: 'user_agent',
        key: 'user_agent',
        align: 'center',
        ...this.getColumnSearchProps('user_agent'),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        key: 'details',
        align: 'center',
        render: (text, record) => (
          <Icon
            type="info-circle"
            onClick={event => {
              console.log('IAMS INFO OnClick event: ', event);
              console.log(record);
              console.log(record.key);
              const result = rs_registrations.data.find(
                ({ username, realm }) => `${username}@${realm}` === record.username,
              );
              info(result);
            }}
          />
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        tags={
          <Tag color="blue">
            {rs_registrations.data ? rs_registrations.data.length : 'No registrations found!'}
          </Tag>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          //   pagination={{ position: 'both' }}
         // pagination={false}
          bordered
          onChange={(pagination, filter, sorter, { currentDataSource }) => {
            this.setState({
              currentTableLength: currentDataSource.length,
            });
          }}
          //          footer={() => `Footer ${this.state.currentTableLength}`}
          footer={this.countSelectedRegs}
          style={{ backgroundColor: 'white' }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ kazoo_login, kazoo_account, rs_registrations }) => ({
  kazoo_login,
  kazoo_account,
  rs_registrations,
}))(CurrentRegistrations);