window.addEventListener('load', ()=>{
    
    const indexedDB = window.indexedDB || window.mozIndexdedDB
|| window.webkitIndexedDB || msIndexedDB || window.shimIndexedDB;

let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded =({target})=>{
    const db = target.result;
    db.createObjectStore('pending', {autoIncrement: true})
};

request.onsuccess = ({target}) =>{
    db = target.result;
    navigator.onLine ? checkDB() : ''
}

request.onerror = (event)=>{
    console.log(event.target.errorCode);
};

function saveRecord(data){
    console.log('saving record in db!', data)
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending')
    store.add(data)
}

function checkDB(){
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    console.log('checkDB running!')
    
    getAll.onsuccess = function(){
        console.log(getAll.result)
        if(getAll.result.length){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain',
                    "Content-Type": 'application/json'
                }
            }).then(response=>{
                console.log(response)
            }).catch(err=>console.log(err))
        }
    }
    navigator.onLine ? checkDB() : ''
}
})