import React from 'react';
import { SkillNode } from '../skill';
import { getNodePosition } from '../utils/position';
import styles from "./edges.module.css";

interface TreeEdgesProps {
    edges: { from: string; to: string }[];
    nodes: SkillNode[];
    viewBoxWidth?: number;
    viewBoxHeight?: number;
    selectedId?: string | null;
}

export const TreeEdges: React.FC<TreeEdgesProps> = ({
    edges,
    nodes,
    viewBoxWidth = 1000,
    viewBoxHeight = 800,
    selectedId,
}) => {
    return (
        <svg
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
        >
            {edges.map(({ from, to }) => {
                const parent = nodes.find((n) => n.id === from);
                const child = nodes.find((n) => n.id === to);
                if (!parent || !child) return null;

                const parentPos = getNodePosition(parent);
                const childPos = getNodePosition(child);

                const x1 = parentPos.x * viewBoxWidth;
                const y1 = parentPos.y * viewBoxHeight;
                const x2 = childPos.x * viewBoxWidth;
                const y2 = childPos.y * viewBoxHeight;

                const isChildOpen = child.isOpen;
                const isHighlighted = selectedId && (selectedId === from || selectedId === to);
                const strokeColor = isHighlighted 
                    ? "stroke-primary" 
                    : isChildOpen 
                        ? "stroke-custom-main" 
                        : "stroke-custom-secondary";
                const strokeDash = isChildOpen ? "" : styles["stroke-dasharray-4"];

                return (
                    <line
                        key={`${from}-${to}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className={`${strokeColor} stroke-2 ${strokeDash}`}
                    />
                );
            })}
        </svg>
    );
};