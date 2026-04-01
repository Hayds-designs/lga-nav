import { useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_STATE = {
  projectName: 'Untitled Project',
  siteUrl: 'https://clientsite.com',
  logoText: 'Logo',
  navTree: [
    {
      id: 'item-home',
      label: 'Home',
      path: '/',
      type: 'link',
      notes: '',
      children: [],
    },
    {
      id: 'item-about',
      label: 'About',
      path: '/about',
      type: 'link',
      notes: '',
      children: [
        { id: 'item-about-team', label: 'Our Team', path: '/about/team', children: [] },
        { id: 'item-about-history', label: 'History', path: '/about/history', children: [] },
      ],
    },
    {
      id: 'item-services',
      label: 'Services',
      path: '/services',
      type: 'link',
      notes: '',
      children: [],
    },
    {
      id: 'item-contact',
      label: 'Contact',
      path: '/contact',
      type: 'secondary-cta',
      notes: '',
      children: [],
    },
  ],
}

function newId() {
  return crypto.randomUUID()
}

function normalizePath(val) {
  if (!val || val === '/') return val || '/'
  const trimmed = val.trim()
  return trimmed.startsWith('/') ? trimmed : '/' + trimmed
}

export function useNavTree() {
  const [state, setState] = useLocalStorage('nav-builder-state', DEFAULT_STATE)
  const historyRef = useRef([])

  // Wrap every mutation through mutate() to record undo history
  const mutate = (fn) => {
    historyRef.current = [...historyRef.current.slice(-49), state]
    setState(fn)
  }

  const undo = () => {
    if (historyRef.current.length === 0) return
    const prev = historyRef.current[historyRef.current.length - 1]
    historyRef.current = historyRef.current.slice(0, -1)
    setState(prev)
  }

  const setProjectName = (name) => {
    mutate((s) => ({ ...s, projectName: name }))
  }

  const setSiteUrl = (url) => {
    mutate((s) => ({ ...s, siteUrl: url }))
  }

  const setLogoText = (text) => {
    mutate((s) => ({ ...s, logoText: text }))
  }

  const addItem = () => {
    mutate((s) => ({
      ...s,
      navTree: [
        ...s.navTree,
        { id: newId(), label: 'New Page', path: '/new-page', type: 'link', notes: '', children: [] },
      ],
    }))
  }

  const updateItem = (id, field, value) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'path' ? normalizePath(value) : value }
          : item
      ),
    }))
  }

  const deleteItem = (id) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.filter((item) => item.id !== id),
    }))
  }

  const duplicateItem = (id) => {
    mutate((s) => {
      const idx = s.navTree.findIndex((item) => item.id === id)
      if (idx === -1) return s
      const original = s.navTree[idx]
      const copy = {
        ...original,
        id: newId(),
        label: original.label + ' (Copy)',
        children: original.children.map((c) => ({ ...c, id: newId() })),
      }
      const navTree = [...s.navTree]
      navTree.splice(idx + 1, 0, copy)
      return { ...s, navTree }
    })
  }

  const toggleVisibility = (id) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      ),
    }))
  }

  const addChild = (parentId) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) => {
        if (item.id !== parentId) return item
        const parentPath = item.path === '/' ? '' : item.path
        return {
          ...item,
          children: [
            ...item.children,
            { id: newId(), label: 'Sub Page', path: `${parentPath}/sub-page`, children: [] },
          ],
        }
      }),
    }))
  }

  const updateChild = (parentId, childId, field, value) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === childId
                  ? { ...child, [field]: field === 'path' ? normalizePath(value) : value }
                  : child
              ),
            }
          : item
      ),
    }))
  }

  const deleteChild = (parentId, childId) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) =>
        item.id === parentId
          ? { ...item, children: item.children.filter((c) => c.id !== childId) }
          : item
      ),
    }))
  }

  const duplicateChild = (parentId, childId) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) => {
        if (item.id !== parentId) return item
        const idx = item.children.findIndex((c) => c.id === childId)
        if (idx === -1) return item
        const original = item.children[idx]
        const copy = { ...original, id: newId(), label: original.label + ' (Copy)' }
        const children = [...item.children]
        children.splice(idx + 1, 0, copy)
        return { ...item, children }
      }),
    }))
  }

  const toggleChildVisibility = (parentId, childId) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: item.children.map((c) =>
                c.id === childId ? { ...c, hidden: !c.hidden } : c
              ),
            }
          : item
      ),
    }))
  }

  const reorderChildren = (parentId, fromIndex, toIndex) => {
    mutate((s) => ({
      ...s,
      navTree: s.navTree.map((item) => {
        if (item.id !== parentId) return item
        const children = [...item.children]
        const [moved] = children.splice(fromIndex, 1)
        children.splice(toIndex, 0, moved)
        return { ...item, children }
      }),
    }))
  }

  const reorderItems = (fromIndex, toIndex) => {
    mutate((s) => {
      const items = [...s.navTree]
      const [moved] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, moved)
      return { ...s, navTree: items }
    })
  }

  const replaceTree = (newState) => {
    const reId = (item) => ({
      ...item,
      id: newId(),
      children: (item.children || []).map((child) => ({ ...child, id: newId(), children: [] })),
    })
    setState({
      projectName: newState.projectName || 'Untitled Project',
      siteUrl: newState.siteUrl || 'https://clientsite.com',
      logoText: newState.logoText || 'Logo',
      navTree: (newState.navTree || []).map(reId),
    })
  }

  return {
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
  }
}
