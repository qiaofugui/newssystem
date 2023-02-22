import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import { store } from '../../redux/store'
import './SideMenu.css'

import { renderItems } from '../../utils/SideMenuUtils'

const { Sider } = Layout

export default function SideMenu () {

  const [collapsed, setCollapsed] = useState(store.getState().CollapsedReducer.isCollapsed)
  useEffect(() => {
    store.subscribe(() => {
      setCollapsed(store.getState().CollapsedReducer.isCollapsed)
    })
  }, [])

  const [openKeys, setOpenKeys] = useState([])
  const [items, setItems] = useState([])
  useEffect(() => {
    setOpenKeys(['/' + history.location.pathname.split('/')[1]])

    getSildMenu()
  }, []);
  const history = useHistory()
  const getSildMenu = () => {
    axios.get('/rights?_embed=children').then(res => {
      setItems(renderItems(res.data))
      store.dispatch({
        type: 'change_sideMenu',
        payload: renderItems(res.data)
      })
    }).then(res => {
      store.subscribe(() => {
        setItems(store.getState().SideMenuReducer.sideMenu)
      })
    })
  }

  // 一次展开一个菜单
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    const rootSubmenuKeys = ['/user-manage', '/right-manage', '/news-manage', '/audit-manage', '/publish-manage']
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">全球新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[history.location.pathname]}
        items={items}
        openKeys={openKeys}
        onClick={(e) => {
          history.push(e.key)
        }}
        onOpenChange={onOpenChange}
      />
    </Sider>
  )
}