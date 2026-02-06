import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hc } from 'hono/client'
import { toast } from 'sonner'
import type { AppType } from '../../../../server'

const client = hc<AppType>('/')

// Mutation to create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string
      description?: string
    }) => {
      const res = await client.api.todos.$post({
        json: {
          title,
          description,
        },
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create todo')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
