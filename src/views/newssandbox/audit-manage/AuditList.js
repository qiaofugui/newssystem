import { Button, Table, Tag, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function AuditList (props) {

  const [dataSource, setDataSource] = useState([])
  const users = JSON.parse(localStorage.getItem('token'))

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        if (item.auditState === 1) {
          return <Button type='primary' ghost onClick={() => {
            handelRevert(item)
          }}>撤销</Button>
        } else if (item.auditState === 2) {
          return <Button type='primary' onClick={() => {
            handelPublish(item)
          }}>发布</Button>
        } else {
          return <Button type='primary' danger onClick={() => {
            handelUpdate(item)
          }}>修改</Button>
        }
      }
    },
  ];

  // 撤销
  const handelRevert = (item) => {
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      getAuditList()
      notification.info({
        message: `撤销成功`,
        description: `您可以到【新闻管理/草稿箱】中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  // 更新
  const handelUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  // 发布
  const handelPublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      getAuditList()
      notification.info({
        message: `发布成功`,
        description: `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  const getAuditList = () => {
    axios.get(`/news?author=${users.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }
  useEffect(() => {
    getAuditList()
  }, [])

  return (
    <div style={{ minWidth: 460 }}>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
