import React, { useState } from 'react'
import { Layout, theme, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
const { Header } = Layout

export default function TopHeader () {

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      key: '1',
      label: '超级管理员',
    },
    {
      key: '2',
      label: '退出',
      danger: true,
    },
  ];

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
          <span style={{ paddingRight: 15 }}>欢迎</span>
          <Dropdown menu={{ items }}>
            <Avatar size='large' icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}