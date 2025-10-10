import { useMutation, useQueryClient } from "@tanstack/react-query";
import { colorApi } from "@/api/colorApi";
import { useToast } from "@/hooks/use-toast";

export const useColorMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Add color palettes mutation
    const addColorMutation = useMutation({
        mutationFn: colorApi.addColor,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Palette added successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["colorPalletes"] });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add Palette",
            });
        },
    });

    // Like & unlike palette
    const toggleLikePaletteMutation = useMutation({
        mutationFn: ({ paletteId, userToken }: { paletteId: string; userToken: string }) =>
            colorApi.likeColorPalette({ id: paletteId, userToken }),

        onMutate: async ({ paletteId, userToken }) => {
            await queryClient.cancelQueries({ queryKey: ["colorPalletes", userToken] });
            await queryClient.cancelQueries({ queryKey: ["likedPalletes", userToken] });

            const prevData = queryClient.getQueryData<any>(["colorPalletes", userToken]);
            const prevLiked = queryClient.getQueryData<any>(["likedPalletes", userToken]);

            queryClient.setQueryData<any>(["colorPalletes", userToken], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        palettes: page.palettes.map((p: any) =>
                            p.id === paletteId
                                ? {
                                    ...p,
                                    likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                                    isLiked: !p.isLiked,
                                }
                                : p
                        ),
                    })),
                };
            });

            // Optimistically update linked palettes
            queryClient.setQueryData<any>(["likedPalletes", userToken], (old: any)=> {
                if (!old) return old;
                const palette = prevData?.pages.flatMap((page: any) => page.palettes)
                .find((p: any) => p.id === paletteId);

                if(!palette) return old;

                if(palette.isLiked) {
                    // If unlinking remove from liked
                    return {
                        ...old,
                        palettes: old.palettes.filter((p: any) => p.id !== paletteId),
                    };
                } else {
                    // If liking, add to liked
                    return {
                        ...old,
                        palettes: [...old.palettes, { ...palette, isLiked: true, likes: palette.likes + 1 }],
                    };
                }
            })

            return { prevData, prevLiked, userToken };
        },

        onError: (_err, { userToken }, ctx) => {
            if (ctx) {
                queryClient.setQueryData(["colorPalletes", userToken], ctx.prevData);
                queryClient.setQueryData(["likedPalletes", userToken], ctx.prevLiked);
            }
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update like status",
            });
        },

        onSuccess: (data, { paletteId, userToken }) => {
            queryClient.setQueryData<any>(["colorPalletes", userToken], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        palettes: page.palettes.map((p: any) =>
                            p.id === paletteId
                                ? { ...p, likes: data.likes, isLiked: data.isLiked }
                                : p
                        ),
                    })),
                };
            });

            queryClient.invalidateQueries({ queryKey: ["likedPalletes", userToken] });
        },
    });


    return {
        addColorMutation,
        toggleLikePaletteMutation
    };
};
