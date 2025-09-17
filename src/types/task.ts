export type Task = {
  id: string
  title: string
  description?: string
  priority?: 'baixa' | 'media' | 'alta'
  tags?: string[]
  assignee?: string
}

export type Columns = {
  [key: string]: Task[]
}


