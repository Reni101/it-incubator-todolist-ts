import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import Task from "../components/Task";
import {TaskType} from "../App";


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
    task: {id: "1", title: "String", isDone: true},
    RemoveTask: action("RemoveTask"),
    changeTaskStatus: action("changeTaskStatus"),
    editTask: action("editTask"),
}


