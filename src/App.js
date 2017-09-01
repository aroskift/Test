import {observable, observableArray, computed, applyBindings} from 'knockout';
import StorageService from './services/StorageService';
import LoginBox from './components/LoginBox';
import TodoList from './components/TodoList';

import './App.scss';

class App{
  constructor({loginBox, storageService} = {}){
    this.loginBox = loginBox;
    this.storageService = storageService;

    this.isLoggedIn = observable(false);

    this.lists = observableArray();
    this.openList = observable();

    this.listsData = computed(() => {
      return this.lists().map(list => list.data);
    }).extend({ rateLimit: { timeout: 1000, method: 'notifyWhenChangesStop'} });

    // Create a computed observable that uses isLoggedIn to determine the correct window title.
    this.windowTitle = computed(() => {
      const loginState = this.isLoggedIn();
      if (!loginState){
        return 'Todo - Login';
      }
      return 'Todo - '+this.loginBox.username();
    });
    this.windowTitle.subscribe(newTitle => document.title = newTitle);
    this.windowTitle.notifySubscribers(this.windowTitle()); // Force the title to be correct by notifying our own subscriber

    this.evts = {
      onNewListClick: (model, evt) => this.newList(),
      onListClick: (model, evt) => this.selectOpenList(model, evt),
      onLoginSubmit: (model) => this.onLogin()
    };
  }

  get hashUserPass(){
    return this.loginBox.hashCombo;
  }

  newList(model, evt){
    const newList = new TodoList();
    this.lists.push(newList);
    this.openList(newList);
  }
  selectOpenList(todoList, evt){
    if (evt.ctrlKey){
      this.removeTodoList(todoList, !evt.shiftKey);
      return;
    }
    this.openList(todoList);
  }
  async onLogin(){
    this.isLoggedIn(true);
    try {
      await this.tryLoadState();
    } finally {
      this.setAutoSave(true);
    }
  }

  removeTodoList(todoList, confirmDelete = true){
    if (confirmDelete){
      if (!confirm('Are you sure you want to delete this list?')){
        return;
      }
    }
    let listIndex = this.lists.indexOf(todoList);
    if (this.openList() === todoList){
      this.openList(this.lists()[listIndex+1]);
    }
    this.lists.remove(todoList);
  }

  async tryLoadState(){
    this.setAutoSave(false);
    const lists = await this.storageService.get(this.hashUserPass);
    const todoLists = lists.map(TodoList.fromData);
    this.lists(todoLists);
    if (todoLists){
      this.openList(todoLists[0]);
    }
    return todoLists;
  }
  setAutoSave(enabled = true){
    if (enabled && !this.autoSaveSubscription){
      this.autoSaveSubscription = this.listsData.subscribe(newData => {
        this.saveState(newData);
      });
      return;
    }

    if (this.autoSaveSubscription){
      this.autoSaveSubscription.dispose();
    }
  }
  async saveState(data){
    return await this.storageService.store(this.hashUserPass, data);
  }

  bind(){
    applyBindings(this);
    return this;
  }

  static start(){
    return new App({
      loginBox: new LoginBox(),
      storageService: new StorageService()
    }).bind();
  }
}
window._app = App.start();