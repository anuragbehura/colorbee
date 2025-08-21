"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "./reactQueryClient";

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        {children}
    </QueryClientProvider>
)};
