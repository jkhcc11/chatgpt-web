import type { UserState } from './helper'
import { defaultSetting } from './helper'

export async function useUserStore(): Promise<UserState> {
  return await defaultSetting()
}
