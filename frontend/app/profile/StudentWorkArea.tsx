'use client';

import { useState } from 'react';
import { Node } from './_tree/types';
import { SkillTree } from './_tree/SkillTree';
import { SkillList } from './_tree/components/SkillList';

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

            <div className="hidden xl:block">
                <SkillTree
                    nodes={nodes}
                    skillPoints={skillPoints}
                    selectedId={selectedNode}
                    onNodeClick={setSelectedNode}
                />
            </div>

            <div className="block xl:hidden">
                <SkillList
                    nodes={nodes}
                    selectedId={selectedNode}
                    onNodeClick={setSelectedNode}
                />
            </div>
        </div>
    );
}