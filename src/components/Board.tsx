import React from 'react'
import type { Columns, Task } from '../types/task'
import { Column } from './Column'

type BoardProps = {
  board: Columns
  pulse: boolean
  onAdd: (columnKey: string) => void
  onEdit: (columnKey: string, task: Task) => void
  onRemove: (columnKey: string, taskId: string) => void
  onDrop: (e: React.DragEvent, destColumn: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export function Board({ board, pulse, onAdd, onEdit, onRemove, onDrop, onDragOver, onDragStart }: BoardProps) {
  return (
    <main className="board row g-3">
      {['todo', 'doing', 'review', 'done'].map((columnKey) => (
        <Column
          key={columnKey}
          columnKey={columnKey}
          title={
            columnKey === 'todo'
              ? 'A Fazer'
              : columnKey === 'doing'
              ? 'Em Progresso'
              : columnKey === 'review'
              ? 'Em Revisão'
              : 'Concluído'
          }
          tasks={board[columnKey]}
          pulse={pulse}
          onAdd={onAdd}
          onEdit={(task) => onEdit(columnKey, task)}
          onRemove={(taskId) => onRemove(columnKey, taskId)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
        />
      ))}
    </main>
  )
}


