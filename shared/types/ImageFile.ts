export interface ImageFile {
  metadata: any
  file: any
}

export interface ItemMetadata {
  'Content-Type': string
  'Content-Length': string
  'X-Amz-Meta-Original-Filename': string
  'X-Amz-Meta-Original-Path': string
  'X-Amz-Meta-Original-Filetype': string
}
