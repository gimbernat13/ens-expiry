'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LoadMoreButtonProps {
  currentPage: number;
}

export function LoadMoreButton({ currentPage }: LoadMoreButtonProps) {
  const router = useRouter();

  const handleLoadMore = () => {
    router.push(`/?page=${currentPage + 1}`);
  };

  return (
    <Button 
      onClick={handleLoadMore}
      className="w-full mt-4"
    >
      Load More
    </Button>
  );
} 