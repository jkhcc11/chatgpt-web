import { fetchReource } from '@/api'
import { ssHour } from '@/utils/storage'

const LOCAL_NAME = 'Resource'

export interface UserInfo {
  avatar: string
  name: string
  description: string
  shopUrl: string
  cardShopUrl: string
  wxremark: string
  freeCode: string
  freeCode4: string // gpt4免费卡密
  wximg: string
  supportModel: any
  everyDayFreeTimes: number
  everyDayFreeTimes4: number
}

export interface UserState {
  userInfo: UserInfo
}

export async function getLocalReource(): Promise<UserInfo | null> {
  const cachedData: UserInfo = ssHour.get(LOCAL_NAME)
  if (cachedData)
    return Promise.resolve(cachedData)

  return fetchReource<UserInfo>()
    .then((result) => {
      ssHour.set(LOCAL_NAME, result.data)
      return result.data
    }).catch((error) => {
      console.error(error)
      return null
    })
}

// export function setLocalState(setting: UserState): void {
//   ss.set(LOCAL_NAME, setting)
// }
