// Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import SearchBar from "./Searchbar";
import { Ellipsis, Plus } from "lucide-react";

export const Navbar = () => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200);
    };

    return (
        <div className="h-16 px-4 border-b flex items-center bg-white">
            <nav className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
                <Logo />

                {/* Adjusted SearchBar container */}
                <div className="flex-1 max-w-2xl ml-6">
                    <SearchBar />
                </div>

                {/* Right-side links */}
                <div className="flex items-center justify-between w-[300px] gap-4 ml-4">
                    <Link
                        href={"/add"}
                        className="flex items-center justify-center hover:bg-gray-50 border p-2 w-24 rounded-full text-base"
                    >
                        <Plus size={16} className="mt-0.5" />
                        <span>create</span>
                    </Link>
                    <div
                        tabIndex={0}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="bg-gray-50 hover:bg-gray-100 p-1 rounded-full cursor-pointer relative"
                    >
                        <Ellipsis size={28} />
                        {isFocused && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-50 w-48">
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full rounded-t-lg">
                                    Palettes
                                </button>
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full">
                                    Create
                                </button>
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full border-b">
                                    Collection
                                </button>
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full">
                                    About
                                </button>
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full border-b">
                                    Github
                                </button>
                                <button className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full opacity-50 rounded-b-lg">
                                    Anurag Behura
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};