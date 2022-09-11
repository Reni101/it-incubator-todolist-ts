import React, {memo} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType,} from "../../../../api/todolists-api";


type TaskPropsType = {
    task: TaskType
    RemoveTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses) => void
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
    const ChangeTaskHandler = () => {
        changeTaskStatus(task.id,
            task.status === TaskStatuses.Completed ? TaskStatuses.New : TaskStatuses.Completed)
    }

    return (
        <div>
            <Checkbox
                      checked={task.status === TaskStatuses.Completed}
                      onChange={ChangeTaskHandler}

            />

            <EditableSpan status={task.status} title={task.title} callBack={editTasktHandler}/>

            <IconButton aria-label="delete"  onClick={removeTask}>
                <Delete/>
            </IconButton>

        </div>
    );
});

export default Task;