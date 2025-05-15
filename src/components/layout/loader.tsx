export function Loader() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-r-primary border-l-primary border-t-transparent border-b-transparent animate-ping opacity-20"></div>
      </div>
    </div>
  )
}