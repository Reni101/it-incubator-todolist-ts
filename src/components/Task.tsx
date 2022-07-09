import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "../App";


type TaskPropsType = {
    task: TaskType
    RemoveTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, status: boolean) => void
    editTask: (taskId: string, newTitle: string) => void
}

const Task = memo(({
                       task,
                       RemoveTask,
                       changeTaskStatus,
                       editTask
                   }: TaskPropsType) => {


    const editTasktHandler = (newTitle: string) => {
        editTask(task.id, newTitle)
    }
    const removeTask = () => RemoveTask(task.id)
    const ChangeTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked)
    }

    return (
        <div>
            <Checkbox defaultChecked
                      checked={task.isDone}
                      onChange={ChangeTaskHandler}

            />

            <EditableSpan isDone={task.isDone} title={task.title} callBack={editTasktHandler}/>

            <IconButton aria-label="delete">
                <Delete onClick={removeTask}/>
            </IconButton>

        </div>
    );
});

export default Task;