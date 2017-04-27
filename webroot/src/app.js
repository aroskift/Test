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
}

class TaskList{
  constructor(){
    this.ko_title = ko.observable('');
    this.ko_tasks = ko.observableArray();

    this.evts = {
      addTaskClick: () => { this.addTask(); },
      addTaskOnEnter: (taskList, evt) => {
        if (evt.keyCode === 13){
          if (this.ko_tasks().length == 0){
            this.addTask();
          }
          //Set focus
        }
      }
    };
  }

  addTask(){
    this.ko_tasks.push(new Task());
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