const API_URL = 'http://10.171.59.82:8069/';

export const getData = (route, params)=>{

    //@@@@ IMPORTANT :  dbfilter setting needs to be set to a database for the REST interface to work.
    fetch(`${API_URL}${route}`, {
      method: 'POST',
      body: JSON.stringify({"jsonrpc":"2.0","params":{}}),
      // mode: 'no-cors',
      headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin':'*'
        }
  
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  }