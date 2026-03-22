// File: ./frontend/app/profile/_tree/utils/position.ts
import { Node } from "../types";

export const getNodePosition = (node: Node) => {
  if (node.id === "root") {
    return { x: 0.5, y: 0.5 };
  }
  const x = 0.5 + node.distance * Math.cos(node.angle);
  const y = 0.5 + node.distance * Math.sin(node.angle);

  // Больше не обрезаем координаты. Позволяем им занимать весь холст
  return {
    x: x,
    y: y,
  };
};
