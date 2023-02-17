import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Switch, Modal, message } from 'antd'
import {
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import axios from 'axios'

import UserForm from '../../../components/user-manage/UserForm'

export default function UserList () {

  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [current, setCurrent] = useState(null)

  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

  const addFrom = useRef(null)
  const updateFrom = useRef(null)

  const getData = () => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }
  const getRoleList = () => {
    axios.get('http://localhost:5000/roles').then(res => {
      console.log(res.data)
      setRoleList(res.data)
    })
  }
  const getRegionList = () => {
    axios.get('http://localhost:5000/regions').then(res => {
      console.log(res.data)
      setRegionList(res.data)
    })
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.label,
          value: item.value
        })),
        { text: '全球', value: '全球' },
      ],
      onFilter: (value, record) => {
        if (value === '全球') {
          return record.region === ''
        }
        return record.region === value
      },
      render: (region) => <strong>{region === '' ? '全球' : region}</strong>
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => <span>{role.roleName}</span>

    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handelChange(item)} />
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" icon={<EditOutlined />} size='middle' disabled={item.default} onClick={() => handleUpdate(item)} />
            &nbsp;
            <Popconfirm
              placement="topRight"
              title="确定删除吗？"
              okText='确定'
              cancelText='取消'
              onConfirm={() => delOk(item)}
              disabled={item.default}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red',
                  }}
                />
              }
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} size='middle' disabled={item.default} />
            </Popconfirm>
          </div>
        )
      }
    },
  ]

  // 确认删除
  const delOk = (item) => {
    axios.delete(`http://localhost:5000/users/${item.id}`).then(res => {
      getData()
      message.success('删除成功')
    })
  }

  // 添加用户
  const addFormOk = () => {
    addFrom.current.validateFields().then(res => {
      console.log(res)
      axios.post('http://localhost:5000/users', {
        ...res,
        "roleState": true,
        "default": false,
      }).then(res => {
        getData()
        setOpen(false)
        addFrom.current.resetFields()
        message.success('添加成功')
      })
    }).catch(err => {
      console.log(err)
    })
  }
  // 更新用户
  const updateFormOk = () => {
    updateFrom.current.validateFields().then(res => {
      if (res.roleId === '超级管理员' || res.roleId === '1') {
        res.roleId = 1
      } else if (res.roleId === '区域管理员' || res.roleId === '2') {
        res.roleId = 2
      } else if (res.roleId === '区域编辑' || res.roleId === '3') {
        res.roleId = 3
      }
      axios.patch(`http://localhost:5000/users/${current.id}`, {
        ...res,
      }).then(res => {
        getData()
        setOpenUpdate(false)
        message.success('更新成功')
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 用户状态改变
  const handelChange = (item) => {
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: !item.roleState
    }).then(res => {
      getData()
    })
  }

  // 编辑/更新用户信息
  const handleUpdate = async (item) => {
    await setOpenUpdate(true)
    if (item.roleId === '1') {
      // 禁用
      setIsUpdateDisabled(true)
    } else {
      // 取消禁用
      setIsUpdateDisabled(false)
    }
    updateFrom.current.setFieldsValue({
      ...item,
      roleId: item.role.roleName
    })
    setCurrent(item)
  }

  useEffect(() => {
    getData()
    getRoleList()
    getRegionList()
  }, [])

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

      <Modal
        open={open}
        title="添加用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
          setIsUpdateDisabled(false)
          addFrom.current.resetFields()
        }}
        onOk={addFormOk}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={addFrom} />
      </Modal>
      <Modal
        open={openUpdate}
        title="更新用户信息"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setOpenUpdate(false)
        }}
        onOk={updateFormOk}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={updateFrom} isUpdateDisabled={isUpdateDisabled} />
      </Modal>
    </div>
  )
}
