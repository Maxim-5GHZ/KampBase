import React from 'react';
import { SkillNode } from '../skill';
import { getNodePosition } from '../utils/position';

interface SkillNodeProps {
    node: SkillNode;
    onClick: (id: string) => void;
    isSelected?: boolean;
}

export const SkillNodeComponent: React.FC<SkillNodeProps> = ({ node, onClick, isSelected }) => {
    const isOpen = node.isOpen;
    const { x, y } = getNodePosition(node);

    const squareClasses = `
        w-16 h-16                    /* увеличенный размер на мобильных */
        sm:w-14 sm:h-14              /* стандартный размер на планшетах/десктопе */
        flex items-center justify-center 
        font-bold rounded-lg 
        bg-custom-secondary 
        cursor-pointer 
        transition-all
        active:scale-95              /* лёгкое сжатие при касании */
        ${
            isOpen
                ? 'border-2 border-custom-accent text-custom-accent group-hover:shadow-[0_0_20px_2px_rgba(59,130,246,0.3)]'
                : 'border-2 border-transparent text-custom-bg-main group-hover:shadow-[0_0_20px_2px_rgba(0,0,0,0.1)]'
        } 
        ${isSelected ? 'ring-2 ring-white scale-110' : ''}
    `;

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-2 rounded-lg group"
            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        >
            <div
                className={`${squareClasses} ${node.isOpen ? 'group-hover:text-custom-main' : ''}`}
                onClick={() => onClick(node.id)}
            >
                {node.short}
            </div>
            <span className={`
                text-sm sm:text-base    /* чуть крупнее на мобильных */
                font-medium mt-1 
                group-hover:text-custom-main/80 
                ${isOpen ? 'text-custom-main' : 'text-custom-main'}
            `}>
                {node.name}
            </span>
            {/* На мобильных описание можно скрыть, чтобы не загромождать интерфейс */}
            <span className={`
                hidden                  /* скрыто на мобильных по умолчанию */
                sm:block                /* показываем на планшетах и выше */
                text-xs 
                ${isOpen ? 'text-custom-secondary' : 'text-custom-secondary'}
            `}>
                {node.description}
            </span>
        </div>
    );
};