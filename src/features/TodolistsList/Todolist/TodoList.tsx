import React, { memo, useCallback } from "react";
import { AddItemForm } from "../../../components/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Task from "./Task/Task";
import { TaskStatuses, TaskType } from "../../../api/todolists-api";
import { FilterValuesType } from "../../../Reducer/todolists-reducer";

import { RequestStatusType } from "../../../Reducer/app-reducer";

type TodoListPropsType = {
  todoListID: string;
  title: string;
  tasks: Array<TaskType>;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
  RemoveTask: (todoListID: string, taskID: string) => void;
  changeFilter: (todoListID: string, filter: FilterValuesType) => void;
  addTask: (todoListID: string, title: string) => void;
  changeTaskStatus: (
    todoListID: string,
    tasksID: string,
    status: TaskStatuses
  ) => void;
  removeTodolist: (todoListID: string) => void;
  editTodolist: (toDoListID: string, newTitle: string) => void;
  editTask: (toDoListID: string, taskId: string, newTitle: string) => void;
};

export const TodoList = memo((props: TodoListPropsType) => {
  let tasksForRender = props.tasks;
  if (props.filter === "active") {
    tasksForRender = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.filter === "completed") {
    tasksForRender = props.tasks.filter(
      (t) => t.status === TaskStatuses.Completed
    );
  }

  const editTaskHandler = useCallback(
    (taskId: string, newTitle: string) => {
      props.editTask(props.todoListID, taskId, newTitle);
    },
    [props.editTask, props.todoListID]
  );
  const removeTask = useCallback(
    (taskId: string) => props.RemoveTask(props.todoListID, taskId),
    [props.RemoveTask, props.todoListID]
  );
  const ChangeTaskHandler = useCallback(
    (taskId: string, status: TaskStatuses) => {
      props.changeTaskStatus(props.todoListID, taskId, status);
    },
    [props.changeTaskStatus, props.todoListID]
  );

  const tasksMap = props.tasks.length
    ? tasksForRender.map((t) => {
        return (
          <Task
            key={t.id}
            task={t}
            RemoveTask={removeTask}
            changeTaskStatus={ChangeTaskHandler}
            editTask={editTaskHandler}
          />
        );
      })
    : null; // <span>empty</span>

  const addTaskHandler = useCallback(
    (title: string) => {
      props.addTask(props.todoListID, title);
    },
    [props.addTask, props.todoListID]
  );

  const onClickRemoveTodoListHandler = () => {
    props.removeTodolist(props.todoListID);
  };
  const editTodolistHandler = useCallback(
    (newTitle: string) => {
      props.editTodolist(props.todoListID, newTitle);
    },
    [props.editTodolist, props.todoListID]
  );

  const buttonClassALL = props.filter === "all" ? "outlined" : "contained";
  const buttonClassActive =
    props.filter === "active" ? "outlined" : "contained";
  const buttonClassCompleted =
    props.filter === "completed" ? "outlined" : "contained";
  return (
    <div>
      <h3>
        <EditableSpan title={props.title} callBack={editTodolistHandler} />
        <IconButton
          aria-label="delete"
          onClick={onClickRemoveTodoListHandler}
          disabled={props.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        callBack={addTaskHandler}
        disabled={props.entityStatus === "loading"}
      />
      <div>{tasksMap}</div>

      <div>
        <Button
          variant={buttonClassALL}
          onClick={() => props.changeFilter(props.todoListID, "all")}
        >
          All
        </Button>
        <Button
          variant={buttonClassActive}
          onClick={() => props.changeFilter(props.todoListID, "active")}
        >
          Active
        </Button>
        <Button
          variant={buttonClassCompleted}
          onClick={() => props.changeFilter(props.todoListID, "completed")}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
