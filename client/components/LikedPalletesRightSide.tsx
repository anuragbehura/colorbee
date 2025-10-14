import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import { queryClient } from "@/api/reactQueryClient";
import { useUser } from "@/hooks/useUser";
import { useColorMutation } from "@/hooks/useColorMutation";

interface LikedPalettesRightSideProps {
    id: string;
    colors: string[];
    // likes: number;
    // isLiked: boolean;
}

const LikedPalettesRightSide: React.FC<LikedPalettesRightSideProps> = ({
    id,
    colors,
    // likes,
    // isLiked,
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
    const liveLikes = cachedData?.likes;
    const liveIsLiked = cachedData?.isLiked;

    const handleLike = () => {
        if (!userToken) return;
        console.log("🎯 Toggling like for palette:", id);
        toggleLikePaletteMutation.mutate({ paletteId: id, userToken });
    };

    return (
        <div className="group relative w-[60px] aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform duration-200">
            <div className="flex flex-col h-full">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: color }}
                        className="flex-1"
                    />
                ))}
            </div>

            <Button
                onClick={handleLike}
                variant="ghost"
                className="
    absolute top-1 right-1
    opacity-0 group-hover:opacity-100
    transition-opacity duration-200 rounded-full
    p-1
    bg-white/80 hover:bg-white
    shadow
    flex items-center justify-center
    w-5 h-5
  "
            >
                <X className="h-4 w-4 text-gray-700" />
            </Button>
            {/* <div className="flex items-center justify-between px-1">
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
            </div> */}
        </div>
    );
};

export default LikedPalettesRightSide;