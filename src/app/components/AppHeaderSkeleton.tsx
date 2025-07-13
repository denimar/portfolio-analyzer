import { FC } from 'react';

const AppHeaderSkeleton: FC = () => {
  return (
    <div className="shadow-lg border-b border-b-slate-200 z-20 bg-white">
      <div className="flex flex-row items-center justify-between pr-10 pl-6 py-4 min-h-[60px]">
        {/* Portfolio Selector */}
        <div className="h-9 w-64 bg-slate-200 rounded-md" />
        {/* Metrics & IBKR */}
        <div className="flex flex-1 flex-row gap-8 items-center justify-end min-h-[40px] pr-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-end space-y-1">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-24 bg-slate-200 rounded" />
            </div>
          ))}
          <div className="ml-6">
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeaderSkeleton; 