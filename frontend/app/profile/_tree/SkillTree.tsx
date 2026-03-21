import React from 'react';
import { SkillNode } from './skill';
import { RootNode } from './components/RootNode';
import { SkillNodeComponent } from './components/SkillNode';
import { TreeEdges } from './components/TreeEdges';

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
    const rootNode = nodes.find(node => node.parentIds.length === 0);
    const otherNodes = nodes.filter(node => node.parentIds.length > 0);

    const edges = nodes.flatMap(node =>
        node.parentIds.map(parentId => ({ from: parentId, to: node.id }))
    );

    const viewBoxWidth = 1000;
    const viewBoxHeight = 800;

    return (
        <div className="relative w-full -mt-40 mx-auto" style={{ paddingBottom: '80%' }}>
            <TreeEdges
                edges={edges}
                nodes={nodes}
                selectedId={selectedId}
                viewBoxWidth={viewBoxWidth}
                viewBoxHeight={viewBoxHeight}
            />
            <div className="absolute inset-0 w-full h-full">
                {rootNode && (
                    <RootNode
                        node={rootNode}
                        skillPoints={skillPoints}
                        isSelected={selectedId === rootNode.id}
                        onClick={() => onNodeClick?.(rootNode.id)}
                    />
                )}
                {otherNodes.map(node => (
                    <SkillNodeComponent
                        key={node.id}
                        node={node}
                        isSelected={selectedId === node.id}
                        onClick={() => onNodeClick?.(node.id)}
                    />
                ))}
            </div>
        </div>
    );
};