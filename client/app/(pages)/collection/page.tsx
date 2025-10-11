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

function CollectionPage() {
  const userToken = useUser();
  const { toast } = useToast();
  const { ref } = useInView();
  const { useLikedColorPalletes } = useColorQuery();
  const { data, error, isLoading } = useLikedColorPalletes(userToken || "");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load Color Palettes"
      });
    }
  }, [error, toast]);

  const allLikedColorPalletes = data?.palettes || [];

  return (
    <div className='flex flex-col w-full h-auto'>
      <div className='flex items-center justify-between w-full pb-5'>
        <span className='text-xl font-medium'>My Collection</span>
        <span className='text-slate-500'>{allLikedColorPalletes.length} palettes</span>
      </div>
      <Separator />
      {allLikedColorPalletes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-10 pl-2">
          {allLikedColorPalletes.map((palette: any, index: number) => {
            // Ensure we're using the correct ID field
            const paletteId = palette.id || palette._id;

            return (
              <div
                key={`${paletteId}-${index}`}
                ref={index === allLikedColorPalletes.length - 1 ? ref : null}
                className="flex flex-col items-center"
              >
                <LikedPalettes
                  id={paletteId?.toString()}
                  colors={palette.colors}
                  likes={palette.likes}
                  isLiked={palette.isLiked}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center h-full'>
          <Image
            src={"https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e532a5133d3686ff53d2a74_peep-2.png"}
            alt='no collections'
            width={200}
            height={200}
          />
          <h1 className='font-semibold text-xl pb-2'>No palettes in collection</h1>
          <p className='text-xs text-slate-600 pb-10'>You haven't liked anything yet!</p>
          <Link href={"/popular"}>
            <Button className='text-slate-700' variant={"outline"}>
              Find beautiful palettes
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default CollectionPage;