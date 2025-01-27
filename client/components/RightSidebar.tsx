"use client";

import React from 'react';
import { Separator } from './ui/separator';

export const RightSidebar = () => {
    return (
        <div className="h-full overflow-y-auto p-4">
            <nav className="space-y-4">
                <div className="font-medium text-xl">ColorBee🐝is for UI Designers and Artists</div>
                {/* Add your table of contents items here */}
                <div className="text-xs space-y-2">
                    <a href="#introduction" className="block">
                        Discover the newest hand-picked palettes of Color Hunt
                    </a>
                    {/* Add more TOC items as needed */}
                </div>
                <Separator />
            </nav>
        </div>
    );
};