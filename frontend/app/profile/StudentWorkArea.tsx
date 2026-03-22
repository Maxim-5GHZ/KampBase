// File: ./frontend/app/profile/StudentWorkArea.tsx
"use client";

import { useState } from "react";
import { Node } from "./_tree/types";
import { SkillTree } from "./_tree/SkillTree";

interface WorkAreaProps {
  nodes: Node[];
  skillPoints?: number;
}

export default function WorkArea({ nodes, skillPoints = 0 }: WorkAreaProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
        Дерево навыков
      </h2>

      {/* Окно-иллюминатор для дерева (ограничиваем высоту, прячем края) */}
      <div className="w-full h-[65vh] min-h-[500px] rounded-3xl overflow-hidden border border-custom-secondary/20 bg-custom-bg-main relative shadow-inner">
        <SkillTree
          nodes={nodes}
          skillPoints={skillPoints}
          selectedId={selectedNode}
          onNodeClick={setSelectedNode}
        />
      </div>
      <p className="text-center text-custom-secondary text-sm mt-4">
        Удерживайте левую кнопку мыши для перемещения, крутите колёсико для
        изменения масштаба
      </p>
    </div>
  );
}
