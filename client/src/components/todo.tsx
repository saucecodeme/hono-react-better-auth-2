import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Checkbox } from './ui/checkbox'

export interface TodoComponentProps {
  title: string
}

export const TodoComponent = React.forwardRef<
  HTMLDivElement,
  TodoComponentProps
>((props, ref) => {
  const { title } = props
  const [isEditing, setIsEditing] = useState(false)

  const internalRef = useRef<HTMLDivElement>(null)
  // Combine the forwarded ref with the internal ref
  const setRefs = (node: HTMLDivElement) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
    internalRef.current = node
  }

  const handleInitEditing = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        internalRef.current &&
        !internalRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    // Cleanup event listener when editing ends or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing])

  return (
    <div ref={setRefs} onClick={handleInitEditing}>
      <motion.form
        layout
        animate={{
          backgroundColor: isEditing ? '#fffcec10' : 'rgba(0,0,0,0)',
          padding: isEditing ? '0.5rem 1rem' : '0rem 0.25rem',
          margin: isEditing ? '10px 0px' : '0px 0px',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 rounded-xl"
      >
        <Checkbox />
        {isEditing ? (
          <input
            type="text"
            value={title}
            className="w-50 border-0! ring-0! outline-none! shadow-none focus-visible:border-0! focus-visible:ring-0 focus-visible:outline-none"
          />
        ) : (
          <span className="w-50">{title}</span>
        )}
      </motion.form>
    </div>
  )
})
