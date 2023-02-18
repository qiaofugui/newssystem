import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const UserForm = forwardRef((props, ref) => {

  const [isDisabled, setIsDisabled] = useState(false)

  const users = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props]);

  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      // 1-超级管理员、2-区域管理员、3-区域编辑
      if (users.roleId === 1) {
        return false
      } else {
        return true
      }
    } else {
      if (users.roleId === 1) {
        return false
      } else {
        return item.value !== users.region
      }
    }
  }
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      // 1-超级管理员、2-区域管理员、3-区域编辑
      if (users.roleId === 1) {
        return false
      } else {
        return true
      }
    } else {
      if (users.roleId === 1) {
        return false
      } else {
        return item.id !== 3
      }
    }
  }

  return (
    <Form
      // form={form}
      ref={ref}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请填写用户名',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请填写密码',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={[
          {
            required: !isDisabled,
            message: '请填写区域',
          },
        ]}
      >
        <Select disabled={isDisabled}>
          {
            props.regionList.map(item => <Select.Option key={item.id} value={item.value} disabled={checkRegionDisabled(item)}>{item.title}</Select.Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: '',
          },
        ]}
      >
        <Select onChange={(value) => {
          if (value === '1') {
            setIsDisabled(true)
            ref.current.setFieldsValue({
              region: ''
            })
          } else {
            setIsDisabled(false)
          }
        }}>
          {
            props.roleList.map(item => (
              <Select.Option key={item.id} disabled={checkRoleDisabled(item)}>
                {item.roleName}
              </Select.Option>
            ))
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm