import React from 'react'
import { Skeleton } from './ui/skeleton'

function PaletteSkeleton() {
  return (
    <div className='flex flex-col items-center space-y-3 animate-pulse'>
      <div className='w-full aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800'/> 
      <div className='flex justify-between w-full px-2'>
        <Skeleton className='h-4 w-20 rounded' />
        <Skeleton className='h-4 w-10 rounded' />
      </div>
    </div>
  );
}



export function SkeletonGrid() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {Array.from({ length: 15 }).map((_, i) => (
        <PaletteSkeleton key={i} />
      ))}
    </div>
  )
}

