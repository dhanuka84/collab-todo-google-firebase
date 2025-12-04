import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = "sm" }) => {
  const initialSource = (name || "?").trim();
  const initial = initialSource ? initialSource.charAt(0).toUpperCase() : "?";
  const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

  const palette = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200"
  ];
  const index = initial.charCodeAt(0) % palette.length;
  const colorClass = palette[index];

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-medium text-slate-800 border border-white shadow-sm`}
      title={name}
    >
      {initial}
    </div>
  );
};
