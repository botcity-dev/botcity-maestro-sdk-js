export interface Sort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface Pageable {
  sort: Sort
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface IColumn {
  name: string
  label: string
  width: number
}
