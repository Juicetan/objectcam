import { Validation } from '@/models/validation.js';

const defaultFetchOpts = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const apiFetch = async (url, options = {}) => {
  const opts = {...defaultFetchOpts, ...options};
  let response;
  try{
    response = await fetch(url, opts);
  } catch(error){
    const validation = new Validation();
    validation.add({
      header: 'Connection Error',
      message: 'Failed to connect to the server',
      code: Validation.types.CONNECTIONERROR,
      context: JSON.stringify(error),
    });
    throw validation;
  }
  
  if(!response.ok){
    const validation = new Validation();
    validation.add({
      header: 'Failed to fetch data',
      message: '',
      code: Validation.types.UNEXPECTED,
      serverCode: response.status,
    });
    throw validation;
  }

  try{
    const data = await response.json();
    return {
      headers: Object.fromEntries(response.headers.entries()),
      data,
      status: response.status,
    };
  } catch(error){
    const validation = new Validation();
    validation.add({
      header: 'Malformed response',
      message: 'Failed to parse response as JSON',
      code: Validation.types.MALFORMED,
      context: response.text(),
    });
    throw validation;
  }
}