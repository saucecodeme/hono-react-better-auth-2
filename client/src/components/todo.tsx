import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Star, X } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useUpdateTodo } from '@/utils/tanstack-query/useMutation'
import { Button } from '@/components/ui/button'

export interface TodoComponentProps {
  id: string
  title: string
  description: string | null
  completed: boolean
  onEditStart: (id: string) => void
  onEditEnd: (id: string) => void
  handleDeleteTodo: () => Promise<void>
}

export const TodoComponent = React.forwardRef<
  HTMLDivElement,
  TodoComponentProps
>((props, ref) => {
  const {
    id,
    title,
    description,
    completed,
    onEditStart,
    onEditEnd,
    handleDeleteTodo,
  } = props
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedDesc, setEditedDesc] = useState(description)

  const updateTodoMutation = useUpdateTodo()

  const internalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevIsEditingRef = useRef(false)

  // Combine the forwarded ref with the internal ref
  const setRefs = (node: HTMLDivElement) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
    internalRef.current = node
  }

  const handleInitEditing = (e: React.MouseEvent) => {
    // Check if clicked element is checkbox
    if (
      e.target instanceof HTMLElement &&
      e.target.closest('[data-checkbox]')
    ) {
      return // Don't enter edit mode
    }
    onEditStart(id)
    setIsEditing(true)
  }

  // const handleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setEditedTitle(event.target.value)
  // }

  const handleFormEditing = (event: React.ChangeEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const formData = new FormData(form)
    const rawTitle = (formData.get('title') as string) || ''
    const rawDescription = (formData.get('description') as string) || ''
    const trimmedTitle = rawTitle.trim()
    const trimmedDescription = rawDescription.trim()
    if (trimmedTitle !== title && trimmedTitle.length > 0)
      setEditedTitle(trimmedTitle)
    if (trimmedDescription !== description && trimmedDescription.length > 0)
      setEditedDesc(trimmedDescription)
  }

  const handleSaveEditing = async () => {
    const trimmedTitle = editedTitle.trim()
    const trimmedDescription = editedDesc ? editedDesc.trim() : ''
    if (
      (trimmedTitle !== title && trimmedTitle.length > 0) ||
      (trimmedDescription !== description && trimmedDescription.length > 0)
    ) {
      console.log('Save')
      await updateTodoMutation.mutateAsync({
        id,
        title: trimmedTitle,
        description: trimmedDescription,
      })
    } else if (trimmedTitle.length === 0) {
      handleDeleteTodo()
    }
    setIsEditing(false)
    onEditEnd(id)
  }

  const handleToggleComplete = async () => {
    await updateTodoMutation.mutateAsync({
      id: props.id,
      completed: !completed,
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // Treat Cmd+Enter or Ctrl+Enter as save shortcut
      event.preventDefault()
      handleSaveEditing()
      return
    } else if (event.key === 'Enter') {
      event.preventDefault()
      handleSaveEditing()
    } else if (event.key === 'Escape') {
      setEditedTitle(title)
      setIsEditing(false)
      onEditEnd(id)
    }
  }

  // Focus title input only when entering edit mode
  useEffect(() => {
    if (isEditing && !prevIsEditingRef.current && inputRef.current) {
      inputRef.current.focus()
      // inputRef.current.select() // ← Select all text for easy editing
    }
    prevIsEditingRef.current = isEditing
  }, [isEditing])

  // Handle click outside to save
  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!internalRef.current || internalRef.current.contains(target)) return
      // Don't trigger when clicking elements that should handle their own click (e.g. delete button)
      if (
        target instanceof HTMLElement &&
        target.closest('[data-ignore-click-outside]')
      ) {
        return
      }
      handleSaveEditing()
    }

    document.addEventListener('mousedown', handleClickOutside)
    // Cleanup event listener when editing ends or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing, handleSaveEditing])

  return (
    <div ref={setRefs} className="w-full">
      <motion.form
        // layout
        initial={{
          padding: '0rem 1rem',
        }}
        animate={{
          backgroundColor: isEditing ? '#343338' : '#26252800',
          padding: isEditing ? '1rem 1rem' : '0rem 1rem',
          margin: isEditing ? '10px 0px' : '0px 0px',
          // boxShadow: isEditing
          //   ? '0px 4px 6px -1px rgb(0 0 0 / 0.1)'
          //   : '0px 0px',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="h-fit w-full flex flex-col items-start rounded-lg"
        onChange={handleFormEditing}
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-2">
          <Checkbox
            data-checkbox
            checked={completed}
            onCheckedChange={handleToggleComplete}
            className="mt-0.5 border-core-background/30 data-[state=checked]:border-0 data-[state=checked]:bg-[#18AEF8] data-[state=checked]:text-core-foreground"
          />
          <div className="flex flex-col justify-start items-start">
            <div onClick={handleInitEditing} className="relative w-60">
              {isEditing ? (
                <input
                  ref={inputRef}
                  id={`title-${id}`}
                  name="title"
                  type="text"
                  defaultValue={editedTitle}
                  // onChange={handleEditing}
                  // onKeyDown={handleKeyDown}
                  disabled={updateTodoMutation.isPending}
                  className="w-full border-0! ring-0! outline-none! shadow-none focus-visible:border-0! focus-visible:ring-0 focus-visible:outline-none"
                />
              ) : (
                <span className="w-full truncate">{editedTitle}</span>
              )}
            </div>
            <AnimatePresence initial={false}>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  className="w-full overflow-hidden"
                >
                  <textarea
                    id={`description-${id}`}
                    name="description"
                    placeholder="Notes"
                    defaultValue={description ?? ''}
                    className="mt-2 min-h-10 w-full field-sizing-content resize-none outline-none"
                  ></textarea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="w-full"
          >
            <div className="px-2 flex gap-2 text-[0.75rem]">
              <span className="bg-[#FA185590] px-2 py-0.5 rounded-sm">
                Frontend
              </span>
              <span className="bg-[#39A99D90] px-2 py-0.5 rounded-sm">
                UXUI
              </span>
            </div>
            <div className="mt-2">
              <Button
                type="button"
                variant="none"
                size="sm"
                className="group h-6 hover:bg-[#4c4c50] rounded-md [&_svg]:pointer-events-auto"
              >
                <Star size={12} color="#FFD400" fill="#FFD400" />
                <span>Today</span>
                <X className="ml-1 size-3 invisible group-hover:visible hover:text-core-destructive" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.form>
    </div>
  )
})
