// File: ./frontend/app/profile/_tree/components/SkillNode.tsx
import React from "react";
import { SkillNode } from "../skill";
import { getNodePosition } from "../utils/position";

interface SkillNodeProps {
  node: SkillNode;
  onClick: (id: string) => void;
  isSelected?: boolean;
}

export const SkillNodeComponent: React.FC<SkillNodeProps> = ({
  node,
  onClick,
  isSelected,
}) => {
  const isOpen = node.isOpen;
  const { x, y } = getNodePosition(node);

  const squareClasses = `
        w-16 h-16
        sm:w-14 sm:h-14
        flex items-center justify-center 
        font-bold rounded-lg 
        bg-custom-secondary 
        cursor-pointer 
        transition-all z-10
        active:scale-95
        ${
          isOpen
            ? "border-2 border-custom-accent text-custom-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "border-2 border-transparent text-custom-bg-main shadow-sm"
        } 
        ${isSelected ? "ring-2 ring-white scale-110" : ""}
    `;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-2 rounded-lg group z-10 hover:z-50"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <div
        className={`${squareClasses} ${isOpen ? "hover:text-custom-main" : ""}`}
        onClick={() => onClick(node.id)}
      >
        {node.short}
      </div>

      {/* Название навыка */}
      <span
        className={`
                text-sm sm:text-base font-bold mt-2 text-center whitespace-nowrap bg-custom-bg-main/80 px-2 py-0.5 rounded-md backdrop-blur-sm
                ${isOpen ? "text-custom-main" : "text-custom-secondary"}
            `}
      >
        {node.name}
      </span>

      {/* ДОБАВЛЕНО: Описание теперь во всплывающем окне (Tooltip) при наведении */}
      <div className="absolute top-full mt-1 w-56 p-3 bg-custom-bg-secondary border border-custom-secondary/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-center">
        <span className="text-sm text-custom-secondary font-medium">
          {node.description}
        </span>
      </div>
    </div>
  );
};
