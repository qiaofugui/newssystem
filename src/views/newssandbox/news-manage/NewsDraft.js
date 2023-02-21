import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, message, Tag, notification } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'
import axios from 'axios';

export default function NewsDraft (props) {

  const users = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <strong>{id}</strong>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Button type="link" onClick={() => props.history.push(`preview/${item.id}`)}>{title}</Button>
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
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" icon={<EditOutlined />} size='middle' onClick={() => {
              props.history.push(`/news-manage/update/${item.id}`)
            }} />
            &nbsp;
            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
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
    axios.delete(`/news/${item.id}`).then(res => {
      message.success('删除成功')
      getData()
    })
  }

  // 获取草稿箱文章列表
  const getData = () => {
    axios.get(`/news?author=${users.username}&auditState=0&_expand=category`).then(res => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }
  // 提交审核
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.info({
        message: '提交审核成功',
        description: `您可以到【审核管理/审核列表】中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  useEffect(() => {
    getData()
  }, []);

  return (
    <div style={{ minWidth: 495 }}>
      <Tag color="orange">草稿箱</Tag>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
