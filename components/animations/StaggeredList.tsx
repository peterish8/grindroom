import React from "react";
import { FadeIn } from "./FadeIn";

interface StaggeredListProps {
  children: React.ReactNode;
  baseDelay?: number;
  staggerMs?: number;
}

export function StaggeredList({
  children,
  baseDelay = 0,
  staggerMs = 60,
}: StaggeredListProps) {
  const items = React.Children.toArray(children);
  return (
    <>
      {items.map((child, index) => (
        <FadeIn key={index} delay={baseDelay + index * staggerMs}>
          {child}
        </FadeIn>
      ))}
    </>
  );
}
