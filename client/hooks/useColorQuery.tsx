import { useQuery, useInfiniteQuery, } from "@tanstack/react-query";
import { colorApi } from "@/api/colorApi";  

export const useColorQuery = () => {
    // Fetch all color palettes
    const useColorPalletes = (userToken?: string | null) => {
        return useInfiniteQuery({
            queryKey: ["colorPalletes", userToken],
            queryFn: ({ pageParam = 1 }) => 
                colorApi.getAllColorPalletes({
                    page: pageParam,
                    userToken: userToken || undefined
                }),
            getNextPageParam: (lastPage: any) =>
                lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
            initialPageParam: 1,
            enabled: !!userToken, // only fetch when userToken is available
        });
    };

    const useColorPalletesById = (id:string) => {
        return useQuery({
            queryKey: ["colorPallete", id],
            queryFn: () => colorApi.getColorPaletteById(id),
            enabled: !!id // Only run query of id is provided
        });
    };

    return {
        useColorPalletes,
        useColorPalletesById,
    }
};