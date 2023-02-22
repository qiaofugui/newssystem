import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, Col, Row, List, Button } from 'antd';
import _ from 'loadsh'

export default function News (props) {

  const [list, setList] = useState([])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      console.log(res.data)
      console.log(Object.entries(_.groupBy(res.data, item => item.category.title)))
      setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, []);

  return (
    <div style={{ padding: 20, minWidth: 680 }}>
      <h2 style={{ color: '#333', fontWeight: 700, textAlign: 'left', paddingLeft: 20 }}>全球大新闻 &nbsp;<span style={{ color: '#999', fontWeight: 400, fontSize: 16 }}>查看新闻</span> <span><Button type='link' onClick={() => props.history.push('/login')}>去登录</Button></span></h2>

      <Row gutter={[16, 16]}>
        {list.map(item => (
          <Col span={8} key={item[0]}>
            <Card title={item[0]} bordered={true} hoverable={true}>
              <List
                dataSource={item[1]}
                pagination={{ pageSize: 3 }}
                renderItem={(data) => (
                  <List.Item>
                    <Button type='link' onClick={() => {
                      props.history.push(`/detail/${data.id}`)
                    }}>{data.title}</Button>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

        ))}
      </Row>
    </div>
  )
}
