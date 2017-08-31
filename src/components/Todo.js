import {observable} from 'knockout';

export class Todo{
  constructor({text = '', done = false} = {}){
    this.text = observable(text);
    this.done = observable(done);

    this.evts = {
      onTodoClick: (model, evt) => this.onTodoClick(evt)
    };
  }

  onTodoClick(evt){
    if (evt.ctrlKey){
      this.done(!this.done());
    }
    return true;
  }
  
  get data(){
    return {
      text: this.text(),
      done: this.done()
    };
  }

  toggleDone(){
    this.done(!this.done());
  }
  setDone(flag){
    this.done(flag);
  }
}
export default Todo;