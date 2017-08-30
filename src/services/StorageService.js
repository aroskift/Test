export class StorageService{
  constructor({endpoint = 'http://localhost:4321'} = {}){
    this.endpoint = endpoint;
  }

  getEndpoint(op){
    return this.endpoint+'/'+op;
  }
  store(identifier, rawLists){
    return this.fetchJson(this.getEndpoint('lists/'+identifier), rawLists);
  }
  get(identifier){
    return this.fetchJson(this.getEndpoint('lists/'+identifier));
  }
  list(){
    return this.fetchJson(this.getEndpoint('lists')).catch(err => {
      if (err.status === 404){
        return [];
      }
    });
  }

  fetchJson(url, body){
    let request = {
      method: 'GET'
    };

    if (body){
      Object.assign(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
    return fetch(url, request)
      .then(res => {
        if (!res.ok){
          throw res;
        }
        return res.json();
      })
      .catch(err => {
        //console.error('FETCH ERROR', err); // Uncomment this line to log the error to console.
        throw err;
      });
  }
}
export default StorageService;