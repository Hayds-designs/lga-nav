import { useState } from 'react'
import { NavBar } from './NavBar'
import './Preview.css'

const STEPS = [
  {
    number: '1',
    title: 'Edit your navigation',
    body: 'Use the panel on the left to add pages, rename them, set URL paths, add sub-pages, and choose whether an item is a link or a CTA button. Drag the ⠿ handle to reorder.',
  },
  {
    number: '2',
    title: 'Preview & check',
    body: 'Hover over any top-level item with sub-pages to see the dropdown in action. Make sure the labels, order, and button types all look right before saving the JSON.',
  },
  {
    number: '3',
    title: "Save your work (don't forget)",
    body: 'Click Save JSON in the toolbar to download your navigation as a file. Next time you open this tool, use Load JSON to pick up exactly where you left off. Without saving, your work will be lost if the browser tab is closed.',
    emphasis: true,
  },
]

export function Preview({ navTree, projectName, siteUrl, logoText, onSiteUrlChange, onLogoTextChange }) {
  const [isMobile, setIsMobile] = useState(false)

  return (
    <main className="preview">
      <div className="preview__header">
        <div className="preview__label">Live Preview</div>
        <button
          className={`preview__viewport-toggle${isMobile ? ' preview__viewport-toggle--mobile' : ''}`}
          onClick={() => setIsMobile(v => !v)}
          role="switch"
          aria-checked={isMobile}
        >
          <span className="preview__viewport-label preview__viewport-label--left">Desktop</span>
          <span className="preview__viewport-label preview__viewport-label--right">Mobile</span>
        </button>
      </div>
      <div className={`preview__window${isMobile ? ' preview__window--mobile' : ''}`}>
        <div className="preview__browser-bar">
          <div className="preview__dots">
            <span className="preview__dot preview__dot--red" />
            <span className="preview__dot preview__dot--yellow" />
            <span className="preview__dot preview__dot--green" />
          </div>
          <div className="preview__url-bar">
            <input
              className="preview__url-input"
              value={siteUrl}
              onChange={(e) => onSiteUrlChange(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="preview__page">
          <NavBar
            navTree={navTree}
            projectName={projectName}
            isMobile={isMobile}
          />
          <div className="preview__body">
            <div className="preview__guide">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className={`preview__step${step.emphasis ? ' preview__step--emphasis' : ''}`}
                >
                  <div className="preview__step-number">{step.number}</div>
                  <div className="preview__step-content">
                    <div className="preview__step-title">{step.title}</div>
                    <div className="preview__step-body">{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
