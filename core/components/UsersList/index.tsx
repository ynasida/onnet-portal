import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import UserParagraph from './UserParagraph';
import UserPrivLevel from './UserPrivLevel';
import CreateUserDrawer from './CreateUserDrawer';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';
import { kzUser, kzUsers } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const UsersList = props => {
  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);

  const { dispatch, settings, account, brief_users, full_users } = props;
  const formRef = React.createRef();

  useEffect(() => {
    if (brief_users.data) {
      setDataSource(brief_users.data);
    } else {
      dispatch({
        type: 'kz_brief_users/refresh',
        payload: { account_id: account.data.id },
      });
    }
  }, [brief_users]);

  if (brief_users.data) {
    if (brief_users.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const deleteChildUser = record => {
    confirm({
      title: `Do you want to delete user ${record.username}?`,
      onOk() {
        kzUser({ method: 'DELETE', account_id: account.data.id, owner_id: record.id })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'kz_brief_users/refresh',
              payload: { account_id: account.data.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      dataIndex: 'id',
      key: 'isUserEnabled',
      align: 'center',
      render: (text, record) => (
        <Switch
          size="small"
          checked={full_users[record.id] ? full_users[record.id].data.enabled : false}
          onChange={checked => onUserEnableSwitch(checked, record)}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Username', defaultMessage: 'Username' }),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: formatMessage({ id: 'core.First_name', defaultMessage: 'First name' }),
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
      render: (text, record) => (
        <UserParagraph fieldKey="first_name" owner_id={record.id} style={{ marginBottom: '0' }} />
      ),
    },
    {
      title: formatMessage({ id: 'core.Last_name', defaultMessage: 'Last Name' }),
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
      render: (text, record) => (
        <UserParagraph fieldKey="last_name" owner_id={record.id} style={{ marginBottom: '0' }} />
      ),
    },
    {
      title: formatMessage({ id: 'core.Privilege', defaultMessage: 'Privilege' }),
      dataIndex: 'priv_level',
      key: 'priv_level',
      align: 'center',
      render: (text, record) => (
        <UserPrivLevel owner_id={record.id} style={{ marginBottom: '0' }} />
      ),
    },
    {
      dataIndex: 'id',
      key: 'edit_user',
      align: 'center',
      render: (text, record) => (
        <EditOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => {
            setSelectedUser(record.id);
            dispatch({
              type: 'kz_full_users/refresh',
              payload: { account_id: account.data.id, owner_id: record.id },
            });
            setIsDrawerVisible(true);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'delete_user',
      align: 'center',
      render: (text, record) => (
        <DeleteOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => deleteChildUser(record)}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text, record) => (
        <InfoCircleOutlined
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(full_users[record.id].data);
          }}
        />
      ),
    },
  ];

  function onUserEnableSwitch(checked, record) {
    confirm({
      title: (
        <p>
          {formatMessage({ id: 'core.User', defaultMessage: 'User' })}: {record.username}
        </p>
      ),
      content: (
        <span style={{ paddingLeft: '6em' }}>
          {checked
            ? formatMessage({ id: 'core.switch_on', defaultMessage: 'Switch ON' })
            : formatMessage({ id: 'core.switch_off', defaultMessage: 'Switch OFF' })}
        </span>
      ),
      onOk() {
        kzUser({
          method: 'PATCH',
          account_id: account.data.id,
          owner_id: record.id,
          data: { enabled: checked },
        })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'kz_full_users/refresh',
              payload: { account_id: account.data.id, owner_id: record.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  const handlePagination = e => {
    console.log('handlePagination e: ', e);
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  const onDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  const onCloseCancel = props => {
    console.log('onCloseCancel props: ', props);
    formRef.current.resetFields();
    setIsCreateDrawerVisible(false);
  };

  const onCloseSubmit = props => {
    console.log('onCloseCancel props: ', props);
    formRef.current.submit();
  };

  const onFinish = values => {
      const userDataBag = {
        username: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        enaled: 'true',
        priv_level: 'admin',
        email: values.email,
        password: values.password,
      };
      kzUsers({
        method: 'PUT',
        account_id: account.data.id,
        data: userDataBag,
      }).then(uRes => {
        dispatch({
          type: 'kz_brief_users/refresh',
          payload: { account_id: account.data.id },
        });
      });
      formRef.current.resetFields();
      setIsCreateDrawerVisible(false);
  };

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'reseller_portal.accounts_users',
                defaultMessage: "Account's Users",
              })}
              <CreateUser btnstyle={{ float: 'right1' }} />
              <PlusCircleOutlined
                style={{ color: settings.primaryColor }}
                onClick={() => {
                  setIsCreateDrawerVisible(true);
                }}
              />
              <p style={{ float: 'right', display: 'inline-flex' }}>
                {formatMessage({
                  id: 'core.pagination',
                  defaultMessage: 'pagination',
                })}
                :
                <Switch
                  style={{ marginLeft: '1em', marginTop: '0.4em' }}
                  checked={!!isPaginated}
                  onChange={handlePagination}
                  size="small"
                />
              </p>
            </Fragment>
          }
          description={
            <Table
              dataSource={brief_users.data}
              columns={columns}
              pagination={isPaginated}
              size="small"
              rowKey={record => record.id}
            />
          }
        />
      </Card>
      <Drawer
        title={
          full_users[selectedUser] ? (
            <b style={{ color: settings.primaryColor }}>
              {' '}
              {full_users[selectedUser].data.username}
            </b>
          ) : null
        }
        width="50%"
        placement="right"
        onClose={onDrawerClose}
        visible={isDrawerVisible}
      >
        <EditUser selectedUser={selectedUser} />
      </Drawer>
      <Drawer
        title={<b style={{ color: settings.primaryColor }}>Create user</b>}
        width="50%"
        placement="right"
        onClose={onCloseCancel}
        visible={isCreateDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCloseCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={onCloseSubmit} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <CreateUserDrawer
          formRef={formRef}
          onFinish={onFinish}
        />
      </Drawer>
    </Fragment>
  );
};

export default connect(({ settings, kz_account, kz_brief_users, kz_full_users }) => ({
  settings,
  account: kz_account,
  brief_users: kz_brief_users,
  full_users: kz_full_users,
}))(UsersList);
