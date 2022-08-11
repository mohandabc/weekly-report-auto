import React from "react";
import {weeklyDataState} from '../shared/globalState';
import { useRecoilState } from "recoil";

const API_URL = 'http://10.171.59.82:8069/';

export const getData = async (route, params)=>{
   //@@@@ IMPORTANT :  dbfilter setting needs to be set to a database for the REST interface to work.
  return fetch(`${API_URL}${route}`, {
    method: 'POST',
    body: JSON.stringify({"jsonrpc":"2.0","params":params}),
    headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error))
}

// export const getData = async (route, params)=>{

   
//     fetch(`${API_URL}${route}`, {
//       method: 'POST',
//       body: JSON.stringify({"jsonrpc":"2.0","params":params}),
//       // mode: 'no-cors',
//       headers: {
//             // 'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             // 'Access-Control-Allow-Origin':'*'
//         }
  
//     })
//     .then(response => response.json())
//     .catch(error => console.error('Error:', error))
//     .then(response => console.log('Success:', response));
//   }


