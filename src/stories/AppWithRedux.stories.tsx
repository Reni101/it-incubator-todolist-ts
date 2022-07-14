import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import Task from "../components/Task";
import {TaskType} from "../App";
import AppWithRedux from "../AppWithRedux";


export default {
    title: 'Todolist/AppWithRedux',
    component: AppWithRedux,
    argTypes: {
        onClick: {
            description: "AppWithRedux"
        }
    },
} as ComponentMeta<typeof AppWithRedux>;

const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux {...args} />;

export const AppWithReduxType = Template.bind({});
AppWithReduxType.args = {
    task: {id: "1", title: "String", isDone: false},
    RemoveTask: action("RemoveTask"),
    changeTaskStatus: action("changeTaskStatus"),
    editTask: action("editTask"),
}


