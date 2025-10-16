import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

const colorOptions = [
    { name: "Blue", color: "#2196F3" },
    { name: "Teal", color: "#00BCD4" },
    { name: "Mint", color: "#AEEEEE" },
    { name: "Green", color: "#4CAF50" },
    { name: "Sage", color: "#B2AC88" },
    { name: "Yellow", color: "#FFEB3B" },
    { name: "Beige", color: "#F5F5DC" },
    { name: "Brown", color: "#795548" },
    { name: "Orange", color: "#FF9800" },
    { name: "Peach", color: "#FFDAB9" },
    { name: "Red", color: "#F44336" },
    { name: "Maroon", color: "#800000" },
    { name: "Pink", color: "#FF69B4" },
    { name: "Purple", color: "#9C27B0" },
    { name: "Navy", color: "#001F3F" },
    { name: "Black", color: "#222" },
    { name: "Grey", color: "#BDBDBD" },
    { name: "White", color: "#fff" },
];

const collectionOptions = [
    "Pastel", "Vintage", "Retro", "Neon", "Gold", "Light", "Dark", "Warm",
    "Cold", "Summer", "Fall", "Winter", "Spring", "Happy", "Nature", "Earth",
    "Night", "Space", "Rainbow", "Gradient", "Sunset", "Sky", "Sea", "Kids",
    "Skin", "Food", "Cream", "Coffee", "Wedding", "Christmas", "Halloween"
];

interface TagBarProps {
    tags: { type: "color" | "collection"; value: string }[];
    setTags: React.Dispatch<React.SetStateAction<{ type: "color" | "collection"; value: string }[]>>;
}

const TagBar = ({ tags, setTags }: TagBarProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setTimeout(() => setIsFocused(false), 200);

    const handleTagRemove = (idx: number) => {
        setTags(tags.filter((_, i) => i !== idx));
    };

    const handleTagAdd = (type: "color" | "collection", value: string) => {
        if (!tags.some(tag => tag.value === value)) {
            setTags([...tags, { type, value }]);
            setQuery("");
            inputRef.current?.focus();
        }
    };

    return (
        <div className="relative w-full">
            {/* Search bar style */}
            <div className="flex flex-wrap items-center gap-2 py-2 pl-4 pr-2 bg-white rounded-full border border-gray-200 shadow-sm min-h-[48px] transition focus-within:border-blue-400">
                <Search className="text-gray-400 mr-2" size={20} />
                {tags.map((tag, idx) => (
                    <span
                        key={tag.value}
                        className={`flex items-center px-3 py-1 rounded-full mr-1 text-sm font-medium
                            ${tag.type === "color" ? "bg-blue-50" : "bg-gray-100"}
                        `}
                    >
                        {tag.type === "color" && (
                            <span
                                className="inline-block w-3 h-3 rounded-full mr-2"
                                style={{ background: colorOptions.find(c => c.name === tag.value)?.color || "#ccc" }}
                            />
                        )}
                        {tag.value}
                        <button
                            className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                            onClick={() => handleTagRemove(idx)}
                            tabIndex={-1}
                            type="button"
                        >
                            <X size={14} className="text-gray-400 hover:text-gray-700" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={tags.length === 0 ? "Add tags" : ""}
                    className="flex-1 min-w-[120px] h-8 border-none outline-none bg-transparent text-gray-700"
                />
            </div>

            {/* Dropdown Content */}
            {isFocused && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions
                                .filter(c => !tags.some(tag => tag.value === c.name))
                                .map((color) => (
                                    <button
                                        key={color.name}
                                        className="flex items-center px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={() => handleTagAdd("color", color.name)}
                                    >
                                        <span
                                            className="inline-block w-3 h-3 rounded-full mr-2"
                                            style={{ background: color.color }}
                                        />
                                        {color.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Collections</h3>
                        <div className="flex flex-wrap gap-2">
                            {collectionOptions
                                .filter(c => !tags.some(tag => tag.value === c))
                                .map((collection) => (
                                    <button
                                        key={collection}
                                        className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={() => handleTagAdd("collection", collection)}
                                    >
                                        {collection}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagBar;