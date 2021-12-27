import Project from './Project'
import Task from './Task'
import Todolist from './Todolist'
import Storage from './Storage'
import { format } from 'date-fns'

class UI{
    $menu = document.querySelector('.menu')
    $content = document.querySelector('.content')
    $proj = document.querySelector('.proj')

    constructor(){
        this.todolist = Storage.getTodolist()
        this.loadHomePage()
        this.initEvents()
        
    }
// Using to prevent XSS attack
    sanitizeHTML(str){
        const temp = document.createElement('div')
        temp.textContent = str
        return temp.innerHTML
    }

//Load Page

    loadHomePage(){
        this.renderProjectsList(this.todolist.getProjects())
        this.renderProjectContnetTitle("Inbox")
        this.renderAllProjectTasks(this.todolist.getProjects()[0])
    }

   
//Render left Menu
    renderProjectsList(projects){
        if(projects){
            if(document.querySelector('.proj ul')){
                document.querySelector('.proj ul').remove()
            }
            const $ul = document.createElement("ul")
            this.$proj.appendChild($ul)
            projects.forEach((item) => {
                if(item.getName() !== "Inbox" && item.getName()!=="Today" && item.getName()!=="Upcoming"){
                    this.renderProject(item)   
                }                  
                })
            

        }  
        this.addClickEventForProjectList()
    }

    //Render Individual Menu
    renderProject(item){
       
        const $projectListUL = document.querySelector('.proj ul')
        
        const template = `
        <li data-id="${item.getId()}">
        <i class="fas fa-folder-open"></i>  
        ${this.sanitizeHTML(item.getName())} <button class="new-task">
        <i class="fas fa-plus"></i></button>
        <div class="remove-container">
        <button class="remove-project">
        <i class="fas fa-minus"></i></i></button>
        </div>
        </li>
    
        `
        $projectListUL.innerHTML += template
    }

   
// Triggers after left menu rendering
    addClickEventForProjectList(){
        this.listItemsEvents()
        this.removeButtonsEvent()
        this.addButtonsEvent()
      }

    listItemsEvents(){
        const $ul = document.querySelector('.proj ul')

        $ul.addEventListener('click', (e) => {
            if(e.target && e.target.nodeName === "LI"){
                const id = e.target.getAttribute('data-id')
                const item = this.todolist.getProjectById(id);
                this.renderContent(item)
            }

        })
    }

    removeButtonsEvent(){
        const $removeBtns = document.querySelectorAll('.remove-container button')
        
        for(let i=0; i<$removeBtns.length; i++){
            
            $removeBtns[i].addEventListener('click', (e) => {
                
                const $btn = $removeBtns[i]
                const id = $btn.parentNode.parentNode.getAttribute('data-id')
                const item = this.todolist.getProjectById(id)
                this.todolist.removeProject(item.name)
                Storage.saveTodolist(this.todolist)
                this.loadHomePage()
            })       
        }
    }

    addButtonsEvent(){
        const $addBtns = document.querySelectorAll('.new-task')
        
        for(let i=0; i<$addBtns.length; i++){
            $addBtns[i].addEventListener('click', (e) => {
                
                
                const $btn = $addBtns[i]
                const id = $btn.parentNode.getAttribute('data-id')
                const item = this.todolist.getProjectById(id)
                this.showAddTaskForm(item)
            })
        }
    }

   //Render Content
    renderContent(item){
        this.$content.innerHTML = '';
        this.renderProjectContnetTitle(item.getName())
        this.renderAllProjectTasks(item)
    }


    renderProjectContnetTitle(name){      
        const $content = document.querySelector('.content')
        $content.innerHTML = ''
        const template = `<h2>${this.sanitizeHTML(name)}</h2>`
        $content.innerHTML += template
    }

    renderAllProjectTasks(project){
        if(project){
            const tasks = project.tasks
            tasks.forEach((task) => {
                this.renderTask(task)
            })
            this.checkboxesEvents(project)
            this.editTaskEvents(project)
        }
    }

    editTaskEvents(project){

        const $editBtns = document.querySelectorAll('.edit-task')
        for(let i=0; i<$editBtns.length; i++){
            const $editBtn = $editBtns[i]
            $editBtn.addEventListener('click', () => {
                const id = $editBtn.parentNode.parentNode.getAttribute('data-id')
                const task = project.getTaskById(id)
                const $taskNode = document.querySelector(`div.extra-info[data-id="${id}"]`)
                this.renderEditForm(task,$taskNode,project)
            })
            
        }
    }

    renderEditForm(task,$taskNode,project){
        $taskNode.innerHTML = ''
        const template = `
                <div class="extra-info">
                <input id="task-edit-title" value="${task.getTitle()}"></input>
                    <input id="task-edit-descr" value="${task.getDescription()}"></input>
                    <span><b>Priority:</b>  
                    <select name="task-priority" id="task-edit-priority">
                    <option value="low" id="low">Low</option>
                    <option value="medium" id="medium">Medium</option>
                    <option value="high" id="high">High</option>
                  </select> | </span>
                    <span><b>Due date:</b> <input id="task-edit-date" type="date" value="${task.getDate()}"></span>
                 </div>
                 <div class="edit-buttons">
                 <button id="save-edit"><i class="fas fa-save"></i></button>
                 <button id="cancel-edit"><i class="fas fa-ban"></i></button>
                 </div>
        `
        $taskNode.innerHTML = template
        
        if(task.getPriority() === 'low'){
            document.getElementById("low").selected = true;
        }
        if(task.getPriority() === 'medium'){
            document.getElementById("medium").selected = true;
        }
        if(task.getPriority() === 'high'){
            document.getElementById("high").selected = true;
        }

        const saveEdit = document.getElementById('save-edit')
        const cancelEdit = document.getElementById('cancel-edit')

        saveEdit.addEventListener('click',this.saveEditEvent.bind(this,task,$taskNode,project))
        cancelEdit.addEventListener('click',this.saveEditEvent.bind(this,task,$taskNode,project))
   
    }

    saveEditEvent(task,$taskNode,project){
        const taskTitle = document.getElementById('task-edit-title').value
        const taskDescr = document.getElementById('task-edit-descr').value
        const taskDate = document.getElementById('task-edit-date').value
        const taskPriority = document.getElementById('task-edit-priority').value
        task.changeTask(taskTitle,taskDescr,taskDate,taskPriority)
        Storage.saveTodolist(this.todolist)
        this.renderTaskInNode(task, $taskNode,project)
    }

    renderTaskInNode(task, $taskNode,project){
        const $taskTitle = document.querySelector(`div.task-title[data-id="${task.getId()}"]`)
        const $p = document.createElement('p')
        $p.textContent = task.getTitle()
        $taskTitle.appendChild($p)
        $taskNode.innerHTML = ''
        const template = `
        <p>${task.getDescription()}</p>
           <span><b>Priority:</b> ${task.getPriority()} | </span>
           <span><b>Due date:</b> ${task.getDate()}</span>
        </div>
        `
        $taskNode.innerHTML = template
        this.renderContent(project)
    }

    renderTask(task){

        const template = `
        <div class="task" data-id="${task.getId()}">
           <div class="task-title" data-id="${task.getId()}">
           <input type="checkbox"></input>
           <button class="edit-task"><i class="fas fa-edit"></i></button>
           <p>${task.getTitle()}</p>
        </div>
        <div class="extra-info" data-id="${task.getId()}">
        <p>${task.getDescription()}</p>
           <span><b>Priority:</b> ${task.getPriority()} | </span>
           <span><b>Due date:</b> ${task.getDate()}</span>
        </div>
        </div>
        `
        const $content = document.querySelector('.content')
        $content.innerHTML += template

        
    }

    checkboxesEvents(project){
        const $checkboxes = document.querySelectorAll("input[type='checkbox']")
        for(let i=0; i<$checkboxes.length; i++){
            const $checkbox = $checkboxes[i]
            $checkbox.addEventListener('click', (e) => {
                if(e.target.checked){
    
                    const taskId = e.target.parentNode.parentNode.getAttribute('data-id')
                    const task = project.getTaskById(taskId)
                    project.removeTask(task.getTitle())
                    Storage.saveTodolist(this.todolist)
                    this.renderContent(project)   
                }
            })
        }
    }


//Event Handlers for Add Form
    showAddProjectForm(){
        const $addForm = document.querySelector('.add-form')
        $addForm.style.display = 'block'
    }

    hideProjectForm(){
        const $addForm = document.querySelector('.add-form')
        $addForm.style.display = 'none'
        const $input = document.getElementById('project-name')
        $input.value = ''
        const $add = document.getElementById('add-proj') 
        $add.disabled = true

    }

    addProject(e){
        const $projectName = document.getElementById('project-name')
        const projectName = $projectName.value
        const project = new Project(projectName)
        this.todolist.createProject(project)
        Storage.saveTodolist(this.todolist)
        this.hideProjectForm();
        this.renderProjectsList(this.todolist.getProjects())
        this.renderContent(project)
        

    }

    checkEmptyInput(e){
       
        if(e.target.id === 'project-name'){   
            const $add = document.getElementById('add-proj')        
            if(e.target.value === '') $add.disabled = true
            else $add.disabled = false

        }

        if(e.target.id === 'task-name'){
            const $add = document.getElementById('add-task')        
            if(e.target.value === '') $add.disabled = true
            else $add.disabled = false
        }

        
    } 

    showAddTaskForm(project){
        const $addTask = document.querySelector('.add-task-form')
        $addTask.style.display = 'block'
        const $projectInput = document.getElementById('task-project')
        $projectInput.value = project.getName()
    }

    hideTaskForm(){
        const $addTask = document.querySelector('.add-task-form')
        $addTask.style.display = 'none'
        const $taskName = document.getElementById('task-name')
        $taskName.value = ''
        const $taskDescr = document.getElementById('task-descr')
        $taskDescr.value = ''
        const $taskDate = document.getElementById('task-date')
        $taskDate.value = ''
        const $taskPriority = document.getElementById('task-priority')
        $taskPriority.value = ''

        const $add = document.getElementById('add-task') 
        $add.disabled = true

    }

    addTask(project){
        const $taskName = document.getElementById('task-name')
        const taskName = $taskName.value
        const $taskDescr = document.getElementById('task-descr')
        const taskDescr = $taskDescr.value
        const $taskDate = document.getElementById('task-date')
        const taskDate = $taskDate.value
        const $taskPriority = document.getElementById('task-priority')
        const taskPriority = $taskPriority.value
        const task = new Task(taskName, taskDescr, taskDate, taskPriority)
        project.addTask(task)
        Storage.saveTodolist(this.todolist)
        this.hideTaskForm()
        this.renderContent(project)
    }


    initEvents(){
        //New Project form
        const btn = document.getElementById("new-proj")
        btn.addEventListener('click',this.showAddProjectForm)

        const cncl = document.getElementById("cancel-add-proj")
        cncl.addEventListener('click',this.hideProjectForm)

        const $projectName = document.getElementById('project-name')
        $projectName.addEventListener('input', this.checkEmptyInput)

        const add = document.getElementById('add-proj')
        add.addEventListener('click',this.addProject.bind(this))

        const inbox = document.getElementById('inbox')
        inbox.addEventListener('click', this.renderContent.bind(this,this.todolist.getProject("Inbox")))

        //New Task form

        const btnNewTask = document.getElementById("new-task-inbox")
        btnNewTask.addEventListener('click',this.showAddTaskForm.bind(this, this.todolist.getProject("Inbox")))

        const cnclTaskBtn = document.getElementById("cancel-add-task")
        cnclTaskBtn.addEventListener('click',this.hideTaskForm)

        const addBtn = document.getElementById('add-task')
        addBtn.addEventListener('click',() => {
            this.addTask(this.todolist.getProject(document.getElementById('task-project').value))
            Storage.saveTodolist(this.todolist)
        })

        const $taskName = document.getElementById('task-name')
        $taskName.addEventListener('input', this.checkEmptyInput)

        //Default Projects Rendering

        const $today = document.getElementById('today')
        $today.addEventListener('click', this.todayTasksRendering.bind(this))

        const $upcoming = document.getElementById('upcoming')
        $upcoming.addEventListener('click', this.upcomingTasksRendering.bind(this))

    }

    todayTasksRendering(){
        this.$content.innerHTML = '';
        this.renderProjectContnetTitle("Today")
        const inboxProject = this.todolist.getProject("Inbox")
        const today = format(new Date(), "yyyy-MM-dd")
        const tasks = inboxProject.getTasks()
        const todayTasks = tasks.filter((item) => item.getDate() === today)
        todayTasks.forEach(task => this.renderTask(task))
        this.checkboxesEvents(this.todolist.getProject("Inbox"))
        this.editTaskEvents(this.todolist.getProject("Inbox"))
    }

    upcomingTasksRendering(){
        this.$content.innerHTML = '';
        this.renderProjectContnetTitle("Upcoming")
        const inboxProject = this.todolist.getProject("Inbox")
        const today = format(new Date(), "yyyy-MM-dd")
        const tasks = inboxProject.getTasks()
        const todayTasks = tasks.filter((item) => item.getDate() > today)
        todayTasks.forEach(task => this.renderTask(task))
        this.checkboxesEvents(this.todolist.getProject("Inbox"))
        this.editTaskEvents(this.todolist.getProject("Inbox"))
    }


}

export default UI