"use strict";
// import axios, { AxiosResponse } from "axios"
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.ensureAccessToken = void 0;
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
var ensureAccessToken = function (_target, _propertyKey, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.accessToken)
            throw new Error("Access Token not available. Make sure to invoke login first");
        var result = originalMethod.apply(this, args);
        return result;
    };
    return descriptor;
};
exports.ensureAccessToken = ensureAccessToken;
var catchError = function (_target, _propertyKey, descriptor) {
    var method = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            return method.apply(this, args);
        }
        catch (error) {
            throw new Error("Error during message. Server returned: ".concat(error));
        }
    };
};
exports.catchError = catchError;
