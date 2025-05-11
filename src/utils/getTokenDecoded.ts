import jwt from 'jsonwebtoken'
import { auth } from './auth'


export default async function getTokenDecoded(token: string){
    if(typeof(jwt.verify(token, auth.secret)) == String.prototype){
        return JSON.parse(jwt.verify(token, auth.secret).toString())
    }else{
        return jwt.verify(token, auth.secret)
    }
}