import uniqid from 'uniqid'
class Task{

    constructor(title,description,dueDate,priority){
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.id = uniqid()
        
    }

    getTitle(){
        return this.title
    }

    getDescription(){
        return this.description
    }

    getDate(){
        return this.dueDate
    }

    getPriority(){
        return this.priority
    }

    changeTask(title,description,dueDate,priority){
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }

    getId(){
        return this.id
    }
    

}

export default Task