import {
  tasksActions,
  tasksReducer,
  tasksThunks,
  TasksType,
} from "../Reducer/task-reducer";

import { TaskStatuses } from "../api/todolists-api";

let startState: TasksType;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = tasksThunks.removeTaskTC.fulfilled(
    {
      taskId: "2",
      todolistId: "todolistId2",
    },
    "",
    {
      taskId: "2",
      todolistId: "todolistId2",
    }
  );

  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "string",
        order: 0,
        addedDate: "string",
        description: "string",
        deadline: "string",
        priority: 0,
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = tasksActions.addTaskAC({
    task: {
      id: "3",
      title: "juce",
      status: TaskStatuses.New,
      todoListId: "todolistId2",
      startDate: "string",
      order: 0,
      addedDate: "string",
      description: "string",
      deadline: "string",
      priority: 0,
    },
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const action = tasksActions.changeTaskStatusAC({
    status: TaskStatuses.New,
    taskId: "2",
    todolistId: "todolistId2",
  });
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});

test("title of specified task should be changed", () => {
  const action = tasksActions.changeTaskTitleAC({
    title: "bread",
    taskId: "2",
    todolistId: "todolistId2",
  });
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId2"][1].title).toBe("bread");
  expect(endState["todolistId1"][1].title).toBe("JS");
});

test("set Tasks work correct", () => {
  const action = tasksThunks.getTasksTC.fulfilled(
    {
      tasks: startState["todolistId1"],
      todolistId: "todolistId1",
    },
    "",
    "todolistId1"
  );
  const endState = tasksReducer({ todolistId1: [], todolistId2: [] }, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
