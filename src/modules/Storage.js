import Todolist from "./Todolist"
import Project from "./Project"
import Task from "./Task"

class Storage{

    static saveTodolist(data){
        localStorage.setItem('todolist', JSON.stringify(data))
    }

    static getTodolist(){
        
        const todolist = Object.assign(new Todolist(), JSON.parse(localStorage.getItem('todolist')))

        const projects = todolist.setProjects(
            todolist.getProjects()
            .map((project) => Object.assign(new Project(), project))
            )

        todolist.getProjects()
        .forEach((project) => project.setTasks(
            project.getTasks().map((task) => Object.assign(new Task(), task))
            )
        )

        return todolist
}
    static addProject(projectName){
        const todolist = Storage.getTodolist()
        todolist.createProject(new Project(projectName))
        Storage.saveTodolist(todolist)
    }

    static deleteProject(projectName){
        const todolist = Storage.getTodolist()
        todolist.removeProject(projectName)
        Storage.saveTodolist()
    }

    static addTask(project,task){
        const todolist = Storage.getTodolist()
        project.addTask(task)
        Storage.saveTodolist(todolist)
    }

    static deleteTask(project,taskName){
        const todolist = Storage.getTodolist()
        project.removeTask(taskName)
        Storage.saveTodolist(todolist)
    }
}

export default Storage