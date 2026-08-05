"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Flash, Label } from "@primer/react";
import { GrabberIcon } from "@primer/octicons-react";
import type { Board, BoardColumn, Task } from "@/lib/api-types";
import Link from "next/link";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";
import { priorityLabel } from "@/lib/labels";

export function BoardView({ initialBoard }: { initialBoard: Board }) {
  const [board, setBoard] = useState(initialBoard);
  const [error, setError] = useState<string>();

  async function move(task: Task, columnId: string) {
    if (task.columnId === columnId) return;
    const previous = board;
    const position =
      board.columns.find((column) => column.id === columnId)?.tasks.length ?? 0;
    setBoard(moveOnBoard(board, task.id, columnId, position));
    setError(undefined);
    try {
      const response = await requestMutation(
        `/api/backend/v1/tasks/${task.id}/move`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            columnId,
            position,
            expectedVersion: task.version,
          }),
        },
      );
      if (!response.ok) {
        setBoard(previous);
        setError(
          response.status === 409
            ? "A tarefa foi alterada por outra pessoa. Atualize o quadro e tente novamente."
            : "Não foi possível mover a tarefa.",
        );
        return;
      }
      const updated = (await response.json()) as Task;
      setBoard((current) => replaceTask(current, updated));
    } catch (error) {
      setBoard(previous);
      setError(mutationErrorMessage(error));
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const task = findTask(board, String(event.active.id));
    if (task && event.over) void move(task, String(event.over.id));
  }

  return (
    <div>
      {error && (
        <Flash variant="danger" className="flash-spaced-bottom">
          {error}
        </Flash>
      )}
      <DndContext onDragEnd={onDragEnd}>
        <div className="board">
          {board.columns.map((column) => (
            <Column
              projectId={board.projectId}
              column={column}
              columns={board.columns}
              onMove={move}
              key={column.id}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({
  projectId,
  column,
  columns,
  onMove,
}: {
  projectId: string;
  column: BoardColumn;
  columns: BoardColumn[];
  onMove: (task: Task, columnId: string) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <section
      ref={setNodeRef}
      className="board-column"
      style={isOver ? { outline: "2px solid var(--ds-accent)" } : undefined}
    >
      <div className="board-column-header">
        <span>{column.name}</span>
        <span className="muted">{column.tasks.length}</span>
      </div>
      {column.tasks.map((task) => (
        <TaskCard
          projectId={projectId}
          task={task}
          columns={columns}
          onMove={onMove}
          key={task.id}
        />
      ))}
    </section>
  );
}

function TaskCard({
  projectId,
  task,
  columns,
  onMove,
}: {
  projectId: string;
  task: Task;
  columns: BoardColumn[];
  onMove: (task: Task, columnId: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  return (
    <article
      ref={setNodeRef}
      className="task-card"
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
    >
      <div className="section-header">
        <span className="muted">#{task.sequence}</span>
        <button
          type="button"
          aria-label={`Arrastar ${task.title}`}
          {...listeners}
          {...attributes}
          style={{
            border: 0,
            background: "transparent",
            color: "inherit",
            cursor: "grab",
          }}
        >
          <GrabberIcon />
        </button>
      </div>
      <h3>
        <Link
          className="row-title"
          href={`/app/projects/${projectId}/tasks/${task.id}`}
        >
          {task.title}
        </Link>
      </h3>
      <div className="project-meta">
        <Label>{priorityLabel(task.priority)}</Label>
        {task.dueDate && (
          <span className="muted">
            até{" "}
            {new Intl.DateTimeFormat("pt-BR").format(
              new Date(`${task.dueDate}T00:00:00`),
            )}
          </span>
        )}
      </div>
      <div className="field board-task-move">
        <label className="sr-only" htmlFor={`move-${task.id}`}>
          Mover {task.title}
        </label>
        <select
          id={`move-${task.id}`}
          value={task.columnId}
          onChange={(event) => void onMove(task, event.target.value)}
        >
          {columns.map((column) => (
            <option value={column.id} key={column.id}>
              {column.name}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}

function findTask(board: Board, taskId: string): Task | undefined {
  return board.columns
    .flatMap((column) => column.tasks)
    .find((task) => task.id === taskId);
}

function moveOnBoard(
  board: Board,
  taskId: string,
  columnId: string,
  position: number,
): Board {
  const task = findTask(board, taskId);
  if (!task) return board;
  return {
    ...board,
    columns: board.columns.map((column) => {
      const tasks = column.tasks.filter((item) => item.id !== taskId);
      if (column.id !== columnId) return { ...column, tasks };
      const moved = { ...task, columnId, position };
      return {
        ...column,
        tasks: [...tasks.slice(0, position), moved, ...tasks.slice(position)],
      };
    }),
  };
}

function replaceTask(board: Board, task: Task): Board {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((item) => (item.id === task.id ? task : item)),
    })),
  };
}
