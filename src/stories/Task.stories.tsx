import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import Task from "../features/TodolistsList/Todolist/Task/Task";
import {TaskStatuses} from "../api/todolists-api";


export default {
    title: 'Todolist/Task',
    component: Task,
    argTypes: {
        onClick: {
            description: "Button"
        }
    },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskPropsType = Template.bind({});
TaskPropsType.args = {
    task: {id: "1", title: "String", status:TaskStatuses.Completed,
        todoListId:'string',startDate:"string", order:0,addedDate:"string",description:"string",
    deadline:"string",priority:0},
    RemoveTask: action("RemoveTask"),
    changeTaskStatus: action("changeTaskStatus"),
    editTask: action("editTask"),
}


