import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  
  return (
      [1,2,3,4,5,6,7,8,9,10].map(() => {
        return (
          <Skeleton className="h-[61px] w-full rounded-xl mt-5" />
        )
      })
  )
}

export default Loading