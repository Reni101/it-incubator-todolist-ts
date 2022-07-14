import React from 'react'
import {Provider} from 'react-redux'
import {store} from "../../Reducer/store";


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactComponentElement<any>) => {

    return <Provider store={store}>{storyFn()}    </Provider>
}