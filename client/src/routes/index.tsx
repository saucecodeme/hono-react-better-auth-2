import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex justify-center items-center text-center h-[calc(100vh-64px)] px-4">
      <h1>- Hono react with better auth -</h1>
    </div>
  )
}
