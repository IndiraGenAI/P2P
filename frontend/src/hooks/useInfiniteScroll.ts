import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';

function useInfiniteScroll(setSkipLoad: Dispatch<SetStateAction<number>>, hasMoreData: boolean) {
  const [lastElementRef, setLastElementRef] = useState(null);
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMoreData) {
        setSkipLoad((prev) => prev + 1);
      }
    })
  );

  useEffect(() => {
    const currentElement = lastElementRef;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElementRef]);

  return {setLastElementRef};
}

export default useInfiniteScroll;
