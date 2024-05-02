import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { handleZap } from "@/lib/utils"
import { BsFillLightningChargeFill } from "react-icons/bs"

const ListItem = ({ name, type }: { name: string, type: string }) => {

  const getExtension = (name: string) => {
    const split = name.split(".")
    return "File/" + split[split.length - 1]
  }

  return (
    <div className="w-full max-w-full flex justify-between gap-5 bg-white dark:bg-dark mt-2 p-4 shadow-sm border border-[#e1e4e8cc] dark:border-[#28292bcc] rounded-md">
      <Tooltip>
        <TooltipTrigger className="leading-7 [&:not(:first-child)]:mt-6 overflow-hidden whitespace-nowrap text-ellipsis"><p className="overflow-hidden whitespace-nowrap text-ellipsis"> {name}</p></TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex gap-2 items-center">
        <Badge variant="outline">{type === "File" ? getExtension(name) : type}</Badge>
        <Tooltip>
          <TooltipTrigger><BsFillLightningChargeFill onClick={() => handleZap(name, type)} className="text-accent cursor-pointer"/></TooltipTrigger>
          <TooltipContent>
            <p>Zap</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ListItem