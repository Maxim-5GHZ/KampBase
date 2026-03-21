import { Node } from '../types';

export const getNodePosition = (node: Node) => {
    if (node.id === 'root') {
        return { x: 0.5, y: 0.5 };
    }
    const x = 0.5 + node.distance * Math.cos(node.angle);
    const y = 0.5 + node.distance * Math.sin(node.angle);
    
    return {
        x: Math.min(1, Math.max(0, x)),
        y: Math.min(1, Math.max(0, y)),
    };
};