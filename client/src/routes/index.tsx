import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavStore } from '@/lib/store'
import { SlothLogo } from '@/assets'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const toggleDisplay = useNavStore((state) => state.toggleDisplay)
  const showDisplay = useNavStore((state) => state.showDisplay)

  useEffect(() => {
    showDisplay()
  }, [showDisplay])
  return (
    <div className="relative z-10 flex justify-center items-center text-center h-[calc(100dvh-120px)] mt-10 px-4 bg-core-background">
      <div className="flex flex-col items-center gap-10">
        <img src={SlothLogo} className="w-30 rounded-2xl" />
        <div className="flex flex-col items-center gap-4">
          <h1
            className="text-4xl font-recoleta font-bold"
            onClick={toggleDisplay}
          >
            Meet{' '}
            <span className="px-2 bg-[#99705c] text-core-background">
              sloth
            </span>{' '}
            Productive without pressure
          </h1>
          <span className="w-120 text-muted-foreground">
            Plan your day at your own pace. Sloth keeps your tasks simple,
            focused, and stress-free—so progress feels good again
          </span>
        </div>
      </div>
    </div>
  )
}
