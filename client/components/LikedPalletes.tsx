import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { queryClient } from "@/api/reactQueryClient";
import { useUser } from "@/hooks/useUser";
import { useColorMutation } from "@/hooks/useColorMutation";

interface LikedPalettesProps {
    id: string;
    colors: string[];
    likes: number;
    isLiked: boolean;
}

const LikedPalettes: React.FC<LikedPalettesProps> = ({
    id,
    colors,
    likes,
    isLiked,
}) => {
    const { toggleLikePaletteMutation } = useColorMutation();
    const userToken = useUser();

    // Always read latest from cache if available
    const cachedData: any = queryClient
        .getQueryData<any>(["likedPalletes", userToken])
        ?.palettes.find((p: any) => {
            const paletteId = p.id || p._id;
            return paletteId?.toString() === id?.toString();
        });

    // Use cached values if available, otherwise fallback to props
    const liveLikes = cachedData?.likes ?? likes;
    const liveIsLiked = cachedData?.isLiked ?? isLiked;

    const handleLike = () => {
        if (!userToken) return;
        console.log("🎯 Toggling like for palette:", id);
        toggleLikePaletteMutation.mutate({ paletteId: id, userToken });
    };

    return (
        <div className="w-[200px] max-w-sm">
            <div className="aspect-square rounded-lg overflow-hidden mb-2 flex flex-col">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: color }}
                        className="flex-1 relative cursor-pointer group"
                    />
                ))}
            </div>
            <div className="flex items-center justify-between px-1">
                <Button
                    onClick={handleLike}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 p-0 hover:bg-transparent px-4 rounded-lg"
                    disabled={toggleLikePaletteMutation.isPending}
                >
                    <Heart
                        size={22}
                        className={`transition-colors duration-200 ${liveIsLiked
                                ? "fill-black text-black"
                                : "text-gray-500"
                            }`}
                    />
                    <span className="text-sm">{liveLikes}</span>
                </Button>
            </div>
        </div>
    );
};

export default LikedPalettes;