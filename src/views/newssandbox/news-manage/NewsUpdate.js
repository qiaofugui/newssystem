import React, { useState, useEffect, useRef } from 'react'
import { Button, Steps, Form, Input, Select, message, notification } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor'

import './NewsAdd.css'

export default function NewsUpdate (props) {

  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState()
  const [content, setContent] = useState()
  const [newInfo, setNewInfo] = useState(null)

  const NewsForm = useRef()

  useEffect(() => {
    axios.get('/categories').then(res => {
      console.log(res.data)
      setCategoryList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data)
      setNewInfo(res.data)
      NewsForm.current.setFieldsValue({
        title: res.data.title,
        categoryId: res.data.categoryId
      })
      setContent(res.data.content)
    })
  }, [props.match.params.id])

  // 下一步
  const handelNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err)
      })
    } else {
      if (content === undefined || content.trim() === '' || content.trim() === '<p><br></p>' || (content.replace(/\s+/ig, '').replace(/&nbsp;/ig, "")) === '<p></p>') {
        message.error('请输入新闻内容')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  // 上一步
  const handelPrevious = () => {
    setCurrent(current - 1)
  }

  // 保存草稿/提交
  const handelSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      "content": content,
      "auditState": auditState, // 0-草稿箱、1-待审核、2-已审核、3-驳回
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: '更新成功',
        description: `您可以到${auditState === 0 ? '【新闻管理/草稿箱】' : '【审核管理/审核列表】'}中查看您的新闻`,
        placement: 'bottomRight'
      })
      message.success(`${auditState === 0 ? '保存' : '提交'}成功`)
    })
  }
  return (
    <div>
      <h1 style={{ fontSize: 19, padding: '0 25px 25px 0' }}><Button style={{ border: 'none', fontSize: 16 }} icon={<ArrowLeftOutlined />} onClick={() => window.history.back()} /> 更新新闻</h1>
      <div>
        <Steps
          current={current}
          items={[
            {
              title: '基本信息',
              description: '新闻标题。新闻分类',
            },
            {
              title: '新闻内容',
              description: '新闻主体内容',
            },
            {
              title: '新闻提交',
              description: '保存草稿或提交审核',
            },
          ]}
        />

        <div style={{ margin: '25px 0' }}>
          <div className={current === 0 ? '' : 'hidden'}>
            <Form
              name="basic"
              style={{ maxWidth: 600 }}
              ref={NewsForm}
            >
              <Form.Item
                label="新闻标题"
                name="title"
                rules={[{ required: true, message: '请填写新闻标题' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="新闻分类"
                name="categoryId"
                rules={[{ required: true, message: '请选择新闻分类' }]}
              >
                <Select>
                  {categoryList.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
          <div className={current === 1 ? '' : 'hidden'}>
            <NewsEditor getContext={(value) => {
              setContent(value)
            }} content={content}></NewsEditor>
          </div>
          <div className={current === 2 ? '' : 'hidden'}>
            新闻提交
          </div>
        </div>

        {current < 2 && <Button type='primary' onClick={handelNext}>下一步</Button>}
        {current === 2 && (
          <span>
            <Button type='dashed' onClick={() => handelSave(0)}>保存草稿</Button>
            &nbsp;
            <Button type='primary' onClick={() => handelSave(1)}>提交审核</Button>
          </span>
        )}
        &nbsp;
        {current > 0 && <Button onClick={handelPrevious}>上一步</Button>}
      </div>
    </div>
  )
}
