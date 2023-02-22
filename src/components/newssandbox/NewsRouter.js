import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Spin } from 'antd'

import Home from '../../views/newssandbox/home/Home'
import UserList from '../../views/newssandbox/user-manage/UserList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import RightList from '../../views/newssandbox/right-manage/RightList'
import NoPermission from '../../views/newssandbox/nopermission/NoPermission'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/newssandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/newssandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'
import Audit from '../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../../views/newssandbox/publish-manage/Unpublished'
import Published from '../../views/newssandbox/publish-manage/Published'
import Sunset from '../../views/newssandbox/publish-manage/Sunset'
import axios from 'axios'
import { connect } from 'react-redux'

const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/news-manage/preview/:id': NewsPreview,
  '/news-manage/update/:id': NewsUpdate,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset
}

function NewsRouter (props) {

  const [backRouterList, setBackRouterList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouterList([...res[0].data, ...res[1].data])
    })
  }, []);


  const users = JSON.parse(localStorage.getItem('token'))

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const checkUserPermission = (item) => {
    return users.role.rights.includes(item.key)
  }
  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {/* <Route path='/home' component={Home}></Route>
      <Route path='/user-manage/list' component={UserList}></Route>
      <Route path='/right-manage/role/list' component={RoleList}></Route>
      <Route path='/right-manage/right/list' component={RightList}></Route> */}
        {backRouterList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route key={item.key} path={item.key} component={LocalRouterMap[item.key]} exact />
          }
          return null
        })}

        <Redirect from='/' to='/home' exact />
        {
          backRouterList.length > 0 && <Route path='*' component={NoPermission}></Route>
        }
      </Switch>
    </Spin>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.LoadingReducer.isLoading
  }
}
export default connect(mapStateToProps)(NewsRouter)