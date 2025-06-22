export interface FtpFile {
  name: string
  size: number
  type: string
  modifyTime: number
  accessTime: number
  rights: {
    user: string
    group: string
    other: string
  }
  owner: number
  group: number
  longname: string
}

export interface ImageFile {
  name: string
  lastModified: Date
  size: number
  type: string
}

export interface ItemMetadata {
  'Content-Type': string
  'Content-Length': string
  'X-Amz-Meta-Original-Filename': string
  'X-Amz-Meta-Original-Path': string
  'X-Amz-Meta-Original-Filetype': string
}
