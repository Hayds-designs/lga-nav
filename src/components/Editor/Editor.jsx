import { useState, useRef } from 'react'
import { NavItemRow } from './NavItemRow'
import './Editor.css'

export function Editor({
  navTree,
  projectName,
  onProjectNameChange,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onToggleVisibility,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
  onDuplicateChild,
  onToggleChildVisibility,
  onReorderChildren,
  onReorderItems,
}) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const [showUrl, setShowUrl] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(projectName)
  const nameInputRef = useRef(null)

  const commitName = () => {
    setEditingName(false)
    const trimmed = nameDraft.trim()
    if (trimmed !== projectName) onProjectNameChange(trimmed || projectName)
    else setNameDraft(projectName)
  }

  const handleDragStart = (index) => {
    setDragIndex(index)
    setOverIndex(null)
  }

  const handleDragOver = (index) => {
    setOverIndex(index)
  }

  const handleDrop = (dropIndex) => {
    if (dragIndex !== null && dragIndex !== dropIndex) {
      onReorderItems(dragIndex, dropIndex)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <aside className={`editor${collapsed ? ' editor--collapsed' : ''}`}>
      <button
        className="editor__collapse-btn"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <svg
          fill="none" height="18" viewBox="0 0 24 24" width="18"
          xmlns="http://www.w3.org/2000/svg"
          style={collapsed ? { transform: 'scaleX(-1)' } : undefined}
        >
          <g fill="currentColor">
            <path d="m3.25006 5.5c0 .41421.33579.75.75.75h16.00004c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75h-16.00004c-.41421 0-.75.33579-.75.75z"/>
            <path d="m3.25006 12c0-.4142.33579-.75.75-.75h16.00004c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-16.00004c-.41421 0-.75-.3358-.75-.75z"/>
            <path d="m3.25006 18.5c0-.4142.33579-.75.75-.75h16.00004c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-16.00004c-.41421 0-.75-.3358-.75-.75z"/>
            <path d="m7.35874 8.64122c.29289.29289.2929.76776 0 1.06066l-2.29809 2.29812 2.29809 2.2981c.2929.2929.29289.7678 0 1.0607-.2929.2929-.76777.2929-1.06066 0l-2.82841-2.8285c-.29289-.2929-.29289-.7677 0-1.0606l2.82841-2.82848c.29289-.29289.76776-.2929 1.06066 0z"/>
          </g>
        </svg>
      </button>
      <div className="editor__settings">
        <div className="editor__settings-head">
          <h2 className="editor__list-title editor__settings-title">Sitemap Options</h2>
        </div>
        <div className="editor__setting-row">
          {editingName ? (
            <input
              ref={nameInputRef}
              className="editor__project-input"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameDraft(projectName); setEditingName(false) } }}
              autoFocus
            />
          ) : (
            <span className={`editor__setting-label${!projectName ? ' editor__setting-label--placeholder' : ''}`}>
              {projectName || 'Website'}
            </span>
          )}
          <button
            className="editor__edit-btn"
            onClick={() => { setNameDraft(projectName); setEditingName(true) }}
            title="Edit website name"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 1.5L11.5 3.5L4.5 10.5H2.5V8.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7.5 3.5L9.5 5.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </button>
        </div>
        <div className="editor__setting-row">
          <span className="editor__setting-label">Show page paths</span>
          <button
            className={`editor__toggle${showUrl ? ' editor__toggle--on' : ''}`}
            onClick={() => setShowUrl(v => !v)}
            role="switch"
            aria-checked={showUrl}
          />
        </div>
        <div className="editor__setting-row">
          <span className="editor__setting-label">Show notes</span>
          <button
            className={`editor__toggle${showNotes ? ' editor__toggle--on' : ''}`}
            onClick={() => setShowNotes(v => !v)}
            role="switch"
            aria-checked={showNotes}
          />
        </div>
      </div>
      <div
        className="editor__list"
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOverIndex(null)
        }}
      >
        <div className="editor__list-header">
          <h2 className="editor__list-title">Structure</h2>
          <button className="editor__list-add-btn" onClick={onAddItem}>Add Page +</button>
        </div>
        <p className="editor__hint">Click labels to edit</p>
        {navTree.map((item, index) => (
          <NavItemRow
            key={item.id}
            item={item}
            index={index}
            isDragging={dragIndex === index}
            isDropTarget={overIndex === index && dragIndex !== index}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
            onDuplicate={onDuplicateItem}
            onToggleVisibility={onToggleVisibility}
            onAddChild={onAddChild}
            onUpdateChild={onUpdateChild}
            onDeleteChild={onDeleteChild}
            onDuplicateChild={onDuplicateChild}
            onToggleChildVisibility={onToggleChildVisibility}
            onReorderChildren={onReorderChildren}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            showUrl={showUrl}
            showNotes={showNotes}
          />
        ))}
        {navTree.length === 0 && (
          <p className="editor__empty">No pages yet. Add one below.</p>
        )}
        <button className="editor__add-card" onClick={onAddItem}>
          Add Page +
        </button>
        <div
          className={`editor__end-drop-zone${dragIndex !== null && overIndex === navTree.length ? ' editor__end-drop-zone--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setOverIndex(navTree.length) }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(navTree.length) }}
        />
      </div>

    </aside>
  )
}
