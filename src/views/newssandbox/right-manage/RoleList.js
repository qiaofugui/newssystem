import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Modal, Tree, message } from 'antd'
import {
  UnorderedListOutlined,
  QuestionCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import axios from 'axios';

export default function RoleList () {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [treeData, setTreeData] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <strong>{id}</strong>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} size='middle' onClick={() => showModal(item)} />
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

  // 删除角色操作
  const delOk = (item) => {
    axios.patch(`/roles/${item.id}`, {
      pagepermisson: item.pagepermisson === 1 ? 0 : 1
    }).then(res => {
      console.log(res)
      getData()
      message.success('删除成功')
    })
  }

  // 获取角色列表数据
  const getData = () => {
    axios.get('/roles').then(res => {
      let newRes = []
      res.data.forEach(item => {
        if (item.pagepermisson === 1) {
          newRes.push(item)
        }
      })
      setDataSource(newRes)
    })
  }
  // 获取权限列表数据
  const getRightData = () => {
    axios.get('/rights?_embed=children').then(res => {
      setTreeData(res.data)
    })
  }
  useEffect(() => {
    getData()
    getRightData()
  }, []);


  const showModal = (item) => {
    setIsModalOpen(true)
    setCurrentRights(item.rights)
    setCurrentId(item.id)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    console.log(currentRights)
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    }).then(res => {
      getData()
      getRightData()
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // 权限设置
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked)
  }
  return (
    <div style={{minWidth:300}}>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>

      <Modal title="角色权限控制" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认"
        cancelText="取消">
        <Tree
          checkable
          treeData={treeData}
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true} // Bug
        />
      </Modal>
    </div>

  )
}
