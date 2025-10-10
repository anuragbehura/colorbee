"use client";

import React, { useEffect } from 'react';
import { Separator } from './ui/separator';
import { useColorQuery } from '@/hooks/useColorQuery' 
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import LikedPalettes from '@/components/LikedPalletes';

export const RightSidebar = () => {
    const userToken = useUser();
    const { toast } = useToast();
    const {ref} = useInView();
    const { useLikedColorPalletes } = useColorQuery();
    const { data, error, isLoading } = useLikedColorPalletes(userToken || "");

    useEffect(() => {
        if(error) {
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
        <div className="h-full overflow-y-auto p-4">
            <nav className="space-y-4">
                <div className="font-medium text-xl">🐝ColorBee is for UI Designers and Artists</div>
                {/* Add your table of contents items here */}
                <div className="text-xs space-y-2">
                    <a href="#introduction" className="block">
                        Discover the newest hand-picked palettes of Color Hunt
                    </a>
                    {/* Add more TOC items as needed */}
                </div>
                <Separator />
                {allLikedColorPalletes.map((pallete: any, index: number) => (
                    <div
                    key={`${pallete._id}-${index}`}
                    ref={index === allLikedColorPalletes.length - 1 ? ref : null}
                    >
                        <LikedPalettes
                        id={pallete._id}
                        colors={pallete.colors}
                        likes={pallete.likes}
                        createdAt={pallete.createdAt}
                        isLiked={pallete.isLiked}
                        />
                    </div>
                ))}
            </nav>
        </div>
    );
};