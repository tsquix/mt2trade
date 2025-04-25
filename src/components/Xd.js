import { useRef } from 'react';

export default function Xd({ useIntersectionObserver, addVisible, visible }) {
  const ref = useRef();
  const isVisible = useIntersectionObserver(ref);

  return <div ref={ref}>{isVisible ? addVisible() : 'Niewidoczny!'}</div>;
}
