import { FC } from 'react';

const LoadingSkeleton: FC = () => {
  return (
    <div className="animate-pulse bg-slate-50 min-h-screen">
      {/* Tabs Skeleton */}
      <div className="p-4">
        <div className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 mx-1 bg-slate-200 rounded-md" />
          ))}
        </div>
        {/* Main Content Skeleton Container */}
        <div className="bg-white rounded-xl shadow-lg mx-auto max-w-6xl p-6 mt-2">
          {/* Attention Cards Skeleton */}
          <div className="flex flex-row justify-center gap-16 mb-4">
            <div className="w-64 h-16 bg-slate-100 rounded-lg" />
            <div className="w-64 h-16 bg-slate-100 rounded-lg" />
          </div>
          {/* Allocation Chart Skeleton */}
          <div className="flex items-end h-80 w-full gap-4">
            {[60, 100, 80, 120, 90, 70, 110].map((height, i) => (
              <div
                key={i}
                className="bg-slate-200 rounded-t-md w-10"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 