
const AUTH_URL = 'http://10.171.59.82:8069/web/session/authenticate';


const authenticate = async () =>{
    const body = {
                "jsonrpc":"2.0",
                "method": "call",
                "params":{
                    "db": "15_09_2021",
                    "login": "admin",
                    "password":"Ext3ns1on"
                }}

    const requestOptions = {
      method: "POST",
      // mode: 'no-cors',
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(body)
    };

    const response = await fetch(AUTH_URL, requestOptions)
        // .then(response => response.json())
        // .then(data => console.log(data));
    // const data = await response.json();
    console.log(response);

  }