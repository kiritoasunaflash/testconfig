import Cookies from "js-cookie";
export const setToken=(token)=>{
   return Cookies.set('token',token)
}
export const getToken=()=>{
   return Cookies.get('token')
}
export const removeToken=()=>{
   return Cookies.remove('token')
}