/*****************************************************
 * /************************************************ *
 * * BE CAUTIOUS WHEN WORKING WHITH PROD DATABASE    *
 *             AND CHECK /CONSTANTS/URI.JS           *
 * ************************************************  *
 *****************************************************/

import { AUTH_URL, db} from "../constants/URI";

export const getData = async (URL, route, params) => {
  //@@@@ IMPORTANT :  dbfilter setting needs to be set to a database for the REST interface to work.
  return fetch(`${URL}${route}`, {
    method: "POST",
    body: JSON.stringify({ jsonrpc: "2.0", params: params }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

export const deleteDoc = async (URL, route, id) => {
  //@@@@ IMPORTANT :  dbfilter setting needs to be set to a database for the REST interface to work.
  return fetch(`${URL}${route}${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

export const authenticate = async (user,pass) =>{
    const body = {
                "jsonrpc":"2.0",
                "method": "call",
                "params":{
                    "db": db,
                    "login": user,
                    "password": pass
                }}

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`${AUTH_URL}`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};
