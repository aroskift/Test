import {observable, observableArray, computed, applyBindings} from 'knockout';

import TodoList from './components/TodoList';
import StorageService from './services/StorageService';
import LoginBox from './components/LoginBox';

import './App.scss';

/**
 * @field {observableArray<TodoList[]>} lists
 */
class App{
  constructor({storageService, loginBox} = {}){
    this.storageService = storageService;
    this.loginBox = loginBox;

    this.lists = observableArray();
    this.openList = observable();

    this.isLoggedIn = observable(false);

    this.rawData = computed(() => this.getData()).extend({ rateLimit: {timeout: 1000, method: 'notifyWhenChangesStop'}});
    this.rawData.subscribe(() => this.saveState());

    this.evts = {
      onListClick: (model) => this.setOpenList(model),
      onLoginSubmit: () => this.onLogin()
    };
  }
  
  onLogin(){
    this.isLoggedIn(true);
    this.tryLoadState();
  }

  async tryLoadState(){
    const rawLists = await this.storageService.get(this.loginBox.hashCombo());
    this.lists(rawLists.map(TodoList.fromData));
  }
  async saveState(){
    return await this.storageService.store(this.loginBox.hashCombo(), this.getData());
  }
  getData(){
    return this.lists().map(todoList => todoList.getData());
  }

  setOpenList(todoList){
    this.openList(todoList);
  }
  newList(){
    const newList = new TodoList();
    this.lists.push(newList);
  }

  static start(dependencies){
    const app = new App(dependencies);
    applyBindings(app);
    return app;
  }
}
window._app = App.start({
  storageService: new StorageService(),
  loginBox: new LoginBox()
});