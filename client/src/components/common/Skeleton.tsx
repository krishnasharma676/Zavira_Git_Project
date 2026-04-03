import React from 'react';

export const HomeSkeleton = () => (
  <div className="w-full min-h-screen px-6 lg:px-12 py-10 animate-pulse space-y-12 bg-white dark:bg-zavira-blackDeep">
    <div className="w-full h-[45vh] bg-gray-100 dark:bg-white/5 rounded-3xl"></div>
    <div className="flex flex-col items-center gap-4">
       <div className="h-4 w-32 bg-gray-100 dark:bg-white/10 rounded-full"></div>
       <div className="h-10 w-80 bg-gray-100 dark:bg-white/10 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-2xl w-full"></div>
          <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded-full mx-auto"></div>
          <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/5 rounded-full mx-auto opacity-50"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ProductSkeleton = () => (
  <div className="w-full min-h-screen px-6 lg:px-12 py-20 animate-pulse bg-white dark:bg-zavira-blackDeep">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
      <div className="aspect-square bg-gray-100 dark:bg-white/5 rounded-3xl"></div>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-10 w-3/4 bg-gray-100 dark:bg-white/10 rounded-full"></div>
          <div className="h-4 w-1/4 bg-gray-100 dark:bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-4 pt-10 border-t border-gray-100/10">
          <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full"></div>
          <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full"></div>
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-white/5 rounded-full"></div>
        </div>
        <div className="pt-10 flex gap-4">
          <div className="h-14 flex-grow bg-gray-100 dark:bg-white/10 rounded-full"></div>
          <div className="h-14 w-14 bg-gray-100 dark:bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ShopSkeleton = () => (
  <div className="w-full min-h-screen px-6 lg:px-12 py-12 animate-pulse bg-white dark:bg-zavira-blackDeep">
    <div className="flex gap-10">
      <div className="hidden lg:block w-64 space-y-8 shrink-0">
         {[1, 2, 3].map(i => (
           <div key={i} className="space-y-3">
              <div className="h-5 w-24 bg-gray-100 dark:bg-white/10 rounded-full"></div>
              <div className="space-y-2">
                 <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full"></div>
                 <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full"></div>
                 <div className="h-4 w-2/3 bg-gray-100 dark:bg-white/5 rounded-full"></div>
              </div>
           </div>
         ))}
      </div>
      <div className="flex-grow space-y-10">
         <div className="h-12 w-full bg-gray-100 dark:bg-white/10 rounded-full"></div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-2xl w-full"></div>
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded-full mx-auto"></div>
              </div>
            ))}
         </div>
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="w-full min-h-[60vh] px-6 lg:px-12 py-10 animate-pulse space-y-12 bg-white dark:bg-zavira-blackDeep">
     <div className="max-w-4xl mx-auto space-y-8 py-10 text-center">
        <div className="h-16 w-3/4 bg-gray-100 dark:bg-white/10 rounded-full mx-auto"></div>
        <div className="h-4 w-1/2 bg-gray-100 dark:bg-white/10 rounded-full mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
           <div className="aspect-square bg-gray-100 dark:bg-white/5 rounded-3xl"></div>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-10 w-full bg-gray-100 dark:bg-white/5 rounded-xl"></div>
              ))}
           </div>
        </div>
     </div>
  </div>
);
