/**
 * Class representing a single task
 */
class Task{
  constructor(){
    this.ko_text = ko.observable();
    this.ko_done = ko.observable(false);
  }

  get text(){
    return this.ko_text();
  }
  set text(value){
    this.ko_text(value);
  }

  get done() {
    return this.ko_done();
  }
  set done(value){
    this.ko_done(!!value);
  }
}

/**
 * Class representing a set of tasks.
 */
class TaskList{
  constructor(){
    this.ko_title = ko.observable();
    this.ko_tasks = ko.observableArray();

    this.ko_allDone = ko.computed(() => {
      return this.isAllDone;
    }, this);
  }

  /**
   * Gets whether all tasks in this task list are done.
   * @return {boolean} True if all done, false if at least one is not done.
   */
  get isAllDone(){
    return !this.tasks().some(task => !task.done);
  }

  /**
   * Gets the set of tasks in the task list.
   * @return {Task[]} Array of Task instances.
   */
  get tasks(){
    return this.ko_tasks();
  }
}

/**
 * The Todo app container class.
 */
class App{
  constructor(){
  }

  static start({container = document.body} = {}){
    App.instance = new App();
    ko.applyBindings(App.instance, container);
  }
}