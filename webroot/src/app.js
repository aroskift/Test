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
  constructor({text = '', done = false} = {}){
    this.ko_text = ko.observable(text);
    this.ko_done = ko.observable(!!done);
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

  toObject(){
    return {
      text: this.text,
      done: this.done
    };
  }

  static fromObject(taskObject){
    return new Task(taskObject);
  }
}

class TaskList{
  constructor({title = '', tasks = []} = {}){
    this.ko_title = ko.observable(title);
    this.ko_tasks = ko.observableArray(tasks.map(Task.fromObject));

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

  toObject(){
    return {
      title: this.ko_title(),
      tasks: this.ko_tasks().map(task => task.toObject())
    }
  }
}

class App{
  constructor(){
    this.ko_taskLists = ko.observableArray();
    this.ko_taskListsName = ko.observable('');

    this.ko_statusText = ko.observable('Ready!');

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
      },
      onBodyClickCloseOpenTaskList: (app, evt) => {
        this.ko_activeTaskList(null);
      },
      preventBublingEvent: (app, evt) => {
        evt.stopPropagation();
      },
      setTaskListsName: () => {
        let promptResult = prompt('Enter a name for the set of task lists', this.ko_taskListsName());
        if (!promptResult){
          return;
        }

        this.ko_taskListsName(promptResult);
        this.ko_statusText('Name changed to "'+promptResult+'"');
      }
    };
  }

  bind(){
    ko.applyBindings(this);
  }

  fromObject({name = '', taskLists = []} = {}){
    this.ko_taskLists(taskLists.map( taskListObject => new TaskList(taskListObject) ));
    this.ko_taskListsName(name);
  }

  toObject(){
    return {
      name: this.ko_taskListsName(),
      taskLists: this.ko_taskLists().map(taskList => taskList.toObject())
    }
  }

  static start(){
    let app = new App();
    app.bind();
    return app;
  }
}