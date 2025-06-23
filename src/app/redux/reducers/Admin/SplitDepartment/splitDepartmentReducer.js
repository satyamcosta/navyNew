import * as AT from "app/camunda_redux/redux/constants/ActionTypes"

const roleDataInitState ={
    allRoles:[],
    departmentData:{},
    subSec:[],
    error:"",
    loading:false
}

export const getroledatavaluesReducer = (state = roleDataInitState,action)=>{
switch (action.type) {
    case AT.GET_DEPARTMENT_ROLEVALUE_REQUEST:
        return {
            ...state,
            loading:true
        }
    case AT.GET_DEPARTMENT_ROLEVALUE_SUCCES:
        return {
            ...state,
            loading:false,
            allRoles:action.payload.allRoles,
            departmentData:action.payload.department,
            subSec:action.payload.subSec
        }
        
        case AT.GET_DEPARTMENT_ROLEVALUE_REQUEST:
            return {
                ...state,
                loading:false,
                error:action.payload.error
            }

    default:
       return state
}
}