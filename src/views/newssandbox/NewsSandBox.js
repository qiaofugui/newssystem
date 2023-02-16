import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import SideMenu from '../../components/newssandbox/SideMenu'
import TopHeader from '../../components/newssandbox/TopHeader'

import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from './nopermission/NoPermission'

export default function NewsSandBox () {
  return (
    <div>
      <SideMenu></SideMenu>
      <TopHeader></TopHeader>

      <Switch>
        <Route path='/home' component={Home}></Route>
        <Route path='/user-manage/list' component={UserList}></Route>
        <Route path='/right-manage/role/list' component={RoleList}></Route>
        <Route path='/right-manage/right/list' component={RightList}></Route>

        <Redirect from='/' to='/home' exact />
        <Route path='*' component={NoPermission}></Route>
      </Switch>
    </div>
  )
}
