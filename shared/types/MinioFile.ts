import type { BucketItem, BucketItemStat } from 'minio'

export interface MinioFile {
  metadata: BucketItemStat
  file: BucketItem
}
