import React, { useEffect } from 'react'
import { Layout, theme } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import SideMenu from '../../components/newssandbox/SideMenu'
import TopHeader from '../../components/newssandbox/TopHeader'
import NewsRouter from '../../components/newssandbox/NewsRouter'

import './NewsSandBox.css'
const { Content } = Layout

export default function NewsSandBox () {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  });
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
            overflow: 'auto'
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
