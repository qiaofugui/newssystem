import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published () {

  // 2 已发布
  const { dataSource,handelSunset } = usePublish(2)

  return (
    <div style={{ minWidth: 500 }}>
      <NewsPublish dataSource={dataSource}  button={(id)=><Button type='primary' onClick={()=>handelSunset(id)}>下线</Button>}  />
    </div>
  )
}
