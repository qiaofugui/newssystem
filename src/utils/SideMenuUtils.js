import {
  HomeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
  CopyOutlined,
  FormOutlined,
  IssuesCloseOutlined,
  AppstoreOutlined,
  CarryOutOutlined,
  DiffOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons'

// 图标映射
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserSwitchOutlined />,
  '/user-manage/list': <OrderedListOutlined />,
  '/right-manage': <SafetyOutlined />,
  '/right-manage/role/list': <OrderedListOutlined />,
  '/right-manage/right/list': <UnorderedListOutlined />,
  '/news-manage': <CopyOutlined />,
  '/news-manage/add': <FormOutlined />,
  '/news-manage/draft': <IssuesCloseOutlined />,
  '/news-manage/category': <AppstoreOutlined />,
  '/audit-manage': <CarryOutOutlined />,
  '/audit-manage/audit': <DiffOutlined />,
  '/audit-manage/list': <OrderedListOutlined />,
  '/publish-manage': <CloudOutlined />,
  '/publish-manage/unpublished': <IssuesCloseOutlined />,
  '/publish-manage/published': <CheckCircleOutlined />,
  '/publish-manage/sunset': <StopOutlined />
}
const users = JSON.parse(localStorage.getItem('token'))

const renderItems = (items) => {
  // 新的空数组
  let newItems = []
  // 遍历 items 数组
  for (let i = 0; i < items.length; i++) {
    // 判断是否页面级别需要渲染
    if (items[i].pagepermisson === 1 && users.role.rights.includes(items[i].key)) {
      // 判断是否有子列表
      if (items[i].children.length === 0) { // 没有子列表
        // 取出需要的数据push到新数组里
        newItems.push({ key: items[i].key, label: items[i].title, icon: iconList[items[i].key] })
      } else { // 有子列表
        // 先push需要的数据
        newItems.push({ key: items[i].key, label: items[i].title, icon: iconList[items[i].key], children: [] })
        // 遍历items[i].children数组
        for (let j = 0; j < items[i].children.length; j++) {
          // 判断是否页面级别需要渲染
          if (items[i].children[j].pagepermisson === 1 && users.role.rights.includes(items[i].children[j].key)) {
            // 取出需要的数据
            if (newItems.length === i) {
              newItems[i - 1].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
            } else {
              if (i > newItems.length) {
                newItems[i - 2].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
              } else {
                newItems[i].children.push({ key: items[i].children[j].key, label: items[i].children[j].title, icon: iconList[items[i].children[j].key] })
              }
            }
          }
        }
      }
    }
  }
  console.log(newItems)
  return newItems
}

export {
  renderItems
}