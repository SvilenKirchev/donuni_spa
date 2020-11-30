import {post} from "./requester.js";
import {getPartials, setHeaderInfo} from "./shared.js";
import {displayError} from "./shared.js";
import {displaySuccess} from "./shared.js";

function saveAuthInfo(userInfo) {
    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('userId', userInfo._id);
}

export function getRegister (context) {
    this.loadPartials(getPartials())
        .partial('./views/auth/register.hbs')
}

export function postRegister (context) {
    const {username, password, rePassword} = context.params;

    if (username && password === rePassword){
        post('Basic', 'user', '', {username, password})
            .then((userInfo) => {
                saveAuthInfo(userInfo);
                //displaySuccess('Register Success!');
                context.redirect('#/home');
            })
            .catch(console.error)
        //() => displayError('Something went wrong!')
    }
}

export function getLogin (context) {
    this.loadPartials(getPartials())
        .partial('./views/auth/login.hbs')
}

export function postLogin (context) {
    const {username, password} = context.params;

    if (username && password){
        post('Basic', 'user', 'login', {username, password})
            .then((userInfo) => {
                saveAuthInfo(userInfo);
                //displaySuccess('Login Success!');
                context.redirect('#/home');
            })
            .catch(console.error)
        //() => displayError('Something went wrong!')
    }
}

export function logout(context) {
    post('Kinvey', 'user', '_logout', {})
        .then(() => {
            sessionStorage.clear();
            context.redirect('#/home')
        })
        .catch(console.error)
}