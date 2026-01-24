import { LoaderCircle } from 'lucide-react'

const Loading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <LoaderCircle className="animate-spin" />
      {children}
    </div>
  )
}

export { Loading }
