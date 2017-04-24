/**
 * Class representing a single task
 */
class Task{
  constructor({text = '', done = false} = {}){
    this.ko_text = ko.observable(text);
    this.ko_done = ko.observable(done);
    this.ko_raw = ko.computed(() => this.raw);
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
  get raw(){
    return {
      text: this.text,
      done: this.done
    };
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

  static newFromRaw(taskObject){
    return new Task(taskObject);
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
    this.ko_raw = ko.computed(() => this.raw);

    this.evts = {
      markAllDone: () => { this.setAllDone(true); },
      addTask: () => { this.addTask() },
      removeTask: (task, evt) => { evt.stopPropagation(); this.removeTask(task); }
    }
  }

  get title(){
    return ko.unwrap(this.ko_title);
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
  get raw(){
    return {
      title: this.title,
      tasks: this.tasks.map(task => task.raw)
    };
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

  static newFromRaw(taskListObject){
    return new TaskList({
      title: taskListObject.title,
      tasks: (taskListObject.tasks || []).map(Task.newFromRaw)
    });
  }
  static newFromRawSet(taskListObjects){
    return taskListObjects.map(TaskList.newFromRaw);
  }
}

const STATUS_TEXTS = {
  OK: "Everything's shiny ;)",
  UNKNOWN_ERROR: "Somethings wrong somewhere...",
  SAVING: "Saving...",
  STILL_SAVING: "Still saving...",
  SAVE_DONE: "Saved"
};
const REST_DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
  'Accept': 'application/json'
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
};
const friendlyNow = function(){
  let now = new Date();
  return ('0' + now.getHours()).slice(-2) 
    + ':'
    + ('0' + now.getMinutes()).slice(-2)
    + ':'
    + ('0' + now.getSeconds()).slice(-2);
};

/**
 * Class representing a service that can save/load sets of TaskList instances from a server
 */
class TaskListSetService{
  constructor(){
    this.endpoint = '/';
    this.port = 8080;
  }

  list(){
    return TaskListSetService.makeJsonRequest({
      url: this.endpoint + 'taskLists'
    });
  }

  has(name){
    return this.loadTaskListSet(TaskListSetService.makeSafeName(name))
      .then(exists => true, notExists => false);
  }
  load(name){
    return TaskListSetService.makeJsonRequest({
      url: this.endpoint + 'taskList/' + TaskListSetService.makeSafeName(name)
    }).then(TaskList.newFromRawSet);
  }
  save(name, taskListSet){
    return TaskListSetService.makeJsonRequest({
      url: this.endpoint + 'taskList/' + TaskListSetService.makeSafeName(name),
      method: 'POST',
      body: taskListSet.map(taskList => taskList.raw)
    });
  }
  delete(name){
    return TaskListSetService.makeJsonRequest({
      url: this.endpoint + 'taskList/' + TaskListSetService.makeSafeName(name),
      method: 'DELETE'
    });
  }

  static makeSafeName(name){
    return (name+'').toLowerCase().replace(/[^a-z0-9]/ig, '');
  }

  static makeJsonRequest({url, method = 'GET', body = undefined, headers = REST_DEFAULT_HEADERS} = {}){
    return fetch(url, {
        method: method,
        headers: headers,
        body: !body ? body : JSON.stringify(body)
      }).then(res => {
        if (!res.ok) throw res;
        return res.json();
      }
    );
  }
}

/**
 * The Todo app container class.
 */
class App{
  //constructor(config = {}){
    //let {container = document.body, taskLists = []} = config;
  constructor(taskListSetService, {container = document.body, taskLists = []} = {}){
    this.taskListSetService = taskListSetService;
    this.container = container;

    this.ko_taskLists = ko.observableArray(taskLists);
    this.ko_activeTaskList = ko.observable();
    this.ko_name = ko.observable('noname');

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
      },
      setNameClick: () => {
        let promptResult = prompt('Enter the name of this set of task lists');
        if (promptResult && !!(promptResult.trim())){
          this.ko_name(promptResult);
          this.ko_statusText('Name changed to "' + promptResult+'"');
        }
      }
    };

    this.ko_raw_limited = ko.computed(() => this.raw).extend({ rateLimit: { timeout: 1000, method: "notifyWhenChangesStop" } });

    this.ko_name.subscribe(newName => this.onNameChanged(newName));
    this.ko_raw_limited.subscribe(() => this.save());

    this._savingPromise = undefined;
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
  get name(){
    return ko.unwrap(this.ko_name);
  }
  get raw(){
    return this.taskLists.map(taskList => taskList.raw);
  }

  static get STATUS_TEXTS(){
    return STATUS_TEXTS;
  }

  onNameChanged(newName){
    if (!newName) return;
    return this.taskListSetService.load(newName).then(taskListSet => {
      this.ko_statusText('Loaded '+taskListSet.length+' tasks from '+newName);
      this.ko_taskLists(taskListSet);
      return taskListSet;
    });
  }

  /**
   * Adds a new task list to the app.
   * @param {TaskList} [taskList=new TaskList] The task list to add or undefined to add a new blank task list
   */
  addTaskList(taskList){
    this.ko_taskLists.push(taskList || new TaskList());
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

  save(){
    if (this._savingPromise) return this._savingPromise;
    this.ko_statusText('Saving...');
    if (this.taskLists.length === 0){
      this._savingPromise = this.taskListSetService.delete(this.name).then(() => {
        this._savingPromise = undefined;
        this.ko_statusText('Deleted "'+this.name+'"');
      });
    } else {
      this._savingPromise = this.taskListSetService.save(this.name, this.taskLists).then(() => {
        this._savingPromise = undefined;
        this.ko_statusText('Saved "'+this.name+'" @ '+friendlyNow());
      });
    }
    return this._savingPromise;
  }

  static start(config){
    const appConfig = Object.assign({taskLists: []}, config);
    const app = App.instance = new App(new TaskListSetService(), appConfig);
    app.bind();
    return app;
  }
}