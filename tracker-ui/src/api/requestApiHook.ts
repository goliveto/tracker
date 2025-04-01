
import { JobApplication, PaginatedResponse } from "../model/Interfaces";
import {callAPI} from "./apiHook"

export const useRequestAPIHooks = () => {
 
    return {
        createApplicationJob: (body:JobApplication) => callAPI('POST','api/applications',body),
        updateApplicationJob: (id: number, body:JobApplication) => callAPI('PUT',`api/applications/${id}`,body),
        updateApplicationStatus: (id: number, body: {status: string}) => callAPI('PATCH',`api/applications/${id}`,body),
        getApplicationJobs: (pageNumber : number, pageSize:number) => callAPI<PaginatedResponse<JobApplication>>('GET', `api/applications?pageNumber=${pageNumber}&pageSize=${pageSize}`),
        getApplicationJob: (id:number) => callAPI<JobApplication>('GET',`api/applications/${id}`),
    };
  }; 
