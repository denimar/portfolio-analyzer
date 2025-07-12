import Image from "next/image";
import CustomTooltip from "../CustomTooltip";
import { FC, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

type IbkrStatusProps = {
  className?: string
}

const IbkrStatus: FC<IbkrStatusProps> = ({ className }) => {
  const [lastTimeChecked, setLastTimeChecked] = useState<string>(moment().format())
  const [isUp, setIsUp] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const healthStatus: any = await axios.get('https://denimarlab.pro/api/health').then(res => res.data);
      debugger
      setIsUp(healthStatus.tws.connected);
      setLastTimeChecked(moment().format())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CustomTooltip title={ `${isUp ? 'IBKR is connected' : 'IBKR is down'}`}>
      <div className={`relative border border-slate-200 rounded-full shadow-lg py-[2px] px-[4px] ${className}`}>
        <Image className="rounded-full" src="/ibkr.png" alt={`Ibkr status at ${lastTimeChecked}`} width={32} height={32} />
        <span className={`absolute bottom-0 left-7 transform translate-y-1/4 w-3.5 h-3.5 ${isUp ? 'bg-green-400' : 'bg-gray-400'} border-2 border-white dark:border-gray-800 rounded-full`}></span>
      </div>
    </CustomTooltip>
  )
}

export default IbkrStatus