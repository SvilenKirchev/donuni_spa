const appKey = 'kid_BkNqrfhsB';
const appSecret = 'c47200ecba934923891161212bfe934a';
const baseUrl = 'https://baas.kinvey.com';

function createAuthorization(type) {
    return type === 'Basic'
        ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
        : `Kinvey ${sessionStorage.getItem('authtoken')}`
}

function makeHeaders(type, httpMethod, data) {

    const headers = {
        method: httpMethod,
        headers: {
            'Authorization': createAuthorization(type),
            'Content-Type': 'application/json'
        }
    };

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data)
    }
    return headers;
}

function serializeData(x) {
    if (x.status === 204){
        return x;
    }
    return x.json();
}

function handleError(e) {
    if (!e.ok) {
        console.log(e);
        throw new Error(e.statusText);
    }
    return e;
}

function createPromise(kinveyModule, endpoint, headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`;

    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

export function get(type, kinveyModule, endpoint) {
    const headers = makeHeaders('GET');
    return createPromise(kinveyModule, endpoint, headers)
}

export function post(type, kinveyModule, endpoint, data) {
    const headers = makeHeaders(type, 'POST', data);
    return createPromise(kinveyModule, endpoint, headers)
}

export function put(type, kinveyModule, endpoint, data) {
    const headers = makeHeaders(type, 'PUT', data);
    return createPromise(kinveyModule, endpoint, headers)
}

export function del(type, kinveyModule, endpoint) {
    const headers = makeHeaders(type, 'DELETE');
    return createPromise(kinveyModule, endpoint, headers)
}