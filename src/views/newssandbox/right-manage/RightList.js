import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Popconfirm, message, Popover, Switch } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import axios from 'axios';
import { store } from '../../../redux/store'
import { renderItems } from '../../../utils/SideMenuUtils'

export default function RightList () {

  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong>{id}</strong>
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <Tag color="magenta">{key}</Tag>
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Popover placement="topRight" content={<div>关闭此页面 <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} /></div>} title='页面配置项' trigger={item.pagepermisson === undefined ? '' : 'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} size='middle' disabled={item.pagepermisson === undefined} />
            </Popover>
            &nbsp;
            <Popconfirm
              placement="topRight"
              title="确定删除吗？"
              okText='确定'
              cancelText='取消'
              onConfirm={() => delOk(item)}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red',
                  }}
                />
              }
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} size='middle' />
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  // 确认删除
  const delOk = (item) => {
    delMethod(item)
  }
  // 删除方法
  const delMethod = (item) => {
    // 当前页面同步状态 + 后端同步
    if (item.grade === 1) {
      // setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson === 1 ? 0 : 1
      }).then(res => {
        console.log(res)
        getData()
        message.success('删除成功')
        axios.get('/rights?_embed=children').then(res => {
          store.dispatch({
            type: 'change_sideMenu',
            payload: renderItems(res.data)
          })
        })
      })
    } else {
      // let list = dataSource.filter(data => data.id === item.rightId)
      // list[0].children = list[0].children.filter(data => data.id !== item.id)
      // setDataSource([...dataSource])
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson === 1 ? 0 : 1
      }).then(res => {
        console.log(res)
        getData()
        message.success('删除成功')
      })
    }

  }
  // 页面配置项开关
  const switchMethod = (item) => {
    // item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    // setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson === 1 ? 0 : 1
      }).then(res => {
        console.log(res.data)
        getData()
        axios.get('/rights?_embed=children').then(res => {
          store.dispatch({
            type: 'change_sideMenu',
            payload: renderItems(res.data)
          })
        })
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson === 1 ? 0 : 1
      }).then(res => {
        console.log(res)
        getData()
      })
    }
  }

  // 获取权限列表数据数据
  const getData = () => {
    axios.get('/rights?_embed=children').then(res => {
      console.log(res.data)
      res.data.forEach(item => {
        if (item.children.length === 0) {
          item.children = null
        }
      })
      setDataSource(res.data)
    })
  }
  useEffect(() => {
    getData()
  }, []);

  return (
    <div style={{ minWidth: 495 }}>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
