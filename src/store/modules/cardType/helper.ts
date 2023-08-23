import { queryCardType } from '@/api'
import { ssHour } from '@/utils/storage'

const LOCAL_NAME = 'CardType'

/**
 * 获取所有卡类型缓存
 * @returns
 */
export async function getAllCardTypeCache(): Promise<any | null> {
  const cachedData: any = ssHour.get(LOCAL_NAME)
  if (cachedData)
    return Promise.resolve(cachedData)

  const result = await queryCardType<any>({
    pageSize: 100,
  })
  ssHour.set(LOCAL_NAME, result.data)
  return result.data
}

// 移除
export function removeLocalState() {
  ssHour.remove(LOCAL_NAME)
}
