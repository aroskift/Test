const getFirstAncestor = function(el, selector){
  const matcher = Element.prototype.matches || Element.prototype.msMatchesSelector;
  let parent = el.parentElement;
  while (!!parent){
    if (matcher.call(parent, selector)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return undefined;
};

class Task{
  constructor(){
    this.ko_text = ko.observable('');
    this.ko_done = ko.observable(false);
  }

  get text(){
    return this.ko_text();
  }
  get done(){
    return this.ko_done();
  }

  set done(value){
    this.ko_done( value === undefined ? true : value );
  }
}

class TaskList{
  constructor(){
    this.ko_title = ko.observable('');
    this.ko_tasks = ko.observableArray();

    this.ko_focusedTask = ko.observable();

    this.evts = {
      addTaskClick: () => { this.addTask(); },
      addTaskOnEnter: (taskList, evt) => {
        if (evt.keyCode === 13){
          let newTask;
          if (this.ko_tasks().length == 0){
            newTask = this.addTask();
          }
          this.ko_focusedTask( newTask || this.ko_tasks()[0] );
        }
      },
      newTaskOnTaskEnter: (task, evt) => {
        if (evt.keyCode === 13){
          let taskIndex = this.ko_tasks.indexOf(task);
          let focusableTask;

          if (taskIndex < this.ko_tasks().length-1){
            focusableTask = this.ko_tasks()[taskIndex+1];
          } else {
            focusableTask = this.addTask();
          }
          
          this.ko_focusedTask(focusableTask);
        }
      },
      removeTask: (task) => { this.ko_tasks.remove(task); },
      selectAllTasks: () => {
        this.ko_tasks().forEach(task => task.done = true);
      }
    };
  }

  addTask(){
    let newTask = new Task();
    this.ko_tasks.push(newTask);
    return newTask;
  }
}

class App{
  constructor(){
    this.ko_taskLists = ko.observableArray();

    this.ko_activeTaskList = ko.observable();

    this.evts = {
      setActiveTaskList: (taskList) => { this.ko_activeTaskList(taskList); },
      addTaskList: () => { this.ko_taskLists.push(new TaskList()); },
      removeTaskList: (taskList) => { 
        this.ko_taskLists.remove(taskList);
        this.ko_activeTaskList(undefined);
      },
      clearTaskLists: () => { 
        this.ko_taskLists([]);
        this.ko_activeTaskList(undefined);
      }
    };

    this.testThis = (inst, evt) => {
      
    };
  }

  onTaskListTitleFocus(){

  }

  bind(){
    ko.applyBindings(this);
  }

  static start(){
    let app = new App();
    app.bind();
    return app;
  }
}