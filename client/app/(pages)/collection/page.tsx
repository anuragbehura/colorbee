"use client";

import LikedPalettes from '@/components/LikedPalletes';
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useColorQuery } from '@/hooks/useColorQuery'
import { useUser } from '@/hooks/useUser'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

function page() {
  const userToken = useUser();
  const { toast } = useToast();
  const { ref } = useInView();
  const { useLikedColorPalletes } = useColorQuery();
  const { data, error, isLoading } = useLikedColorPalletes(userToken || "");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load Color Palletes"
      });
    }
  }, [error, toast]);


  const allLikedColorPalletes = data?.palettes || [];

  // if (!userToken || isLoading) {
  //     return (
  //         <div className="flex justify-center items-center h-screen">
  //             <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
  //         </div>
  //     );
  // }

  // if (error) {
  //     return (
  //         <div className="flex flex-col justify-center items-center h-screen text-red-500">
  //             <AlertCircle className="w-12 h-12" />
  //             <p className="mt-2 text-lg font-semibold">Something went wrong!</p>
  //             <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
  //         </div>
  //     );
  // }
  return (
    <div className='flex flex-col w-full h-auto'>
      <div className='flex items-center justify-between w-full pb-5'>
        <span className='text-xl font-medium'>My Collection</span>
        <span className='text-slate-500'>0 palettes</span>
      </div>
      <Separator />
      {allLikedColorPalletes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
          {allLikedColorPalletes.map((palette : any, index: number) => (
            <LikedPalettes
              key={`${palette._id}-${index}`}
              id={palette._id}
              colors={palette.colors}
              likes={palette.likes}
              createdAt={palette.createdAt}
              isLiked={palette.isLiked}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center h-full'>
          <Image src={"https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e532a5133d3686ff53d2a74_peep-2.png"} alt='no collections' width={200} height={200} />
          <h1 className='font-semibold text-xl pb-2'>No palettes in collection</h1>
          <p className='text-xs text-slate-600 pb-10'>You haven't liked anything yet!</p>
          <Link href={"/popular"} >
            <Button className='text-slate-700' variant={"outline"}>Find beautiful palettes</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default page
