import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
  CopyOutlined,
  FormOutlined,
  IssuesCloseOutlined,
  AppstoreOutlined,
  CarryOutOutlined,
  DiffOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import './SideMenu.css'

const { Sider } = Layout

// 图标映射
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserSwitchOutlined />,
  '/user-manage/list': <OrderedListOutlined />,
  '/right-manage': <SafetyOutlined />,
  '/right-manage/role/list': <OrderedListOutlined />,
  '/right-manage/right/list': <UnorderedListOutlined />,
  '/news-manage': <CopyOutlined />,
  '/news-manage/add': <FormOutlined />,
  '/news-manage/draft': <IssuesCloseOutlined />,
  '/news-manage/category': <AppstoreOutlined />,
  '/audit-manage': <CarryOutOutlined />,
  '/audit-manage/audit': <DiffOutlined />,
  '/audit-manage/list': <OrderedListOutlined />,
  '/publish-manage': <CloudOutlined />,
  '/publish-manage/unpublished': <IssuesCloseOutlined />,
  '/publish-manage/published': <CheckCircleOutlined />,
  '/publish-manage/sunset': <StopOutlined />
}


export default function SideMenu () {

  const users = JSON.parse(localStorage.getItem('token'))
  const renderItems = (items) => {
    console.log()
    // 新的空数组
    let newItems = []
    // 遍历 items 数组
    for (let i = 0; i < items.length; i++) {
      // 判断是否页面级别需要渲染
      if (items[i].pagepermisson === 1 && users.role.rights.includes(items[i].key)) {
        // 判断是否有子列表
        if (items[i].children.length === 0) { // 没有子列表
          // 取出需要的数据push到新数组里
          newItems.push({ key: items[i].key, label: items[i].title, icon: iconList[items[i].key] })
        } else { // 有子列表
          // 先push需要的数据
          newItems.push({ key: items[i].key, label: items[i].title, icon: iconList[items[i].key], children: [] })
          // 遍历items[i].children数组
          for (let j = 0; j < items[i].children.length; j++) {
            // 判断是否页面级别需要渲染
            if (items[i].children[j].pagepermisson === 1 && users.role.rights.includes(items[i].children[j].key)) {
              // 取出需要的数据
              if (newItems.length === i) {
                newItems[i - 1].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
              } else {
                if (i > newItems.length) {
                  newItems[i - 2].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
                } else {
                  newItems[i].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
                }
              }
            }
          }
        }
      }
    }
    console.log(newItems)
    return newItems
  }

  const [openKeys, setOpenKeys] = useState([])
  const [items, setItems] = useState([])
  useEffect(() => {
    setOpenKeys(['/' + history.location.pathname.split('/')[1]])

    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setItems(renderItems(res.data))
    })
  }, []);
  const history = useHistory()

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
    <Sider trigger={null} collapsible /* collapsed={collapsed} */>
      <div className="logo" >NewSystem</div>
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
