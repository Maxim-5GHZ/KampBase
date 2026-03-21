import { Folder, File } from 'lucide-react';
import { SkillNode } from '../skill';

interface SkillListProps {
    nodes: SkillNode[];
    onNodeClick?: (nodeId: string) => void;
    selectedId?: string | null;
}

export const SkillList = ({ nodes, onNodeClick, selectedId }: SkillListProps) => {
    const tree = buildTree(nodes);

    const renderTree = (items: TreeNode[], level = 0) => {
        return items.map(node => (
        <li key={node.id} className="mb-1">
            <div
            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-base-200 ${
                selectedId === node.id ? 'bg-primary text-primary-content' : ''
            }`}
            style={{ marginLeft: `${level * 1.5}rem` }}
            onClick={() => onNodeClick?.(node.id)}
            >
            {node.children.length > 0 ? (
                <Folder className="w-4 h-4" />
            ) : (
                <File className="w-4 h-4" />
            )}
            <span className="text-sm">{node.name}</span>
            </div>
            {node.children.length > 0 && (
            <ul>{renderTree(node.children, level + 1)}</ul>
            )}
        </li>
        ));
    };

    return (
        <ul className="menu bg-base-100 rounded-box w-full">
        {renderTree(tree)}
        </ul>
    );
};

export type TreeNode = SkillNode & {
    children: TreeNode[];
};

export function buildTree(nodes: SkillNode[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    nodes.forEach(node => {
        map.set(node.id, { ...node, children: [] });
    });

    nodes.forEach(node => {
        const treeNode = map.get(node.id)!;
        if (node.parentIds.length === 0) {
        roots.push(treeNode);
        } else {
        node.parentIds.forEach(parentId => {
            const parent = map.get(parentId);
            if (parent) parent.children.push(treeNode);
        });
        }
    });

    return roots;
}