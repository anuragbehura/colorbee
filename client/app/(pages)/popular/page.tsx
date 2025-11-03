"use client";

import React, { Suspense, useEffect, useState } from 'react';
import ColorPalettes from '@/components/ColorPalletes';
import { useUser } from '@/hooks/useUser';
import { Loader2, AlertCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useColorQuery } from '@/hooks/useColorQuery';
import { useToast } from '@/hooks/use-toast';
import { SkeletonGrid } from '@/components/SkeletonGrid';
import DropdownMenuCheckboxes from '@/components/DropDownMenuWithCheck';

export default function page() {
  const userToken = useUser();
  const { ref, inView } = useInView();
  const { toast } = useToast();
  const [filter, setFilter] = useState("");

  // Debug effect
  useEffect(() => {
    console.log("Filter state changed:", filter);
  }, [filter]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useColorQuery().useColorPalletesByPopular(filter, userToken);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load Color Palletes"
      });
    }
  }, [error, toast]);

  const allColorPalletesByPopular = data?.pages.flatMap((page: any) => page.palettes) || [];

  if (isLoading || !userToken) {
    return <SkeletonGrid />
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle className="w-12 h-12" />
        <p className="mt-2 text-lg font-semibold">Something went wrong!</p>
        <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    )
  }
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <div className='mb-10'>
        <DropdownMenuCheckboxes filter={filter} setFilter={setFilter} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {allColorPalletesByPopular.map((palette, index) => (
          <div
            key={palette.id}

            ref={index === allColorPalletesByPopular.length - 1 ? ref : null}
            className="flex flex-col items-center"
          >
            <ColorPalettes
              id={palette.id}
              colors={palette.colors}
              likes={palette.likes}
              createdAt={palette.createdAt}
              isLiked={palette.isLiked}
            />
          </div>
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center col-span-full">
            <Loader2 className="animate-spin text-gray-900 w-8 h-8" />
          </div>
        )}
      </div>
    </Suspense>
  )
}

