import axios from "axios";

const instane = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': "fab19197-098e-4362-876a-0c0797e21ac6"
    }
})

export type TodoListType = {
	id: string;
	title: string;
	addedDate: string;
	order: number;
}


export const todolistAPI = {
    getTodolists(){
       return instane.get('todo-lists')
    },
    createTodolist(title:string){
        return instane.post('todo-lists', {title})
    },
    deleteTodolist(todolistID:string){
        return instane.delete(`todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID:string,title:string){
        return instane.put(`todo-lists/${todolistID}`,{title})
    }
}