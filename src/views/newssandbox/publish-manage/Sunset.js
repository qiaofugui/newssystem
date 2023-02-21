import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset () {

  // 3 已下线
  const { dataSource, handelDelete } = usePublish(3)

  return (
    <div style={{ minWidth: 500 }}>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' danger onClick={() => handelDelete(id)}>删除</Button>} />
    </div>
  )
}
