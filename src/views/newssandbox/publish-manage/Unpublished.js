import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Unpublished () {

  // 1 待发布
  const { dataSource, handelPublish } = usePublish(1)

  return (
    <div style={{ minWidth: 500 }}>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=>handelPublish(id)}>发布</Button>} />
    </div>
  )
}
