import { FC } from "react";

type DashboardWidgetProps = {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const DashboardWidget: FC<DashboardWidgetProps> = ({ className, title, children }) => {
  return (
    <div className={`flex flex-col bg-white rounded-2xl shadow-md text-sm ${className}`}>
      <div className="py-2 px-4 text-slate-300 border-b border-b-gray-100">{ title }</div>
      <div className="flex flex-col p-2 w-full h-full">
        {children}
      </div>
    </div>
  )
}

export default DashboardWidget;