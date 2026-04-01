export function importJson(file, onSuccess, onError) {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      if (!Array.isArray(parsed.navTree)) {
        throw new Error('Missing navTree array')
      }
      for (const item of parsed.navTree) {
        if (typeof item.label !== 'string') throw new Error('Item missing label')
        if (!Array.isArray(item.children)) throw new Error('Item missing children array')
        for (const child of item.children) {
          if (child.children?.length > 0) {
            throw new Error('Max nesting depth is 2 levels')
          }
        }
      }
      onSuccess(parsed)
    } catch (err) {
      onError(err.message)
    }
  }

  reader.onerror = () => onError('Could not read file')
  reader.readAsText(file)
}
