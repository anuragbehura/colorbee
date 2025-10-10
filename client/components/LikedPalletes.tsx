
interface LikedPalettesProps {
    id: string;
    colors: string[];
    likes: number;
    isLiked: boolean;
    createdAt: string;
}

const LikedPalettes: React.FC<LikedPalettesProps> = ({
    id,
    colors,
    likes,
    isLiked,
    createdAt,
}) => {
    return (
        <div className="w-[200px] max-w-sm">
            <div className="aspect-square rounded-lg overflow-hidden mb-2 flex flex-col">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: color }}
                        className="flex-1 relative cursor-pointer group"
                    // onClick={() => handleCopy(color, index)}
                    >
                        {/* Overlay hex code on hover */}
                        {/* <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white font-mono text-xs">
                        {copiedIndex === index ? "Copied!" : color}
                    </span> */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LikedPalettes;

