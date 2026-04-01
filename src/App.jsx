import { useRef, useEffect } from 'react'
import { useNavTree } from './hooks/useNavTree'
import { Toolbar } from './components/Toolbar/Toolbar'
import { Editor } from './components/Editor/Editor'
import { Preview } from './components/Preview/Preview'
import { exportJson } from './utils/exportJson'
import { importJson } from './utils/importJson'
import { exportCsv } from './utils/exportCsv'

export default function App() {
  const {
    state,
    undo,
    setProjectName,
    setSiteUrl,
    setLogoText,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    toggleVisibility,
    addChild,
    updateChild,
    deleteChild,
    duplicateChild,
    toggleChildVisibility,
    reorderChildren,
    reorderItems,
    replaceTree,
  } = useNavTree()

  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo])

  const handleSaveJson = () => exportJson(state)
  const handleExportCsv = () => exportCsv(state)
  const handleLoadJson = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    importJson(file, replaceTree, (err) => alert(`Import failed: ${err}`))
    e.target.value = ''
  }

  return (
    <div className="app">
      <Toolbar
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        onExportCsv={handleExportCsv}
      />
      <div className="app__body">
        <Editor
          navTree={state.navTree}
          projectName={state.projectName}
          onProjectNameChange={setProjectName}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onDuplicateItem={duplicateItem}
          onToggleVisibility={toggleVisibility}
          onAddChild={addChild}
          onUpdateChild={updateChild}
          onDeleteChild={deleteChild}
          onDuplicateChild={duplicateChild}
          onToggleChildVisibility={toggleChildVisibility}
          onReorderChildren={reorderChildren}
          onReorderItems={reorderItems}
        />
        <Preview
          navTree={state.navTree}
          projectName={state.projectName}
          siteUrl={state.siteUrl}
          logoText={state.logoText}
          onSiteUrlChange={setSiteUrl}
          onLogoTextChange={setLogoText}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
