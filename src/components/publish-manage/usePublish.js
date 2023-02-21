import { useEffect, useState } from 'react'
import axios from 'axios';
import { message } from 'antd';

function usePublish (type) {
  const [dataSource, setSataSource] = useState([]);

  const users = JSON.parse(localStorage.getItem('token'))
  const getData = () => {
    axios.get(`/news?author=${users.username}&publishState=${type}&_expand=category`).then(res => {
      console.log(res.data)
      setSataSource(res.data)
    })
  }
  useEffect(() => {
    getData()
  }, []);

  // 发布
  const handelPublish = (id) => {
    axios.patch(`/news/${id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      getData()
      message.success('发布成功')
    })
  }
  // 下线
  const handelSunset = (id) => {
    axios.patch(`/news/${id}`, {
      publishState: 3,
    }).then(res => {
      getData()
      message.success('下线成功')
    })
  }
  // 删除
  const handelDelete = (id) => {
    axios.delete(`/news/${id}`).then(res => {
      getData()
      message.success('删除成功')
    })
  }

  return {
    dataSource,
    handelPublish,
    handelSunset,
    handelDelete
  }
}
export default usePublish