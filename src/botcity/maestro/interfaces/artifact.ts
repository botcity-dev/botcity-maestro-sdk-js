interface Content {
  id: number
  type: string
  taskId: number
  name: string
  fileName: string
  organizationId: number
  dateCreation: string
  taskName: string
}

interface Sort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

interface Pageable {
  sort: Sort
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface Artifact {
  id: number
  type: string
  taskId: number
  name: string
  filename?: string
  organizationId: number
  dateCreation?: string
  userId?: number
  taskName?: string
}

export interface Artifacts {
  content: Content[]
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  sort: Sort
  first: boolean
  numberOfElements: number
  size: number
  number: number
  empty: boolean
}
