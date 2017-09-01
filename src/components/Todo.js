import {observable} from 'knockout';

export class Todo{
  constructor({text = '', done = false} = {}){
    this.text = observable(text);
    this.done = observable(done);

    this.evts = {
      onTodoClick: (model, evt) => {
        if (evt.ctrlKey) this.toggleDone();
      }
    };
  }

  getData(){
    return {
      text: this.text(),
      done: this.done()
    };
  }

  toggleDone(){
    this.done(!this.done());
  }
}
export default Todo;