import React from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface PaletteProps {
    colors: string[];
    likes: number;
    timeAgo: string;
}

const ColorPalettes: React.FC<PaletteProps> = ({ colors, likes, timeAgo }) => {
    return (
        <div className="max-w-[190px] mx-auto">
            {/* Color Palette */}
            <div className="w-full h-[180px] rounded-2xl overflow-hidden shadow-md border">
                {colors.map((color, index) => (
                    <div key={index} className="h-[45px]" style={{ backgroundColor: color }} />
                ))}
            </div>

            {/* Like & Time */}
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <Button variant={"ghost"} className="flex items-center space-x-1">
                    <Heart size={16} className="text-gray-500 cursor-pointer" />
                    <span>{likes}</span>
                </Button>
                <span>{timeAgo}</span>
            </div>
        </div>
    );
};

export default ColorPalettes;
