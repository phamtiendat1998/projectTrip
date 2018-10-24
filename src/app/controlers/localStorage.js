export function saveLocalStorage(name, data) {
    var localObj = JSON.stringify(data);
    localStorage.setItem(name, localObj);
}

export function checkExistLocal(localName) {
    var localObj = localStorage.getItem(localName);
    if (localObj !== null) {
        return true;
    }
    return false;
}

export function getDataFromLocal(name) {
    return JSON.parse(localStorage.getItem(name));
}

export function delDataFromLocal(name) {
    localStorage.removeItem(name);
}