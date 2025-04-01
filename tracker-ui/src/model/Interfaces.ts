export interface JobApplication {
    id?: number;
    position: string;
    companyName: string;
    status: string;
    dateApplied: Date;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }

  export interface EnumDropdown {
    id: number;
    description: string;
  }

  export const STATUS_ENUM : EnumDropdown[]= [    
    {id:1, description:'Interview'},
    {id:2, description:'Offer'},
    {id:3, description:'Rejected'},
  ];
