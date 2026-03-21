export type Node = {
    id: string;
    name: string;
    short: string;
    description: string;
    isOpen: boolean;
    distance: number; // расстояние от центра (0..~0.5)
    angle: number;    // угол в радианах
    parentIds: string[];
};