import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {App} from "../app/App";
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";


export default {
    title: 'Todolist/AppWithRedux',
    component: App,
    decorators: [ReduxStoreProviderDecorator],
    argTypes: {
        onClick: {
            description: "AppWithRedux"
        }
    },
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App />;

export const AppWithReduxType = Template.bind({});



