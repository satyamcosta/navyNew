import * as AT from "app/camunda_redux/redux/constants/ActionTypes";

const createDepartmentInitState = {
  loading: false,
  departmentData: [],       // get all department data
 filterDepartment:[],
 filetrRoleDeptData:[],       // get filter role and dept data 
 departmentBYid:{},             //get departemnt by id   
  error: "",
};

export const createDepartmentReducer = (
  state = createDepartmentInitState,
  action
) => {
  switch (action.type) {
    case AT.GET_ALL_DEPARTMENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case AT.GET_ALL_DEPARTMENT_DATA_SUCCESS:
      
      return {
        ...state,
        loading: false,
        departmentData: action.payload.data,
      };
    case AT.GET_ALL_DEPARTMENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

      case AT.GET_ROLE_BYNAME_REQUEST:
        return {
          ...state,
          loading: true,
          error: "",
        };
        
        case AT.GET_ROLE_BYNAME_SUCCESS:
        
        
        return {
          ...state,
          loading: false,
         
          departmentData:action.payload.searchData
        };
      case AT.GET_ROLE_BYNAME_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        };

    default:
      return state;
  }
};
export const getDepartmentById = (state = createDepartmentInitState,action) => {
  switch (action.type) {
    case AT.GET_DEPARTMENT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case AT.GET_DEPARTMENT_BY_ID_SUCCESS:
      
      return {
        ...state,
        loading: false,
        departmentBYid: action.payload,
      };
    case AT.GET_DEPARTMENT_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};



export const getDepartmentRole = (
  state = createDepartmentInitState,
  action
) => {
  switch (action.type) {
    case AT.GET_ALL_DEPARTMENT_ROLE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case AT.GET_ALL_DEPARTMENT_ROLE_DATA_SUCCESS:
      
      return {
        ...state,
        loading: false,
        departmentRoleData: action.payload,
      };
    case AT.GET_ALL_DEPARTMENT_ROLE_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };


      case AT.GET_ROLE_BYNAME_REQUEST:
        return {
          ...state,
          loading: true,
          error: "",
        };
  
      case AT.GET_ROLE_BYNAME_SUCCESS:
        
        return {
          ...state,
          loading: false,
          departmentRoleData: action.payload.searchData,
         
        };
      case AT.GET_ROLE_BYNAME_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        };
  


    default:
      return state;
  }
};


export const getDepartmentByName = (
  state = createDepartmentInitState,
  action
) => {
  switch (action.type) {
    case AT.GET_DEPARTMENT_BYNAME_REQUEST:
      
      return {
        ...state,
        loading: true,
        error: "",
      };

    case AT.GET_DEPARTMENT_BYNAME_SUCCESS:
      
      return {
        ...state,
        loading: false,
        filterDepartment: action.payload.data,
      };
    case AT.GET_DEPARTMENT_BYNAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
export const getRoleDeptByName = (state = createDepartmentInitState,action) => {
  switch (action.type) {
    case AT.GET_ROLE_BYNAME_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
      
      case AT.GET_ROLE_BYNAME_SUCCESS:
      
      
      return {
        ...state,
        loading: false,
        filetrRoleDeptData: action.payload.searchData,
   
      };
    case AT.GET_ROLE_BYNAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};


const getAllUsers = {
  loading: false,
  error: "",
  userData: [],
};
export const GetUsers = (state = getAllUsers, action) => {
  switch (action.type) {
    case AT.GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case AT.GET_USER_SUCCESS:
      
      return {
        ...state,
        loading: false,
        userData: action.payload.data,
      };

    case AT.GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
