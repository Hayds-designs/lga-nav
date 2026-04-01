import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { EditableLabel } from '../shared/EditableLabel'
import { SubItemRow } from './SubItemRow'
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

export function NavItemRow({
  item,
  index,
  isDragging,
  isDropTarget,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
  onDuplicateChild,
  onToggleChildVisibility,
  onReorderChildren,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  showUrl,
  showNotes,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [childDragIndex, setChildDragIndex] = useState(null)
  const [childOverIndex, setChildOverIndex] = useState(null)
  const notesRef = useRef(null)
  const typeMenu = useFloatingMenu()
  const optionsMenu = useFloatingMenu()

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.style.height = 'auto'
      notesRef.current.style.height = notesRef.current.scrollHeight + 'px'
    }
  }, [])

  const isCta = item.type === 'primary-cta' || item.type === 'secondary-cta'

  const handleChildDragStart = (i) => { setChildDragIndex(i); setChildOverIndex(null) }
  const handleChildDragOver = (i) => setChildOverIndex(i)
  const handleChildDrop = (dropIndex) => {
    if (childDragIndex !== null && childDragIndex !== dropIndex) {
      onReorderChildren(item.id, childDragIndex, dropIndex)
    }
    setChildDragIndex(null)
    setChildOverIndex(null)
  }
  const handleChildDragEnd = () => { setChildDragIndex(null); setChildOverIndex(null) }

  return (
    <div
      className={[
        'nav-item-row',
        isDragging ? 'nav-item-row--dragging' : '',
        isDropTarget ? 'nav-item-row--drop-target' : '',
        item.hidden ? 'nav-item-row--hidden' : '',
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={(e) => { onDragStart(index); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('application/nav-parent', '1') }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
      onDrop={(e) => { e.preventDefault(); onDrop(index) }}
    >
      <div className="nav-item-row__main">
        <span className="nav-item-row__drag" title="Drag to reorder">⠿</span>
        <button
          className={`nav-item-row__collapse${collapsed ? ' nav-item-row__collapse--collapsed' : ''}`}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          ▾
        </button>
        <div className="nav-item-row__fields">
          <EditableLabel
            value={item.label}
            onChange={(val) => onUpdate(item.id, 'label', val)}
            placeholder="Page name"
            className="nav-item-row__label"
          />
          {showUrl && (
            <EditableLabel
              value={item.path}
              onChange={(val) => onUpdate(item.id, 'path', val)}
              placeholder="/path"
              className="nav-item-row__path"
            />
          )}
        </div>
        <div className="nav-item-row__actions">
          <div className="nav-item-row__options-wrap" ref={typeMenu.wrapRef}>
            <button ref={typeMenu.btnRef} className="nav-item-row__type-btn" onClick={typeMenu.toggle}>
              <span>{{ link: 'Link', 'primary-cta': 'Primary CTA', 'secondary-cta': 'Secondary CTA' }[item.type || 'link']}</span>
              <span className="nav-item-row__type-caret">▾</span>
            </button>
            {typeMenu.open && createPortal(
              <div ref={typeMenu.menuRef} className="nav-item-row__menu" style={{ position: 'fixed', top: typeMenu.pos.top, right: typeMenu.pos.right }}>
                {[['link', 'Link'], ['primary-cta', 'Primary CTA'], ['secondary-cta', 'Secondary CTA']].map(([val, label]) => (
                  <button
                    key={val}
                    className={`nav-item-row__menu-item${(item.type || 'link') === val ? ' nav-item-row__menu-item--active' : ''}`}
                    onClick={() => { onUpdate(item.id, 'type', val); typeMenu.setOpen(false) }}
                  >
                    {label}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>
          <div className="nav-item-row__options-wrap" ref={optionsMenu.wrapRef}>
            <button ref={optionsMenu.btnRef} className="nav-item-row__btn nav-item-row__btn--options" onClick={optionsMenu.toggle} title="Options">
              ···
            </button>
            {optionsMenu.open && createPortal(
              <div ref={optionsMenu.menuRef} className="nav-item-row__menu" style={{ position: 'fixed', top: optionsMenu.pos.top, right: optionsMenu.pos.right }}>
                <button className="nav-item-row__menu-item" onClick={() => { onToggleVisibility(item.id); optionsMenu.setOpen(false) }}>
                  {item.hidden ? 'Show' : 'Hide'}
                </button>
                <button className="nav-item-row__menu-item" onClick={() => { onDuplicate(item.id); optionsMenu.setOpen(false) }}>
                  Duplicate
                </button>
                <div className="nav-item-row__menu-divider" />
                <button className="nav-item-row__menu-item nav-item-row__menu-item--delete" onClick={() => { onDelete(item.id); optionsMenu.setOpen(false) }}>
                  Delete
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>

      {!collapsed && showNotes && <div className="nav-item-row__notes-section">
        <textarea
          ref={notesRef}
          className="nav-item-row__notes"
          value={item.notes || ''}
          onChange={(e) => onUpdate(item.id, 'notes', e.target.value)}
          onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
          placeholder="Add a note…"
          rows={1}
        />
      </div>}

      {!collapsed && !isCta && (
        <div className="nav-item-row__children">
          {item.children.map((child, i) => (
            <SubItemRow
              key={child.id}
              child={child}
              index={i}
              parentId={item.id}
              isDragging={childDragIndex === i}
              isDropTarget={childOverIndex === i && childDragIndex !== i}
              onUpdate={onUpdateChild}
              onDelete={onDeleteChild}
              onDuplicate={onDuplicateChild}
              onToggleVisibility={onToggleChildVisibility}
              onDragStart={handleChildDragStart}
              onDragOver={handleChildDragOver}
              onDrop={handleChildDrop}
              onDragEnd={handleChildDragEnd}
              showUrl={showUrl}
            />
          ))}
          <button className="nav-item-row__add-sub-btn" onClick={() => onAddChild(item.id)}>
            + Add sub-page
          </button>
        </div>
      )}
    </div>
  )
}
