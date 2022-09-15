import { IColumn } from './interfaces'

export class Column implements IColumn {
  name: string
  label: string
  width: number
  object: {
    name: string
    label: string
    width: number
  }

  constructor (name: string, label: string, width: number) {
    this.name = name
    this.label = label
    this.width = width
    this.object = { name, label, width }
  }
}
