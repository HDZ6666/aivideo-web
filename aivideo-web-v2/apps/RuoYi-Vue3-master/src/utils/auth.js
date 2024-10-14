/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2023-11-21 11:32:25
 * @LastEditors: ZCR
 * @LastEditTime: 2023-11-21 16:17:15
 */
import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export function getToken() {
    return Cookies.get(TokenKey)
    /* const token =
        'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImQ2YjFlZjIwLTJjMDktNGVjYS04ZmQ2LWMyNjhmZTFmMDY0NCJ9.KWo8CZxHt1tc6SW1vnoCtY4U5DdhghrxID83vMEReNUkuY0q1E5CRs8xIERGS0avUuwvT59FL7MdlljEjA-UvA';
    return token; */
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
