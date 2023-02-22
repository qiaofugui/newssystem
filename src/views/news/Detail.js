import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import {
  ArrowLeftOutlined,
  HeartTwoTone
} from '@ant-design/icons'

import axios from 'axios'

import './Detail.css'
import joe from 'joe-tools'

export default function Detail (props) {

  const [newInfo, setNewInfo] = useState(null)
  const [flag, setFlag] = useState(false)

  const getDate = () => {
    axios.get(`news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data)
      setNewInfo(res.data)
      return res.data
    }).then(res => {
      axios.patch(`news/${props.match.params.id}`, {
        view: res.view + 1
      }).then(res => {
        console.log(res.data)
      })
    })
  }
  useEffect(() => {
    getDate()
  }, [])

  // 点赞
  const handleStar = () => {
    if (!flag) {
      axios.patch(`news/${props.match.params.id}`, {
        star: newInfo.star + 1
      }).then(res => {
        console.log(res)
        getDate()
        setFlag(true)
        message.success('点赞成功')
      })
    } else {
      message.warning('您已经点过赞了')
    }
  }

  return (
    <div style={{ minWidth: 880, padding: 25 }}>
      {newInfo && (
        <div className='preview'>
          <div className='header'>
            <Button style={{ border: 'none', fontSize: 16 }} icon={<ArrowLeftOutlined />} onClick={() => window.history.back()} /> {newInfo.title}
            <span className='subhead'>{newInfo.category.title}</span>
            &nbsp; &nbsp;
            <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()} />
          </div>
          <ul>
            <li>创建者：{newInfo.author}</li>
            <li>发布时间：{newInfo.publishTime ? joe.dateFormat(newInfo.createTime) : '-'}</li>
            <li>区域：{newInfo.region}</li>
            <li>访问数量：<span style={{ color: 'green' }}>{newInfo.view}</span></li>
            <li>点赞数量：<span style={{ color: 'green' }}>{newInfo.star}</span></li>
            <li>评论数量：<span style={{ color: 'green' }}>0</span></li>
          </ul>
          <div className='content' dangerouslySetInnerHTML={{ __html: newInfo.content }}>
          </div>
        </div>
      )}
    </div>
  )
}
