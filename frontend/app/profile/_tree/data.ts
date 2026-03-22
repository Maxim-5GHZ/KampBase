// File: ./frontend/app/profile/_tree/data.ts
import { Node } from "./types";

export const nodes: Node[] = [
  {
    id: "root",
    name: "Корень",
    short: "",
    description: "",
    isOpen: true,
    distance: 0,
    angle: 0,
    parentIds: [],
  },
  // --- Ветка JAVA (Вниз-вправо) ---
  {
    id: "java-basics",
    name: "Основы Java",
    short: "J",
    description: "Открывает доступ к задачам по Java",
    isOpen: true,
    distance: 0.22, // Было 0.2
    angle: 0.8,
    parentIds: ["root"],
  },
  {
    id: "java-exp",
    name: "Java: Опыт",
    short: "JE",
    description: "Даёт +10% к опыту за выполнение задач по Java",
    isOpen: false,
    distance: 0.35, // Было 0.2
    angle: 0.8,
    parentIds: ["java-basics"],
  },
  {
    id: "java-rep",
    name: "Java: Репутация",
    short: "JR",
    description: "Даёт +10% к звёздам репутации за выполнение задач по Java",
    isOpen: false,
    distance: 0.48, // Было 0.3
    angle: 0.8,
    parentIds: ["java-exp"],
  },

  // --- Ветка PYTHON (Вниз-влево) ---
  {
    id: "python-basics",
    name: "Основы Python",
    short: "P",
    description: "Открывает доступ к задачам по Python",
    isOpen: true,
    distance: 0.22,
    angle: 2.3,
    parentIds: ["root"],
  },
  {
    id: "python-exp",
    name: "Python: Опыт",
    short: "PE",
    description: "Даёт +10% к опыту за выполнение задач по Python",
    isOpen: false,
    distance: 0.35,
    angle: 2.3,
    parentIds: ["python-basics"],
  },
  {
    id: "python-rep",
    name: "Python: Репутация",
    short: "PR",
    description: "Даёт +10% к звёздам репутации за выполнение задач по Python",
    isOpen: false,
    distance: 0.48,
    angle: 2.3,
    parentIds: ["python-exp"],
  },

  // --- Ветка JAVASCRIPT (Вверх-влево) ---
  {
    id: "js-basics",
    name: "Основы JavaScript",
    short: "JS",
    description: "Открывает доступ к задачам по JavaScript",
    isOpen: true,
    distance: 0.22,
    angle: -2.3,
    parentIds: ["root"],
  },
  {
    id: "js-exp",
    name: "JavaScript: Опыт",
    short: "JSE",
    description: "Даёт +10% к опыту за выполнение задач по JavaScript",
    isOpen: false,
    distance: 0.35,
    angle: -2.3,
    parentIds: ["js-basics"],
  },
  {
    id: "js-rep",
    name: "JavaScript: Репутация",
    short: "JSR",
    description:
      "Даёт +10% к звёздам репутации за выполнение задач по JavaScript",
    isOpen: false,
    distance: 0.48,
    angle: -2.3,
    parentIds: ["js-exp"],
  },

  // --- Ветка SQL и БД (Вверх-вправо) ---
  {
    id: "sql-basics",
    name: "Основы SQL",
    short: "SQL",
    description: "Открывает доступ к задачам по SQL",
    isOpen: true,
    distance: 0.2,
    angle: -0.5,
    parentIds: ["root"],
  },
  {
    id: "sql-exp",
    name: "SQL: Опыт",
    short: "SQLE",
    description: "Даёт +10% к опыту за выполнение задач по SQL",
    isOpen: false,
    distance: 0.33,
    angle: -0.3,
    parentIds: ["sql-basics"],
  },
  {
    id: "sql-rep",
    name: "SQL: Репутация",
    short: "SQLR",
    description: "Даёт +10% к звёздам репутации за выполнение задач по SQL",
    isOpen: false,
    distance: 0.46,
    angle: -0.2,
    parentIds: ["sql-exp"],
  },
  {
    id: "db-design",
    name: "Проектирование БД",
    short: "DBD",
    description: "Открывает доступ к задачам по проектированию баз данных",
    isOpen: false,
    distance: 0.33,
    angle: -0.8,
    parentIds: ["sql-basics"],
  },
  {
    id: "db-master",
    name: "Мастер БД",
    short: "DBM",
    description: "Даёт +15% к опыту за задачи по проектированию БД",
    isOpen: false,
    distance: 0.46,
    angle: -0.9,
    parentIds: ["db-design"],
  },
];

export const edges = nodes.flatMap((node) =>
  node.parentIds.map((parentId) => ({ from: parentId, to: node.id })),
);
