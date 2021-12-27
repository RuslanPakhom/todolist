import uniqid from 'uniqid'
class Project{


    constructor(name){
        this.name = name
        this.id = uniqid()
        this.tasks = []
    }

    addTask(task){
        this.tasks.push(task)
    }

    removeTask(taskName){
        if(this.tasks){
            this.tasks.splice(this.tasks.
                findIndex((el) => taskName === el.getTitle()),1)
        }
    }

    getTask(taskName){
        return this.tasks.find(el => el.getTitle() === taskName)
    }

    getTasks(){
        return this.tasks
    }

    setTasks(tasks){
        this.tasks = tasks
    }

    getName(){
        return this.name
    }

    renameProject(newName){
        this.name = newName;
    }

    getId(){
        return this.id
    }

    getTaskById(id){
        return this.tasks.find(el => el.id === id)
    }
}

export default Project