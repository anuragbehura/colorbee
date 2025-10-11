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

            // Optimistically update liked palettes
            queryClient.setQueryData<any>(["likedPalletes", userToken], (old: any) => {
                if (!old) return old;

                // Check if palette is currently in liked collection
                const likedPalette = old.palettes.find((p: any) =>
                    p.id === paletteId || p._id === paletteId || p.id?.toString() === paletteId
                );

                if (likedPalette) {
                    // Currently liked - unliking, so remove from collection
                    return {
                        ...old,
                        palettes: old.palettes.filter((p: any) => {
                            const pId = p.id || p._id;
                            return pId?.toString() !== paletteId.toString();
                        }),
                    };
                } else {
                    // Not liked - liking, so add to collection
                    const palette = prevData?.pages?.flatMap((page: any) => page.palettes)
                        .find((p: any) => p.id === paletteId);

                    if (!palette) return old;

                    return {
                        ...old,
                        palettes: [
                            ...old.palettes,
                            {
                                ...palette,
                                isLiked: true,
                                likes: palette.likes + 1
                            }
                        ],
                    };
                }
            });

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
            console.log("✅ Like toggle success:", data);

            // Update colorPalletes with server response
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

            // Update liked palettes cache based on server response
            queryClient.setQueryData<any>(["likedPalletes", userToken], (old: any) => {
                if (!old) return old;

                if (data.isLiked) {
                    // Palette is now liked - ensure it's in the collection
                    const paletteExists = old.palettes.some((p: any) => {
                        const pId = p.id || p._id;
                        return pId?.toString() === paletteId.toString();
                    });

                    if (!paletteExists) {
                        // Get palette from main cache to add to liked
                        const allPalettes = queryClient.getQueryData<any>(["colorPalletes", userToken]);
                        const palette = allPalettes?.pages?.flatMap((page: any) => page.palettes)
                            .find((p: any) => p.id === paletteId);

                        if (palette) {
                            return {
                                ...old,
                                palettes: [
                                    ...old.palettes,
                                    { ...palette, isLiked: true, likes: data.likes }
                                ]
                            };
                        }
                    } else {
                        // Update existing palette in liked collection
                        return {
                            ...old,
                            palettes: old.palettes.map((p: any) => {
                                const pId = p.id || p._id;
                                return pId?.toString() === paletteId.toString()
                                    ? { ...p, isLiked: true, likes: data.likes }
                                    : p;
                            })
                        };
                    }
                } else {
                    // Palette is now unliked - remove from collection
                    console.log("🗑️ Removing palette from liked collection");
                    return {
                        ...old,
                        palettes: old.palettes.filter((p: any) => {
                            const pId = p.id || p._id;
                            return pId?.toString() !== paletteId.toString();
                        })
                    };
                }

                return old;
            });

            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["likedPalletes", userToken] });
        },
    });


    return {
        addColorMutation,
        toggleLikePaletteMutation
    };
};
