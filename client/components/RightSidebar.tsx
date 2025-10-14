"use client";

import React, { useEffect } from 'react';
import { Separator } from './ui/separator';
import { useColorQuery } from '@/hooks/useColorQuery' 
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
// import { AlertCircle, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
// import LikedPalettes from '@/components/LikedPalletes';
import LikedPalettesRightSide from './LikedPalletesRightSide';

export const RightSidebar = () => {
    const userToken = useUser();
    const { toast } = useToast();
    const { ref } = useInView();
    const { useLikedColorPalletes } = useColorQuery();
    const { data, error, isLoading } = useLikedColorPalletes(userToken || "");

    useEffect(() => {
        if(error) {
            toast({
                title: "Error",
                description: "Failed to load Color Palettes"
            });
        }
    }, [error, toast]);

    const allLikedColorPalletes = data?.palettes || [];

    return (
        <nav className="h-full flex flex-col p-4 overflow-hidden">
            {/* Fixed header section */}
            <div className="flex-shrink-0">
                <div className="font-medium text-xl mb-4">
                    🐝ColorBee is for UI Designers and Artists
                </div>
                <div className="text-xs space-y-2 mb-4">
                    <a href="#introduction" className="block">
                        Discover the newest hand-picked palettes of Color Hunt
                    </a>
                </div>
                <Separator className="mb-4" />
            </div>

            <div className='font-semibold text-xl pb-3'>
                Collections
            </div>

            {/* Scrollable palettes section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto overflow-x-hidden gap-2">
                {allLikedColorPalletes.length > 0 ? (
                    allLikedColorPalletes.map((palette: any, index: number) => (
                        <div
                            key={`${palette._id || palette.id}-${index}`}
                            ref={index === allLikedColorPalletes.length - 1 ? ref : null}
                        >
                            <LikedPalettesRightSide
                                id={palette._id || palette.id}
                                colors={palette.colors}
                                // likes={palette.likes}
                                // isLiked={palette.isLiked}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center flex items-center justify-center text-sm text-gray-500 mt-8">
                        No liked palettes yet
                    </div>
                )}
            </div>
        </nav>
    );
};