import Project from './Project'
import Task from './Task'

class Todolist{
  
    constructor(){
        this.projects = []
        this.projects.push(new Project("Inbox"))
        this.projects.push(new Project("Work"))
        this.projects.push(new Project("Home"))
        this.projects.push(new Project("Personal"))
    }

    createProject(project){
        this.projects.push(project)
    }

    removeProject(projectName){
        this.projects.splice(this.projects.findIndex((el) => projectName === el.getName()),1)
    }

    getProjects(){
        return this.projects;
    }

    setProjects(projects){
        this.projects = projects
    }

    getProject(projectName){

        return this.projects.find(el => el.getName() === projectName)

    }

    getProjectById(id){
        return this.projects.find(item => item.getId() === id)
    }
}

export default Todolist