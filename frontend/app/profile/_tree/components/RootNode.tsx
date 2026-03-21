import React from 'react';
import { SkillNode } from '../skill';
import { getNodePosition } from '../utils/position';

interface RootNodeProps {
    node: SkillNode;
    skillPoints: number;
    isSelected?: boolean;
    onClick?: () => void;
}

export const RootNode: React.FC<RootNodeProps> = ({ node, skillPoints, isSelected, onClick }) => {
    const { x, y } = getNodePosition(node);
    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        >
            <div
                className={`w-36 h-36 rounded-full bg-custom-accent flex items-center justify-center shadow-[0_0_20px_2px_rgba(59,130,246,0.5)] transition-all ${
                    isSelected ? 'ring-4 ring-white scale-110' : ''
                }`}
                onClick={onClick}
            >
                <span className="text-custom-main font-bold text-center">
                    <span className='text-5xl'>{skillPoints}</span> <br />
                    очков навыков
                </span>
            </div>
        </div>
    );
};