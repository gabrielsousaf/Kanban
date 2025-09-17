import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Task } from './types/task'
import { usePersistedBoard } from './hooks/usePersistedBoard'
import { Board } from './components/Board'
import { TaskModal } from './components/TaskModal'

function App() {
  const initial = useMemo(
    () => ({
      todo: [
        { id: 't1', title: 'Exemplo: Criar skeleton', priority: 'alta' as const, tags: ['frontend', 'setup'] },
        { id: 't2', title: 'Exemplo: Integrar localStorage', priority: 'media' as const, tags: ['backend'] },
      ],
      doing: [{ id: 't3', title: 'Exemplo: Trabalhando...', priority: 'baixa' as const, tags: ['teste'] }],
      review: [{ id: 't4', title: 'Exemplo: Em revisão', priority: 'media' as const, tags: ['review'] }],
      done: [{ id: 't5', title: 'Exemplo: Feito', priority: 'alta' as const, tags: ['concluído'] }],
    }),
    [],
  )

  const [board, setBoard] = usePersistedBoard(initial)
  const [todoCount, setTodoCount] = useState<number>(board.todo?.length ?? 0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const current = board.todo?.length ?? 0
    if (current > todoCount) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 2200)
      return () => clearTimeout(t)
    }
    setTodoCount(current)
  }, [board.todo, todoCount])
  useEffect(() => {
    // inicializa tooltips do Bootstrap dinamicamente
    type BootstrapModule = { Tooltip: new (el: Element) => unknown }
    import('bootstrap').then((mod: unknown) => {
      const win = window as unknown as { bootstrap?: BootstrapModule }
      const t: BootstrapModule = (win.bootstrap as BootstrapModule | undefined) ?? (mod as BootstrapModule)
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.forEach((el) => {
        try {
          // instancia Tooltip se disponível
          new t.Tooltip(el)
        } catch {
          // ignore initialization errors for individual elements
        }
      })
    })
    // não há cleanup específico necessário
  }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [modalColumn, setModalColumn] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPriority, setFormPriority] = useState<'baixa' | 'media' | 'alta'>('media')
  const [formTags, setFormTags] = useState('')
  const [formAssignee, setFormAssignee] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBoard = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return board
    const result: Record<string, Task[]> = {}
    Object.keys(board).forEach((key) => {
      result[key] = (board[key] || []).filter((t) => {
        const title = t.title?.toLowerCase() || ''
        const desc = t.description?.toLowerCase() || ''
        return title.includes(term) || desc.includes(term)
      })
    })
    return result
  }, [board, searchTerm])

  function openCreateModal(columnKey: string) {
    setModalMode('create')
    setModalColumn(columnKey)
    setEditingTask(null)
    setFormTitle('')
    setFormDescription('')
    setFormPriority('media')
    setFormTags('')
    setFormAssignee('')
    setIsModalOpen(true)
  }

        {/* O map das colunas deve estar apenas dentro do JSX do return, não misturado com funções ou hooks */}

  function openEditModal(columnKey: string, task: Task) {
    setModalMode('edit')
    setModalColumn(columnKey)
    setEditingTask(task)
    setFormTitle(task.title)
    setFormDescription(task.description || '')
    setFormPriority(task.priority || 'media')
    setFormTags((task.tags || []).join(', '))
    setFormAssignee(task.assignee || '')
    setIsModalOpen(true)
  }

  function saveTask() {
    const title = formTitle.trim()
    if (!title || !modalColumn || !formAssignee.trim()) return
    if (modalMode === 'create') {
      const newTask: Task = {
        id: `t${Date.now()}`,
        title,
        description: formDescription,
        priority: formPriority,
        tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
        assignee: formAssignee.trim(),
      }
      setBoard((b) => ({ ...b, [modalColumn]: [...(b[modalColumn] || []), newTask] }))
    } else if (modalMode === 'edit' && editingTask) {
      setBoard((b) => ({
        ...b,
        [modalColumn]: b[modalColumn].map((t) => (t.id === editingTask.id ? { ...t, title, description: formDescription, priority: formPriority, tags: formTags.split(',').map((tg) => tg.trim()).filter(Boolean), assignee: formAssignee.trim() } : t)),
      }))
    }
    setIsModalOpen(false)
  }


  function removeTask(columnKey: string, taskId: string) {
    setBoard((b) => ({ ...b, [columnKey]: b[columnKey].filter((t) => t.id !== taskId) }))
  }

  function handleDragStart(ev: React.DragEvent, taskId: string) {
    ev.dataTransfer.setData('text/plain', taskId)
    // store source column so drop can validate
    ev.dataTransfer.setData('source', (ev.currentTarget as HTMLElement).dataset.column || '')
  }

  function handleDrop(ev: React.DragEvent, destColumn: string) {
    ev.preventDefault()
    const taskId = ev.dataTransfer.getData('text/plain')
    const sourceColumn = ev.dataTransfer.getData('source')
    if (!taskId || !sourceColumn) return
    if (sourceColumn === destColumn) return

    setBoard((b) => {
      const task = b[sourceColumn].find((t) => t.id === taskId)
      if (!task) return b
      return {
        ...b,
        [sourceColumn]: b[sourceColumn].filter((t) => t.id !== taskId),
        [destColumn]: [...(b[destColumn] || []), task],
      }
    })
  }

  function allowDrop(ev: React.DragEvent) {
    ev.preventDefault()
  }

  return (
    <div className="app-root container-fluid py-4">
      <header className="app-header mb-3 d-flex flex-column align-items-start">
        <h1 className="h3 m-0">Kanban Board</h1>
        <p className="subtitle m-0 text-muted">Gerencie suas tasks de forma visual e eficiente</p>
        <div className="d-flex align-items-center justify-content-between mt-2 w-100">
          <div style={{ width: '100%', maxWidth: 480 }}>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar tarefas por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center flex-wrap gap-3 ms-3 text-muted" style={{ fontSize: '0.9rem' }}>
            {[
              { key: 'todo', label: 'A Fazer', dot: 'status--todo' },
              { key: 'doing', label: 'Em Progresso', dot: 'status--doing' },
              { key: 'review', label: 'Em Revisão', dot: 'status--review' },
              { key: 'done', label: 'Concluído', dot: 'status--done' },
            ].map((c) => (
              <span key={c.key} className="app-legend-item">
                <span className={`status-dot ${c.dot}`} />
                <span className="me-1">{filteredBoard[c.key]?.length ?? 0}</span>
                <span>{c.label}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <Board
        board={filteredBoard}
        pulse={pulse}
        onAdd={(columnKey) => openCreateModal(columnKey)}
        onEdit={(columnKey, task) => openEditModal(columnKey, task)}
        onRemove={(columnKey, taskId) => removeTask(columnKey, taskId)}
        onDrop={(e, dest) => handleDrop(e, dest)}
        onDragOver={allowDrop}
        onDragStart={(e, taskId) => handleDragStart(e, taskId)}
      />

      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        title={formTitle}
        description={formDescription}
        priority={formPriority}
        tags={formTags}
        assignee={formAssignee}
        onTitleChange={(v) => setFormTitle(v)}
        onDescriptionChange={(v) => setFormDescription(v)}
        onPriorityChange={(v) => setFormPriority(v)}
        onTagsChange={(v) => setFormTags(v)}
        onAssigneeChange={(v) => setFormAssignee(v)}
        onClose={() => setIsModalOpen(false)}
        onSave={() => saveTask()}
      />

      <footer className="app-footer mt-3 text-center text-muted">
        <small>Dados salvos localmente no navegador</small>
      </footer>
    </div>
  )
}

export default App
