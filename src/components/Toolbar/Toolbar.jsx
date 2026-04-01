import './Toolbar.css'

export function Toolbar({ onSaveJson, onLoadJson, onExportCsv }) {
  return (
    <header className="toolbar">
      <div className="toolbar__left">
        <div className="toolbar__logo">NavBuilder</div>
      </div>
      <div className="toolbar__actions">
        <button className="toolbar__btn toolbar__btn--secondary" onClick={onLoadJson}>
          Load JSON
        </button>
        <button className="toolbar__btn toolbar__btn--secondary" onClick={onExportCsv}>
          Export CSV
        </button>
        <button className="toolbar__btn toolbar__btn--primary" onClick={onSaveJson}>
          Save JSON
        </button>
      </div>
    </header>
  )
}
