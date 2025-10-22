"use client";
import React, { Suspense, useEffect } from "react";
// import ColorPalletes from "@/components/ColorPalletes";
// import { useUser } from "@/hooks/useUser";
// import { Loader2, AlertCircle } from "lucide-react";
// import { useInView } from "react-intersection-observer"
// import { useColorQuery } from "@/hooks/useColorQuery";
// import { useToast } from "@/hooks/use-toast";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import HomeContent from "@/components/HomeContent";

// export default function Home() {
//   const userToken = useUser();
//   const {ref, inView} = useInView();
//   const { toast } = useToast();
  
//   const {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isLoading,
//   } = useColorQuery().useColorPalletes(userToken);

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

//   useEffect(() => {
//     if(error) {
//       toast({
//         title: "Error",
//         description: "Failed to load Color Palletes"
//       });
//     }
//   }, [error, toast]);

//   const allColorPalletes = data?.pages.flatMap((page: any) => page.palettes) || [];
  


//   if (isLoading || !userToken) {
//     return <SkeletonGrid />
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen text-red-500">
//         <AlertCircle className="w-12 h-12" />
//         <p className="mt-2 text-lg font-semibold">Something went wrong!</p>
//         <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//       {allColorPalletes.map((palette, index) => (
//         <div
//           key={palette.id}
          
//           ref={index === allColorPalletes.length - 1 ? ref : null}
//           className="flex flex-col items-center"
//         >
//           <ColorPalletes
//             id={palette.id}
//             colors={palette.colors}
//             likes={palette.likes}
//             createdAt={palette.createdAt}
//             isLiked={palette.isLiked}
//           />
//         </div>
//       ))}
//       {isFetchingNextPage && (
//         <div className="flex justify-center items-center col-span-full">
//           <Loader2 className="animate-spin text-gray-900 w-8 h-8" />
//         </div>
//       )}
//     </div>
//   );
// }

export default function Home() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <HomeContent />
    </Suspense>
  )
}
