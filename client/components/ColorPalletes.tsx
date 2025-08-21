import React from "react";
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

    // ✅ Get latest state from cache
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

    return (
        <div className="w-[250px] max-w-sm">
            {/* Color display */}
            <div className="aspect-square rounded-lg overflow-hidden mb-2">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: color }}
                        className="w-full h-1/4"
                    />
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
                        fill={liveIsLiked ? "black" : "none"}
                        color={liveIsLiked ? "black" : "currentColor"}
                        className="transition-colors duration-200"
                    />
                    <span className="text-sm">{liveLikes}</span>
                </Button>
                <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
        </div>
    );
};

export default ColorPalette;
