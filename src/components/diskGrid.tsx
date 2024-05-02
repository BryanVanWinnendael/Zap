import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { useDisks } from "@/context/diskContext";
import RecentList from "./recentList";

interface Progress {
  [drive: string]: number;
}



const DiskGrid = () => {
  const [progress, setProgress] = useState<Progress>({});
  const { diskUsage, setDiskUsage, disks, setDisks } = useDisks();
  
  useEffect(() => {
    async function progressListener() {
      await listen('update_progress', (event) => {
        const payload: string = String(event.payload);
        const [disk, prgs] = payload.split(",");
        if (!disks.includes(disk)) {
          setDisks([...disks, disk]);
        }
        setProgress({
          ...progress,
          [disk]:  Number(prgs),
        });
      });
    }

    async function usageListener() {
      await listen('used_gb', (event) => {
        const payload: string = String(event.payload);
        const [disk, usage] = payload.split(",");
        setDiskUsage({
          ...diskUsage,
          [disk]: Number(usage),
        });
      });
    }

    progressListener();
    usageListener();
  }, []);
  
  return (
    <div className="h-full flex flex-col">
      <div className="w-full">
        <h1 className="bg-gradient-to-r from-accent to-black text-transparent bg-clip-text w-full text-4xl font-bold mb-2">Disks</h1>
        <hr className="w-full border-t border-[#e1e4e8cc] dark:border-[#28292bcc] mb-4"/>
        <div className="flex items-center overflow-x-auto max-w-full w-full">
          {disks.map((disk) => (
            <div className="p-2 w-[120px] h-[100px] flex flex-col justify-center items-center gap-2 bg-white dark:bg-dark shadow-sm border border-[#e1e4e8cc] dark:border-[#28292bcc] rounded-md">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {disk}
              </h3>
              {
                diskUsage[disk] ? (
                  <p className="text-sm text-muted-foreground">
                    {diskUsage[disk]} GB used
                  </p>
                ) : (
                  <Progress className="w-full h-2" key={disk} value={progress[disk]} />
                )
              
              }
              
            </div>
          ))}
        </div>
      </div>
      <h1 className="bg-gradient-to-r from-accent to-black text-transparent bg-clip-text text-4xl font-bold mt-10 mb-2">Recent Zaps</h1>
      <hr className="w-full border-t border-[#e1e4e8cc] dark:border-[#28292bcc] mb-4"/>
      <RecentList />
    </div>
  )
}

export default DiskGrid