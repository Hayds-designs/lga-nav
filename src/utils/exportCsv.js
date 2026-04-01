const cell = (str) => `"${String(str ?? '').replace(/"/g, '""')}"`

export function exportCsv(state) {
  const rows = [['Label', 'Path', 'Level', 'Parent', 'Notes']]

  for (const item of state.navTree) {
    rows.push([item.label, item.path, '1', '', item.notes || ''])
    for (const child of item.children) {
      rows.push([child.label, child.path, '2', item.label, ''])
    }
  }

  const csv = rows.map((r) => r.map(cell).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(state.projectName)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function sanitizeFilename(name) {
  return (name || 'nav-export').replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
}
