import React, { ReactNode, useState, useEffect, useRef } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = triggerRect.top + window.scrollY
      let left = triggerRect.right + window.scrollX

      if (position === 'left') {
        left = triggerRect.left - tooltipRect.width - 8
      } else if (position === 'top') {
        top = triggerRect.top - tooltipRect.height - 8
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      } else if (position === 'bottom') {
        top = triggerRect.bottom + 8
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      }

      tooltipRef.current.style.top = `${top}px`
      tooltipRef.current.style.left = `${left}px`
    }
  }, [isVisible, position])

  return (
    <>
      <div
        ref={triggerRef}
        className='inline-block'
        style={{ cursor: 'pointer' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[9999] px-2 py-1 text-xs text-gray-400 rounded-md border border-gray-600`}
          style={{
            width: '200px',
            maxWidth: '90vw',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
          }}>
          {content}
        </div>
      )}
    </>
  )
}

export default Tooltip
