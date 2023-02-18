import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, theme, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
const { Header } = Layout

export default function TopHeader () {

  const [collapsed, setCollapsed] = useState(false)

  const history = useHistory()

  const users = JSON.parse(localStorage.getItem('token'))

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      key: '1',
      label: users.role.roleName || '',
      disabled: true
    },
    {
      key: '2',
      label: '退出',
      danger: true,

    },
  ];

  // 退出
  const onClick = ({ key }) => {
    if (key !== '2') return
    localStorage.removeItem('token')
    history.replace('/login')
  }

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      <div onClick={() => {
        setCollapsed(!collapsed)
      }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}

        <div style={{ float: 'right' }}>
          <span style={{ paddingRight: 15 }}>欢迎 <span style={{ color: '#1677ff' }}>{users.username || ''}</span> 登录</span>
          <Dropdown menu={{ items, onClick }}>
            <Avatar size='large' icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}