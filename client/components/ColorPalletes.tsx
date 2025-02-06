import React, { useEffect } from 'react';
import { formatDistanceToNow } from "date-fns";
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { likeColorPalette, fetchColorPaletteById } from '@/redux/slice/colorSlice';
import { useUser } from '@/hooks/useUser';
import { AppDispatch } from '@/redux/store';

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
    isLiked: initialIsLiked,
    createdAt
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const timeAgo = formatDistanceToNow(new Date(createdAt));
    const userToken = useUser();

    // Fetch initial like status when component mounts
    useEffect(() => {
        if (userToken) {
            dispatch(fetchColorPaletteById(id));
        }
    }, [dispatch, id, userToken]);

    const handleLike = async () => {
        if (userToken) {
            try {
                await dispatch(likeColorPalette({
                    paletteId: id,
                    userToken
                })).unwrap();
            } catch (error) {
                console.error('Failed to update like:', error);
            }
        }
    };

    return (
        <div className="w-full max-w-sm">
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
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 p-0 hover:bg-transparent"
                >
                    <Heart
                        size={16}
                        fill={initialIsLiked ? 'red' : 'none'}
                        color={initialIsLiked ? 'red' : 'currentColor'}
                        className="transition-colors duration-200"
                    />
                    <span className="text-sm">{likes}</span>
                </Button>
                <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
        </div>
    );
};

export default ColorPalette;