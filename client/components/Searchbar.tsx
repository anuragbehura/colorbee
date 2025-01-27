import { useState } from "react";
import { Search } from "lucide-react"; // Import the search icon from lucide-react

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        // Delay hiding dropdown to allow click on options
        setTimeout(() => setIsFocused(false), 200);
    };

    const colorOptions = [
        "Blue", "Teal", "Mint", "Green", "Sage", "Yellow", "Beige",
        "Brown", "Orange", "Peach", "Red", "Maroon", "Pink", "Purple",
        "Navy", "Black", "Grey", "White"
    ];
    const collectionOptions = [
        "Pastel", "Vintage", "Retro", "Neon", "Gold", "Light", "Dark", "Warm",
        "Cold", "Summer", "Fall", "Winter", "Spring", "Happy", "Nature", "Earth",
        "Night", "Space", "Rainbow", "Gradient", "Sunset", "Sky", "Sea", "Kids",
        "Skin", "Food", "Cream", "Coffee", "Wedding", "Christmas", "Halloween"
    ];

    return (
        <div className="relative w-full">
            {/* Search Input Container */}
            <div className="relative flex items-center">
                {/* Search Icon */}
                <Search className="absolute left-3 text-gray-950" size={20} />

                {/* Search Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search palettes"
                    className="w-full h-9 pl-10 rounded-full border hover:border-gray-300 border-gray-200 focus:outline-none"
                />
            </div>

            {/* Dropdown Content */}
            {isFocused && (
                <div className="absolute top-full mt-3.5 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    {/* Colors Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map((color, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
                                    onClick={() => setQuery(color)}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Collections Section */}
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Collections</h3>
                        <div className="flex flex-wrap gap-2">
                            {collectionOptions.map((collection, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
                                    onClick={() => setQuery(collection)}
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

export default SearchBar;
