/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import Axios from 'axios';

 const baseURL = import.meta.env.VITE_BASE_API_URL;

  const handleErr = async (err: any): Promise<any> => {
    const status = err?.response?.status;
    if (status === 404) {
      window.location.href = '/not-found';
      return Promise.reject(err);
    }

    if (status === 500) {
      window.location.href = '/server-error';
      return Promise.reject(err);
    }
    return Promise.reject(err);
  };
  
export const callAPI = async<T> (method:string, url: string, data?: any) => { 
  try {
    const resp: AxiosResponse<T> = await Axios({
      method:method,
      baseURL: baseURL,
      url: url,
      headers: {
          'content-type':'application/json',
      },
      data: data,
    })
    return Promise.resolve(resp.data);
  } catch (err) {
    handleErr(err);
  }
}