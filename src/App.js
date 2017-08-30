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
  onLogin(){
    this.isLoggedIn(true);
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