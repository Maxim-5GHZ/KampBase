// File: ./frontend/app/profile/_tree/SkillTree.tsx
import React, { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, LocateFixed } from "lucide-react";
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

  // --- Состояние Зума и Перетаскивания ---
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Центрируем камеру при загрузке
  const centerMap = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft = (viewBoxWidth * scale - container.clientWidth) / 2;
      container.scrollTop =
        (viewBoxHeight * scale - container.clientHeight) / 2;
    }
  };

  useEffect(() => {
    centerMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Логика Drag-to-Scroll (переработанная для независимости от масштаба) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const walkX = e.clientX - startX;
    const walkY = e.clientY - startY;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  // --- Логика масштабирования (Зум колёсиком мыши) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Масштабируем при зажатом Ctrl/Cmd ИЛИ если просто крутят колесико
      e.preventDefault();

      const zoomSensitivity = 0.002;
      const delta = -e.deltaY * zoomSensitivity;

      setScale((prevScale) => {
        const newScale = Math.min(Math.max(0.3, prevScale + delta), 3);
        if (newScale === prevScale) return prevScale;

        // Логика смещения скролла, чтобы зумировать ровно в ту точку, где курсор
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const currentScrollX = container.scrollLeft;
        const currentScrollY = container.scrollTop;

        // Координаты мыши на реальном "холсте"
        const contentX = (currentScrollX + mouseX) / prevScale;
        const contentY = (currentScrollY + mouseY) / prevScale;

        // Новые координаты скролла
        const newScrollX = contentX * newScale - mouseX;
        const newScrollY = contentY * newScale - mouseY;

        requestAnimationFrame(() => {
          container.scrollLeft = newScrollX;
          container.scrollTop = newScrollY;
        });

        return newScale;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Кнопки управления масштабом
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.3));
  const handleResetZoom = () => {
    setScale(1);
    setTimeout(centerMap, 0); // Центрируем после обновления стейта
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-custom-bg-main">
      {/* Кнопки управления зумом */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="btn btn-circle btn-sm bg-custom-bg-secondary border-custom-secondary/20 shadow-md text-custom-main hover:bg-custom-accent hover:text-white transition-colors"
          title="Приблизить"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleResetZoom}
          className="btn btn-circle btn-sm bg-custom-bg-secondary border-custom-secondary/20 shadow-md text-custom-main hover:bg-custom-accent hover:text-white transition-colors"
          title="Сбросить масштаб"
        >
          <LocateFixed size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="btn btn-circle btn-sm bg-custom-bg-secondary border-custom-secondary/20 shadow-md text-custom-main hover:bg-custom-accent hover:text-white transition-colors"
          title="Отдалить"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {/* Окно просмотра */}
      <div
        ref={containerRef}
        className={`w-full h-full overflow-auto select-none scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Контейнер, который задает физический размер полос прокрутки */}
        <div
          style={{
            width: viewBoxWidth * scale,
            height: viewBoxHeight * scale,
            position: "relative",
          }}
        >
          {/* Фактический отрендеренный холст, масштабированный через CSS */}
          <div
            className="absolute top-0 left-0 shrink-0 pointer-events-none"
            style={{
              width: viewBoxWidth,
              height: viewBoxHeight,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Линии */}
            <div className="absolute inset-0 z-0">
              <TreeEdges
                edges={edges}
                nodes={nodes}
                selectedId={selectedId}
                viewBoxWidth={viewBoxWidth}
                viewBoxHeight={viewBoxHeight}
              />
            </div>

            {/* Узлы (по ним можно кликать) */}
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
      </div>
    </div>
  );
};
