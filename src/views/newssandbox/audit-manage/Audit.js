import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd'
import {
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'

export default function Audit (props) {

  const users = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Button type='link' onClick={() => props.history.push(`/news-manage/preview/${item.id}`)}>{title}</Button>
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      render: (item) => (
        <div>
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={() => handelAudit(item, 2, 1)}></Button>
          &nbsp;
          <Button type="primary" shape="circle" icon={<CloseOutlined />} danger onClick={() => handelAudit(item, 3, 0)}></Button>
        </div>
      )
    },
  ];

  // 新闻审核
  const handelAudit = (item, auditState, publishState) => {
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      getData()
      message.info('操作成功')
    })
  }
  const getData = () => {
    axios.get('/news?auditState=1&_expand=category').then(res => {
      console.log(res.data)
      let list = res.data
      setDataSource(users.roleId === 1 ? list : [
        ...list.filter(item => item.author === users.username),
        ...list.filter(item => item.region === users.region && users.roleId === 3)
      ])
    })
  }
  useEffect(() => {
    getData()
  }, [users.username, users.region, users.roleId])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />

    </div>
  )
}
