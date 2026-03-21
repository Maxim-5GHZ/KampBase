"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronRight, Check } from "lucide-react";

export type FilterCategory = {
    name: string;
    values: string[];
    selected: string[];
};

type FilterPanelProps = {
    categories: FilterCategory[];
    onFilterChange: (categories: FilterCategory[]) => void;
};

const FilterPanel = ({ categories, onFilterChange }: FilterPanelProps) => {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleCategory = (index: number) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(index)) {
        newExpanded.delete(index);
        } else {
        newExpanded.add(index);
        }
        setExpanded(newExpanded);
    };

    const handleCheckboxChange = (
        categoryIndex: number,
        value: string,
        checked: boolean
    ) => {
        const updatedCategories = [...categories];
        const category = updatedCategories[categoryIndex];
        if (checked) {
        category.selected = [...category.selected, value];
        } else {
        category.selected = category.selected.filter((v) => v !== value);
        }
        onFilterChange(updatedCategories);
    };

    return (
        <div className="bg-custom-bg-secondary rounded-2xl p-4 shadow-lg lg:h-[90vh]">
        {/* Шапка */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-custom-secondary/20">
            <Filter size={20} className="text-custom-main" />
            <h3 className="text-custom-main font-semibold text-lg">Фильтры</h3>
        </div>

        {/* Категории */}
        <div className="space-y-2">
            {categories.map((category, catIndex) => {
            const isExpanded = expanded.has(catIndex);
            const hasSelected = category.selected.length > 0;

            return (
                <div key={catIndex} className="border-b border-custom-secondary/10 pb-2 last:border-0">
                {/* Шапка категорий с переключателем */}
                <button
                    className="flex items-center justify-between w-full text-left py-2 group cursor-pointer"
                    onClick={() => toggleCategory(catIndex)}
                >
                    <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronDown size={18} className="text-custom-main" />
                    ) : (
                        <ChevronRight size={18} className="text-custom-main" />
                    )}
                    <span className="text-custom-main font-medium">{category.name}</span>
                    </div>
                    {hasSelected && (
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-custom-accent animate-pulse" />
                    </div>
                    )}
                </button>

                {/* Checkbox список */}
                {isExpanded && (
                    <div className="mt-2 ml-6 space-y-2">
                    {category.values.map((value) => {
                        const isChecked = category.selected.includes(value);
                        return (
                        <label
                            key={value}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isChecked
                                ? "bg-custom-accent border-custom-accent"
                                : "bg-transparent border-custom-secondary"
                            }`}
                            onClick={() =>
                                handleCheckboxChange(catIndex, value, !isChecked)
                            }
                            >
                            {isChecked && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-custom-main text-sm">{value}</span>
                        </label>
                        );
                    })}
                    </div>
                )}
                </div>
            );
            })}
        </div>
        </div>
    );
};

export default FilterPanel;