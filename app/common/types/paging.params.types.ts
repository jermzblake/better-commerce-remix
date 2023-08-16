export interface PagingParams<T> {
  page: string
  pageSize: number
  dir: string
  sort: string
  totalCount: number
  data: T[]
}