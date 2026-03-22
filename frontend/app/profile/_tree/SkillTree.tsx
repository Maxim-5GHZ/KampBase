// File: ./frontend/app/profile/_tree/SkillTree.tsx
import React, { useRef, useState, useEffect } from "react";
import { SkillNode } from "./skill";
import { RootNode } from "./components/RootNode";
import { SkillNodeComponent } from "./components/SkillNode";
import { TreeEdges } from "./components/TreeEdges";

interface SkillTreeProps {
  nodes: SkillNode[];
  selectedId?: string | null;
  onNodeClick?: (id: string) => void;
  skillPoints?: number;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  nodes,
  selectedId,
  onNodeClick,
  skillPoints = 0,
}) => {
  const rootNode = nodes.find((node) => node.parentIds.length === 0);
  const otherNodes = nodes.filter((node) => node.parentIds.length > 0);

  const edges = nodes.flatMap((node) =>
    node.parentIds.map((parentId) => ({ from: parentId, to: node.id })),
  );

  const viewBoxWidth = 1400;
  const viewBoxHeight = 1400;

  // --- Логика Drag-to-Scroll (Перетаскивание мышкой) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Центрируем камеру на середине карты при первой загрузке
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft =
        (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop =
        (container.scrollHeight - container.clientHeight) / 2;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault(); // Предотвращаем выделение текста при перетаскивании
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  return (
    // Внешний контейнер, который обрезает края и обрабатывает мышь/скролл
    <div
      ref={containerRef}
      className={`w-full h-full overflow-auto select-none scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Огромный внутренний холст, по которому мы ползаем */}
      <div className="relative mx-auto w-[1400px] h-[1400px] shrink-0 pointer-events-none">
        {/* Линии. Pointer-events-none чтобы не мешали кликам */}
        <div className="absolute inset-0 z-0">
          <TreeEdges
            edges={edges}
            nodes={nodes}
            selectedId={selectedId}
            viewBoxWidth={viewBoxWidth}
            viewBoxHeight={viewBoxHeight}
          />
        </div>

        {/* Узлы. Включаем pointer-events-auto, чтобы по ним можно было кликать и наводить мышку */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {rootNode && (
            <RootNode
              node={rootNode}
              skillPoints={skillPoints}
              isSelected={selectedId === rootNode.id}
              onClick={() => onNodeClick?.(rootNode.id)}
            />
          )}
          {otherNodes.map((node) => (
            <SkillNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              onClick={() => onNodeClick?.(node.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
