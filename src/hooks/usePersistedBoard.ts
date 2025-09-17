import { useEffect, useState } from 'react'
import type { Columns } from '../types/task'

const STORAGE_KEY = 'kanban:board:v1'

export function usePersistedBoard(initial: Columns) {
  const [board, setBoard] = useState<Columns>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return initial
      const parsed = JSON.parse(raw) as Columns
      const merged: Columns = { ...parsed }
      Object.keys(initial).forEach((k) => {
        if (!(k in merged)) merged[k] = initial[k] || []
      })
      return merged
    } catch (e) {
      console.warn('Failed to parse board from localStorage', e)
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
    } catch (e) {
      console.warn('Failed to save board to localStorage', e)
    }
  }, [board])

  return [board, setBoard] as const
}


