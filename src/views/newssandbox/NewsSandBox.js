import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout, theme } from 'antd'

import SideMenu from '../../components/newssandbox/SideMenu'
import TopHeader from '../../components/newssandbox/TopHeader'

import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from './nopermission/NoPermission'

import './NewsSandBox.css'
const { Content } = Layout

export default function NewsSandBox () {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout className="site-layout">
        <TopHeader></TopHeader>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Switch>
            <Route path='/home' component={Home}></Route>
            <Route path='/user-manage/list' component={UserList}></Route>
            <Route path='/right-manage/role/list' component={RoleList}></Route>
            <Route path='/right-manage/right/list' component={RightList}></Route>

            <Redirect from='/' to='/home' exact />
            <Route path='*' component={NoPermission}></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
