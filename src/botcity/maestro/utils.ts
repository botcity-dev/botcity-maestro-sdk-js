// import axios, { AxiosResponse } from "axios"

import { BotMaestroSdk } from "./sdk";

// export async function doRequest(url: string, data: object, type: string) {
//     try {
//       if (!type) {
//         throw new Error("Type not exists")
//       }
      
//       const res = await getRes(url, data, type)
//       console.log(`Status: ${res.status}`);
//       console.log('Body: ', res.data);
//   } catch (err) {
//       console.error(err);
//   }
// }

// export const getRes: IGetRes = async (url, data, type) => {
//   let res;

//   if (type === "get") 
//     res = await axios.get(url, data)
  
//   else if (type === "post")
//     res = await axios.post(url, data)
    
//   else if (type === "delete")
//     res = await axios.delete(url, data)
  
//   else if (type === "put")
//     res = await axios.delete(url, data)
//   else
//     throw new Error("Type not exists")
  
//     return getRes
// }


export const ensureAccessToken = (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: BotMaestroSdk, ...args: any) {
        if(!this.accessToken)
            throw new Error("Access Token not available. Make sure to invoke login first")
      const result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
}


export const catchError = (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(this: BotMaestroSdk, ...args: any) {
        try {
            return method.apply(this, args);
        } catch(error: any) {
            throw new Error(`Error during message. Server returned: ${error}`);
        }
    };
}
