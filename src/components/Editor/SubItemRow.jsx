import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { EditableLabel } from '../shared/EditableLabel'
import './Editor.css'

function useFloatingMenu() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (wrapRef.current?.contains(e.target)) return
      if (menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const closeOnScroll = () => setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('scroll', closeOnScroll, true)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('scroll', closeOnScroll, true)
    }
  }, [open])

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen((o) => !o)
  }

  return { open, pos, toggle, setOpen, wrapRef, btnRef, menuRef }
}

export function SubItemRow({ child, parentId, index, isDragging, isDropTarget, onUpdate, onDelete, onDuplicate, onToggleVisibility, onDragStart, onDragOver, onDrop, onDragEnd, showUrl }) {
  const optionsMenu = useFloatingMenu()

  return (
    <div
      className={[
        'sub-item-row',
        isDragging ? 'sub-item-row--dragging' : '',
        isDropTarget ? 'sub-item-row--drop-target' : '',
        child.hidden ? 'sub-item-row--hidden' : '',
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={(e) => { onDragStart(index); e.dataTransfer.effectAllowed = 'move' }}
      onDragOver={(e) => { e.preventDefault(); if (e.dataTransfer.types.includes('application/nav-parent')) return; e.stopPropagation(); onDragOver(index) }}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.types.includes('application/nav-parent')) return; e.stopPropagation(); onDrop(index) }}
      onDragEnd={onDragEnd}
    >
      <span className="nav-item-row__drag" title="Drag to reorder">⠿</span>
      <div className="sub-item-row__fields">
        <EditableLabel
          value={child.label}
          onChange={(val) => onUpdate(parentId, child.id, 'label', val)}
          placeholder="Sub-page name"
          className="nav-item-row__label sub-item-row__label"
        />
        {showUrl && (
          <EditableLabel
            value={child.path}
            onChange={(val) => onUpdate(parentId, child.id, 'path', val)}
            placeholder="/path"
            className="nav-item-row__path"
          />
        )}
      </div>
      <div className="nav-item-row__options-wrap" ref={optionsMenu.wrapRef}>
        <button ref={optionsMenu.btnRef} className="nav-item-row__btn nav-item-row__btn--options" onClick={optionsMenu.toggle} title="Options">
          ···
        </button>
        {optionsMenu.open && createPortal(
          <div ref={optionsMenu.menuRef} className="nav-item-row__menu" style={{ position: 'fixed', top: optionsMenu.pos.top, right: optionsMenu.pos.right }}>
            <button className="nav-item-row__menu-item" onClick={() => { onToggleVisibility(parentId, child.id); optionsMenu.setOpen(false) }}>
              {child.hidden ? 'Show' : 'Hide'}
            </button>
            <button className="nav-item-row__menu-item" onClick={() => { onDuplicate(parentId, child.id); optionsMenu.setOpen(false) }}>
              Duplicate
            </button>
            <div className="nav-item-row__menu-divider" />
            <button className="nav-item-row__menu-item nav-item-row__menu-item--delete" onClick={() => { onDelete(parentId, child.id); optionsMenu.setOpen(false) }}>
              Delete
            </button>
          </div>,
          document.body
        )}
      </div>
    </div>
  )
}
