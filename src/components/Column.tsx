import React from 'react'
import type { Task } from '../types/task'
import { TaskCard } from './TaskCard'

type ColumnProps = {
  columnKey: string
  title: string
  tasks: Task[]
  pulse?: boolean
  onAdd: (columnKey: string) => void
  onEdit: (task: Task) => void
  onRemove: (taskId: string) => void
  onDrop: (e: React.DragEvent, destColumn: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export function Column({ columnKey, title, tasks, pulse, onAdd, onEdit, onRemove, onDrop, onDragOver, onDragStart }: ColumnProps) {
  return (
    <section
      className={`column col-12 col-md-3 ${columnKey === 'todo' ? 'column--todo' : ''} ${columnKey === 'todo' && pulse ? 'column--pulse' : ''} ${columnKey === 'doing' ? 'column--progress' : ''} ${columnKey === 'review' ? 'column--review' : ''} ${columnKey === 'done' ? 'column--done' : ''}`}
      onDrop={(e) => onDrop(e, columnKey)}
      onDragOver={onDragOver}
    >
      <div className="column-header d-flex align-items-center justify-content-between mb-2">
        <h2 className="h6 m-0">
          <span className={`status-dot ${columnKey === 'todo' ? 'status--todo' : ''} ${columnKey === 'doing' ? 'status--doing' : ''} ${columnKey === 'review' ? 'status--review' : ''} ${columnKey === 'done' ? 'status--done' : ''}`}></span>
          {title}
          {columnKey === 'todo' && (
            <span className="badge badge-soft ms-2">{tasks.length}</span>
          )}
          {columnKey === 'doing' && (
            <span className="badge badge-soft-yellow ms-2">{tasks.length}</span>
          )}
          {columnKey === 'review' && (
            <span className="badge badge-soft-purple ms-2">{tasks.length}</span>
          )}
          {columnKey === 'done' && (
            <span className="badge badge-soft-green ms-2">{tasks.length}</span>
          )}
        </h2>
        <button className="btn btn-primary btn-sm" onClick={() => onAdd(columnKey)}>
          +
        </button>
      </div>

      <div className="tasks d-flex flex-column gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnKey={columnKey}
            onEdit={(t) => onEdit(t)}
            onRemove={(id) => onRemove(id)}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </section>
  )
}


