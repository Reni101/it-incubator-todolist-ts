import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddItemFormPropsType = {
    callBack:(title:string)=>void
}

export const AddItemForm = (props:AddItemFormPropsType) => {


    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const errorInputStyle = error ? {border: "2px solid red", outline: "none"} : undefined


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        if (error && e.currentTarget.value.trim()) {
            setError(false)
        }
    }
    const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && TaskTestHandler() // &&- И при нажати и тру и она запускаеть функцию
    }
    const TaskTestHandler = () => {
        let taskTitle: string = title.trim();
        if (taskTitle !== "") {
            props.callBack(taskTitle)
        } else {
            setError(true)
        }

        setTitle("")
    }

    return (


        <div>
            <input
                style={errorInputStyle}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={pressEnter} //e.key === "Enter" && addTasksHandler()  (e)=>{if(e.key === 'Enter')addTasksHandler()}
            />

            <button onClick={TaskTestHandler}>+</button>
            {error && <div style={{color: "red"}}>Title is required!</div>}
        </div>
    );
};
