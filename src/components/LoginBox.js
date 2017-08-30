import {observable, computed} from 'knockout';
import {hash} from '../../shared/utils';

export class LoginBox{
  constructor(){
    this.username = observable();
    this.password = observable();

    this.hasTyped = computed(() => {
      return !!this.username() && !!this.password();
    });
  }

  get userPassCombo(){
    return this.username()+':'+this.password();
  }
  get hashCombo(){
    return hash(this.userPassCombo);
  }
}
export default LoginBox;