import React, { useEffect, useRef, useCallback, ReactNode, CSSProperties } from 'react'

interface ModalWrapperProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
  style?: CSSProperties // Added this line
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isVisible, onClose, children, style }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  if (!isVisible) return null

  return (
    // modal backdrop
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      style={{ backdropFilter: 'blur(4px)' }}>
      {/* modal box */}
      <div
        ref={modalRef}
        className='modal-box relative mx-auto flex flex-col bg-base-300 border-accent border text-neutral-content rounded-3xl pt-4 px-5 pb-0 shadow-lg overflow-y-clip'
        style={style}>
        {/* close modal button */}
        <button className='btn-outline absolute top-3 right-3 text-neutral-content' onClick={onClose}>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
