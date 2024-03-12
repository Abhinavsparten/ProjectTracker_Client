import axios from "axios"
//basic stucture for all api


export const commonRequest=async (method,url,body,header)=>{
    let config={
        method,
        url,
        headers:header?header:"application/json",
        data:body
    }
    return axios(config).then(response=>{
        console.log(response);
        return response
    }).catch(err=>{
        console.log(err);
        return err
    })
}