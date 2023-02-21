import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Popconfirm, message, Form, Input } from 'antd'
import {
  DeleteOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'

export default function NewsCategory () {

  const [dataSource, setDataSource] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <strong>{id}</strong>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
      render: (title) => (
        <div>
          <Button type='link'>{title}</Button>
        </div>
      )
    },
    {
      title: '操作',
      render: (item) => (
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
      )
    }
  ]

  // 删除
  const delOk = (item) => {
    axios.delete(`/categories/${item.id}`).then(res => {
      getData()
      message.info('删除成功')
    })
  }

  const getData = () => {
    axios.get('/categories').then(res => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }
  useEffect(() => {
    getData()
  }, [])


  const handleSave = (record) => {
    if (dataSource.find(item => item.title === record.title)) return
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.value
    }).then(res => {
      getData()
      message.success('修改成功')
    })
  }
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }}
      ></Table>
    </div>
  )
}
