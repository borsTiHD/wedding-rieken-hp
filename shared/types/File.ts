import type { BucketItem, BucketItemStat } from 'minio'

export interface File {
  metadata: BucketItemStat
  file: BucketItem
}
