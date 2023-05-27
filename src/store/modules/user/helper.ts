import { fetchReource } from '@/api'

// const LOCAL_NAME = 'userStorage'

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

export async function defaultSetting(): Promise<UserState> {
  const serverConfig = await fetchReource<UserInfo>()

  return {
    userInfo: serverConfig.data,
  }
}

// export function getLocalState(): Promise<UserState> {
//   const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
//   return { ...defaultSetting(), ...localSetting }
// }

// export function setLocalState(setting: UserState): void {
//   ss.set(LOCAL_NAME, setting)
// }
