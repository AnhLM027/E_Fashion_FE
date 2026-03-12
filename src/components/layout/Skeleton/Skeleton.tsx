import React from "react";
import "./Skeleton.css";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  variant = "rectangular",
  count = 1,
  className = "",
}) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  const variantClass = `skeleton--${variant}`;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${variantClass} ${className}`.trim()}
          style={style}
          role="status"
          aria-busy="true"
          aria-label="Loading..."
        />
      ))}
    </>
  );
};
