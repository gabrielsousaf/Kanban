import React from 'react'
import type { Task } from '../types/task'

type TaskCardProps = {
  task: Task
  columnKey: string
  onEdit: (task: Task) => void
  onRemove: (taskId: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export function TaskCard({ task, columnKey, onEdit, onRemove, onDragStart }: TaskCardProps) {
  function getInitials(name?: string) {
    if (!name) return ''
    const parts = name.split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] || ''
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
    return (first + last).toUpperCase()
  }
  return (
    <article
      className="task p-2"
      draggable
      data-column={columnKey}
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="task-main d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-2">
          {task.priority && (
            <i
              className={`bi bi-flag-fill priority-flag ${
                task.priority === 'alta' ? 'priority--high' : task.priority === 'media' ? 'priority--medium' : 'priority--low'
              }`}
              title={`Prioridade: ${task.priority}`}
            />
          )}
          <strong>{task.title}</strong>
        </div>
        <div className="task-actions d-flex gap-2 align-items-center">
          {task.assignee && (
            <span className="avatar-initials" title={task.assignee}>{getInitials(task.assignee)}</span>
          )}
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(task)} title="Editar"><i className="bi bi-pencil" /></button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(task.id)} title="Remover"><i className="bi bi-trash" /></button>
        </div>
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-1">
          {task.tags.map((tg) => (
            <span key={tg} className="tag-chip">{tg}</span>
          ))}
        </div>
      )}
    </article>
  )
}


