import React from 'react'
import { Table, Button } from 'antd'
import { useHistory } from 'react-router-dom';

export default function NewsPublish (props) {

  const history = useHistory()
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Button type='link' onClick={() => history.push(`/news-manage/preview/${item.id}`)}>{title}</Button>
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
      render: (item) => props.button(item.id)
    },
  ];

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />

    </div>
  )
}

