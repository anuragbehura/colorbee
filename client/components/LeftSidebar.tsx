// LeftSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, Shuffle, Sparkle } from "lucide-react";
import { Separator } from "./ui/separator";

export const LeftSidebar = () => {
    const pathname = usePathname();

    const sidebarSections = [
        { name: "new", icon: Sparkle },
        { name: "popular", icon: Flame },
        { name: "random", icon: Shuffle },
        { name: "collection", icon: Heart },
    ];

    const collectionOptions = [
        "Pastel", "Vintage", "Retro", "Neon", "Gold", "Light", "Dark", "Warm",
        "Cold", "Summer", "Fall", "Winter", "Spring", "Happy", "Nature", "Earth",
        "Night", "Space", "Rainbow", "Gradient", "Sunset", "Sky", "Sea", "Kids",
        "Skin", "Food", "Cream", "Coffee", "Wedding", "Christmas", "Halloween",
    ];

    const activeSection = pathname === "/" ? "new" : pathname.slice(1);

    return (
        <div className="h-full py-6">
            <nav className="px-4 space-y-4">
                <div className="space-y-1">
                    {sidebarSections.map(({ name, icon: Icon }) => (
                        <Link
                            key={name}
                            href={name === "new" ? "/" : `/${name}`}
                            className={`flex items-center p-2 rounded-xl transition-colors ${activeSection === name
                                    ? "bg-gray-200 font-semibold"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                size={20}
                                fill={activeSection === name ? "black" : "none"}
                                stroke={activeSection === name ? "black" : "currentColor"}
                                className="mr-2"
                            />
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Link>
                    ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                    {collectionOptions.map((collection) => (
                        <Link
                            key={collection}
                            href={`/${collection.toLowerCase()}`}
                            className={`block p-2 text-xs rounded-xl transition-colors opacity-80 ${activeSection === collection.toLowerCase()
                                    ? "bg-gray-200 font-semibold"
                                    : "hover:bg-gray-100 hover:opacity-100"
                                }`}
                        >
                            {collection}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};