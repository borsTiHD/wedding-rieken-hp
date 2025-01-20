export interface DataResults {
  result: Pages[]
  error?: string
}

export interface Pages {
  title: string
  name: string
  description: string
  id: string
}
