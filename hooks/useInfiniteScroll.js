import { useEffect } from 'react';

export const useInfiniteScroll = (
  ref,
  currentCount,
  totalCount,
  onLoadMore
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && currentCount < totalCount) {
          onLoadMore();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, currentCount, totalCount, onLoadMore]);
};
