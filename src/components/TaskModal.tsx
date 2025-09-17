import React, { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'

type TaskModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  title: string
  description: string
  priority?: 'baixa' | 'media' | 'alta'
  tags?: string
  assignee?: string
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onPriorityChange?: (v: 'baixa' | 'media' | 'alta') => void
  onTagsChange?: (v: string) => void
  onAssigneeChange?: (v: string) => void
  onClose: () => void
  onSave: () => void
}

export function TaskModal({ isOpen, mode, title, description, priority = 'media', tags = '', assignee = '', onTitleChange, onDescriptionChange, onPriorityChange, onTagsChange, onAssigneeChange, onClose, onSave }: TaskModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const canSave = useMemo(() => title.trim().length > 0 && assignee.trim().length > 0, [title, assignee])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (canSave) onSave()
      else toast.error('Preencha título e responsável para salvar')
    }
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-dialog" role="dialog" style={{ maxWidth: 600, width: '100%' }}>
        <div className="modal-content" onKeyDown={handleKeyDown}>
          <div className="modal-header">
            <h5 className="modal-title">{mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'}</h5>
            <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                ref={inputRef}
                className="form-control"
                placeholder="Ex.: Implementar integração com API"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
              {!canSave && (
                <small className="text-danger">Informe um título para salvar.</small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Responsável <span className="text-danger">*</span></label>
              <input
                className="form-control"
                placeholder="Nome completo"
                value={assignee}
                onChange={(e) => onAssigneeChange?.(e.target.value)}
                required
              />
              {assignee.trim().length === 0 && (
                <small className="text-danger">Informe o responsável.</small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Prioridade</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => onPriorityChange?.(e.target.value as 'baixa' | 'media' | 'alta')}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tags (separadas por vírgula)</label>
              <input
                className="form-control"
                placeholder="ex.: frontend, api, urgente"
                value={tags}
                onChange={(e) => onTagsChange?.(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição (opcional)</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detalhes, critérios de aceite, links..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave} title={!canSave ? 'Informe um título' : undefined}>
              {mode === 'create' ? 'Criar tarefa' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


