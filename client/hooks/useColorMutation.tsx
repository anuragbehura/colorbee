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

        onMutate: async ({ paletteId }) => {
            await queryClient.cancelQueries({ queryKey: ["colorPalletes"] });

            const prevData = queryClient.getQueryData<any>(["colorPalletes"]);

            queryClient.setQueryData<any>(["colorPalletes"], (old: any) => {
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

            return { prevData };
        },

        onError: (_err, _vars, ctx) => {
            // Rollback to previous state
            queryClient.setQueryData(["colorPalletes"], ctx?.prevData);
        },

        onSuccess: (data, { paletteId }) => {
            // ✅ Merge server response with cache, no invalidate (no flicker)
            queryClient.setQueryData<any>(["colorPalletes"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        palettes: page.palettes.map((p: any) =>
                            p.id === paletteId ? { ...p, ...data } : p
                        ),
                    })),
                };
            });
        },
    });


    return {
        addColorMutation,
        toggleLikePaletteMutation
    };
};
