import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { useColorMutation } from "@/hooks/useColorMutation";
import { useQueryClient } from "@tanstack/react-query";

interface ColorPaletteProps {
    id: string;
    colors: string[];
    likes: number;
    isLiked: boolean;
    createdAt: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
    id,
    colors,
    likes,
    isLiked,
    createdAt,
}) => {
    const timeAgo = formatDistanceToNow(new Date(createdAt));
    const userToken = useUser();
    const { toggleLikePaletteMutation } = useColorMutation();
    const queryClient = useQueryClient();

    // For showing "copied" feedback
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // ✅ Always read latest from cache if available
    const cachedData: any = queryClient
        .getQueryData<any>(["colorPalletes"])
        ?.pages.flatMap((page: any) => page.palettes)
        .find((p: any) => p.id === id);

    const liveLikes = cachedData?.likes ?? likes;
    const liveIsLiked = cachedData?.isLiked ?? isLiked;

    const handleLike = () => {
        if (!userToken) return;
        toggleLikePaletteMutation.mutate({ paletteId: id, userToken });
    };

    const handleCopy = async (color: string, index: number) => {
        try {
            await navigator.clipboard.writeText(color);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1000); // Reset after 1s
        } catch (error) {
            console.log("Error while copying", error)
        }
    }

    return (
        <div className="w-[200px] max-w-sm">
            {/* Color display */}
            <div className="aspect-square rounded-lg overflow-hidden mb-2 flex flex-col">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: color }}
                        className="flex-1 relative cursor-pointer group"
                        onClick={() => handleCopy(color, index)}
                    >
                        {/* Overlay hex code on hover */}
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white font-mono text-xs">
                            {copiedIndex === index ? "Copied!" : color}
                        </span>
                    </div>
                ))}
            </div>

            {/* Interaction footer */}
            <div className="flex items-center justify-between px-1">
                <Button
                    onClick={handleLike}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 p-0 hover:bg-transparent px-4 rounded-lg"
                >
                    <Heart
                        size={22}
                        className={`transition-colors duration-200 ${liveIsLiked ? "fill-black text-black" : "text-gray-500"
                            }`}
                    />
                    <span className="text-sm">{liveLikes}</span>
                </Button>
                <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
        </div>
    );
};

export default ColorPalette;
