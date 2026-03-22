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
    <div className="p-4">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
        Дерево навыков
      </h2>

      {/* Контейнер с горизонтальным скроллом для мобильных устройств */}
      <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
        {/* Ограничиваем минимальную ширину, чтобы узлы не наезжали друг на друга */}
        <div className="min-w-[800px]">
          <SkillTree
            nodes={nodes}
            skillPoints={skillPoints}
            selectedId={selectedNode}
            onNodeClick={setSelectedNode}
          />
        </div>
      </div>
    </div>
  );
}
