/**
 * Class representing a single task
 */
class Task{
  constructor({text = '', done = false} = {}){
    this.ko_text = ko.observable(text);
    this.ko_done = ko.observable(done);
  }

  /**
   * @return {string} The text of the task.
   */
  get text(){
    return ko.unwrap(this.ko_text);
  }
  /**
   * @return {boolean} The done state of the task.
   */
  get done(){
    return ko.unwrap(this.ko_done);
  }

  setDone(done){
    done = done === false ? false : true;
    this.ko_done(!!done);
  }

  /**
   * @return {boolean} True if the text is an empty string, null or undefined, false if not.
   */
  isTextEmpty(){
    return !this.text;
  }

  static newFirstTask(){
    return new Task({text: 'This is an incomplete task. Click the checkbox to complete it.'});
  }
}

/**
 * Class representing a set of tasks.
 */
class TaskList{
  constructor({title = '', tasks = []} = {}){
    this.ko_title = ko.observable(title); //Create new blank task
    this.ko_tasks = ko.observableArray(tasks);

    this.ko_allDone = ko.computed(this.allDone, this);

    this.evts = {
      markAllDone: () => { this.setAllDone(true); },
      addTask: () => { this.addTask() },
      removeTask: (task, evt) => { evt.stopPropagation(); this.removeTask(task); }
    }
  }

  /**
   * Gets all task objects in this task list.
   * @return {Task[]} The Task objects as an array of tasks
   */
  get tasks(){
    return ko.unwrap(this.ko_tasks);
  }
  get nonEmptyTasks(){
    return this.tasks.filter(task => !task.isTextEmpty());
  }

  /**
   * Adds a new task to this task list.
   * @param {Task} [task=new Task] The task to add or undefined to add a new blank task.
   */
  addTask(task){
    this.ko_tasks.push(task || new Task());
  }
  removeTask(task){
    this.ko_tasks.remove(task);
  }

  /**
   * Sets all tasks to be done or not done.
   * @param {boolean} [done=true]
   */
  setAllDone(done){
    done = done === false ? false : true;
    this.tasks.forEach(task => task.setDone(done));
  }

  /**
   * Checks whether all tasks are done or not.
   * @return {boolean} True if all tasks are done, false if not.
   */
  allDone(){
    return !this.tasks.some(task => !task.done);
  }

  static newFirstTaskList(){
    return new TaskList({title: 'This is a a task list', tasks: [Task.newFirstTask()]});
  }
  static newTaskListWithEmptyTask(){
    return new TaskList({tasks: [new Task()]});
  }
}

const STATUS_TEXTS = {
  OK: "Everything's shiny ;)",
  UNKNOWN_ERROR: "Somethings wrong somewhere...",
  SAVING: "Saving...",
  STILL_SAVING: "Still saving...",
  SAVE_DONE: "Saved"
};

/**
 * Given an element 'el' checks if any ancestor node of this element matches the provided selector or is equal to the provided node.
 * @param {Element} el The element to check ancestors for.
 * @param {string|Element} selectorOrAncestor The CSS selector or node to check against.
 * @return {boolean} True if el is descendant of the provided selector or node.
 */
const isDescendantOf = function(el, selectorOrAncestor){
  const matcher = Element.prototype.matches || Element.prototype.msMatchesSelector;
  let parent = el.parentElement;
  while (!!parent){
    if (selectorOrAncestor instanceof Element) {
      if (selectorOrAncestor === parent) return true;
    } else if (matcher.call(parent, selectorOrAncestor)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

/**
 * The Todo app container class.
 */
class App{
  //constructor(config = {}){
    //let {container = document.body, taskLists = []} = config;
  constructor({container = document.body, taskLists = []} = {}){
    this.container = container;

    this.ko_taskLists = ko.observableArray(taskLists);
    this.ko_activeTaskList = ko.observable();

    this.ko_statusText = ko.observable(STATUS_TEXTS.OK);

    this.evts = {
      addTaskList: () => { this.addTaskList(); },
      removeTaskList: taskList => { this.removeTaskList(taskList); },
      clearTaskLists: () => { 
        if (confirm("Really delete every task list?")){
          this.clearTaskLists();
        }
      },
      setActiveTaskList: taskList => { this.ko_activeTaskList(taskList); },
      closeActiveTaskIfClickOutside: (model, evt) => {
        if (!this.activeTaskList) return;
        if (!isDescendantOf(evt.target, '[data-module="tasklist"]')){
          this.clearActiveTaskList();
        }
        return true;
      }
    }
  }

  bind(){
    ko.applyBindings(this, this.container);
  }

  /**
   * @return {TaskList[]} The Tasklist objects as an array of task lists.
   */
  get taskLists(){
    return ko.unwrap(this.ko_taskLists);
  }
  /**
   * @return {Tasklist} The active task list or undefined if none are active.
   */
  get activeTaskList(){
    return ko.unwrap(this.ko_activeTaskList);
  }

  static get STATUS_TEXTS(){
    return STATUS_TEXTS;
  }

  /**
   * Adds a new task list to the app.
   * @param {TaskList} [taskList=new TaskList] The task list to add or undefined to add a new blank task list
   */
  addTaskList(taskList){
    this.ko_taskLists.push(taskList || TaskList.newTaskListWithEmptyTask());
  }
  removeTaskList(taskList){
    this.ko_taskLists.remove(taskList);
  }
  clearTaskLists(){
    this.ko_taskLists([]);
  }
  clearActiveTaskList(){
    this.ko_activeTaskList(undefined);
  }

  static start(config){
    const appConfig = Object.assign({taskLists: [TaskList.newFirstTaskList()]}, config);
    const app = App.instance = new App(appConfig);
    app.bind();
    return app;
  }
}