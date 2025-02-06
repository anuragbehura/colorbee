"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchColorPalettes, likeColorPalette } from "@/redux/slice/colorSlice"
import ColorPalletes from "@/components/ColorPalletes";
import { AppDispatch, RootState } from "@/redux/store"
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const userToken = useUser();

  // Get palettes from the redux store
  const { palettes = [], loading, error, totalPages } = useSelector((state: RootState) => state.colorPalettes);

  // State for tracking pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const hasMore = page < totalPages;

  // Update useEffect to use page and limit variables
  useEffect(() => {
    if (userToken) {
      dispatch(fetchColorPalettes({
        page,
        limit,
        userToken
      }));
    }
  }, [dispatch, page, limit, userToken]);

  // Observer to detect when user reaches the bottom
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPaletteRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  if (!Array.isArray(palettes)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {palettes.map((palette, index) => (
        <div
          key={palette.id}
          ref={index === palettes.length - 1 ? lastPaletteRef : null}
          className="flex flex-col items-center"
        >
          <ColorPalletes
            id={palette.id}
            colors={palette.colors}
            likes={palette.likes}
            createdAt={palette.createdAt}
            isLiked={palette.isLiked}
          />
        </div>
      ))}
      {loading && <div>Loading more...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}