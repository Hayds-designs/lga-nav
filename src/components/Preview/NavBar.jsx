import { useState } from 'react'
import './Preview.css'

export function NavBar({ navTree, projectName, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})

  const toggleItem = (id) => setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))

  const mainItems = navTree.filter((item) => !item.hidden && (item.navState || 'logged-out') !== 'member')
  const memberItems = navTree.filter((item) => !item.hidden && item.navState === 'member')

  const mainLinks = mainItems.filter((item) => !item.type || item.type === 'link')
  const mainCtas = mainItems.filter((item) => item.type === 'primary-cta' || item.type === 'secondary-cta')

  const memberLinks = memberItems.filter((item) => !item.type || item.type === 'link')
  const memberCtas = memberItems.filter((item) => item.type === 'primary-cta' || item.type === 'secondary-cta')

  if (isMobile) {
    return (
      <>
        <nav className="preview-nav">
          <span className="preview-nav__logo">{projectName || 'Website Name'}</span>
          <div className="preview-nav__mobile-actions">
            {mainCtas.filter(item => item.type === 'primary-cta').map(item => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => e.preventDefault()}
                className="preview-nav__link preview-nav__link--primary-cta"
              >
                {item.label}
              </a>
            ))}
            <button
              className="preview-nav__hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              title="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
          {menuOpen && (
            <div className="preview-nav__mobile-menu">
              {mainLinks.map((item) => {
                const hasChildren = item.children.filter(c => !c.hidden).length > 0
                const isExpanded = expandedItems[item.id]
                return (
                  <div key={item.id} className="preview-nav__mobile-item">
                    <div className="preview-nav__mobile-row">
                      <a href={item.path} onClick={(e) => e.preventDefault()}>{item.label}</a>
                      {hasChildren && (
                        <button
                          className={`preview-nav__mobile-expand${isExpanded ? ' preview-nav__mobile-expand--open' : ''}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          ▾
                        </button>
                      )}
                    </div>
                    {hasChildren && isExpanded && item.children.filter(c => !c.hidden).map((child) => (
                      <div key={child.id} className="preview-nav__mobile-item preview-nav__mobile-item--child">
                        <a href={child.path} onClick={(e) => e.preventDefault()}>{child.label}</a>
                      </div>
                    ))}
                  </div>
                )
              })}
              {mainCtas.map((item) => (
                <div key={item.id} className="preview-nav__mobile-item preview-nav__mobile-item--cta">
                  <a href={item.path} onClick={(e) => e.preventDefault()}>{item.label}</a>
                </div>
              ))}
              {memberItems.length > 0 && (
                <>
                  <div className="preview-nav__mobile-section-label">Member</div>
                  {memberItems.map((item) => (
                    <div key={item.id} className="preview-nav__mobile-item preview-nav__mobile-item--member">
                      <a href={item.path} onClick={(e) => e.preventDefault()}>{item.label}</a>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </nav>
      </>
    )
  }

  return (
    <>
      <nav className="preview-nav">
        <span className="preview-nav__logo">{projectName || 'Website Name'}</span>

        <ul className="preview-nav__list">
          {mainLinks.map((item) => (
            <li key={item.id} className="preview-nav__item">
              <a
                href={item.path}
                onClick={(e) => e.preventDefault()}
                className="preview-nav__link"
              >
                {item.label}
                {item.children.filter(c => !c.hidden).length > 0 && (
                  <span className="preview-nav__caret">▾</span>
                )}
              </a>
              {item.children.filter(c => !c.hidden).length > 0 && (
                <ul className="preview-nav__dropdown">
                  {item.children.filter(c => !c.hidden).map((child) => (
                    <li key={child.id} className="preview-nav__dropdown-item">
                      <a href={child.path} onClick={(e) => e.preventDefault()}>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {mainCtas.length > 0 && (
          <ul className="preview-nav__cta-list">
            {mainCtas.map((item) => (
              <li key={item.id} className="preview-nav__item">
                <a
                  href={item.path}
                  onClick={(e) => e.preventDefault()}
                  className={`preview-nav__link preview-nav__link--${item.type}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {memberItems.length > 0 && (
        <nav className="preview-nav preview-nav--member">
          <ul className="preview-nav__list">
            {memberLinks.map((item) => (
              <li key={item.id} className="preview-nav__item">
                <a
                  href={item.path}
                  onClick={(e) => e.preventDefault()}
                  className="preview-nav__link preview-nav__link--member"
                >
                  {item.label}
                  {item.children.filter(c => !c.hidden).length > 0 && (
                    <span className="preview-nav__caret">▾</span>
                  )}
                </a>
                {item.children.filter(c => !c.hidden).length > 0 && (
                  <ul className="preview-nav__dropdown">
                    {item.children.filter(c => !c.hidden).map((child) => (
                      <li key={child.id} className="preview-nav__dropdown-item">
                        <a href={child.path} onClick={(e) => e.preventDefault()}>
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {memberCtas.length > 0 && (
            <ul className="preview-nav__cta-list">
              {memberCtas.map((item) => (
                <li key={item.id} className="preview-nav__item">
                  <a
                    href={item.path}
                    onClick={(e) => e.preventDefault()}
                    className={`preview-nav__link preview-nav__link--${item.type}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}
    </>
  )
}
