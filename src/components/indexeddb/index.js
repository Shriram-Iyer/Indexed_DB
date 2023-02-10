import { item } from '../item'
const idb = window.indexedDB
export const createDB = (dbname, version) => {
    const request = idb.open(dbname,version)
    request.onupgradeneeded = (e) => {
        let db = request.result;
        if (!request.result.objectStoreNames.contains('MasterData')) {
            const objectstore = db.createObjectStore("MasterData")
            objectstore.createIndex('price','price',{unique:false})
            objectstore.onsuccess = () =>{
                console.log("objectStore created!")
            }
            objectstore.onerror = () => {
                console.log("error occured!")
            }
              
        }
    };
    request.onsuccess = (e) => {
        let db = request.result;
        console.log("request.onsuccess")
        let tx = db.transaction("MasterData", "readwrite")
        console.log("after tx")
        console.log(tx)
        let dataObjectStore = tx.objectStore("MasterData")
        console.log(dataObjectStore)
        item.forEach(i=>{
          dataObjectStore.put(i,i.key)
        })
        request.result.close()
    }
    request.onerror = e => {
        console.log("error while opening IDB!")
    }
}
export const getData = async () => {
    let DBName = "UnifoIndexedDB"
    let request = idb.open(DBName)
    let db, dbExists = true;
    return new Promise((resolve, reject) => {
        //if the IDB exists return the keys else returns an empty array
        request.onupgradeneeded = (e) => {
            if (request.result.version === 1) {
              dbExists = false;
              window.indexedDB.deleteDatabase(DBName);
              resolve([])
            }
        }
        request.onsuccess = () => {
            if (dbExists) {
                // alert("DB  exist")
                db = request.result;
                let tx = db.transaction('MasterData', "readonly")
                let dataObjectStore = tx.objectStore('MasterData')
                let getAllRequest = dataObjectStore.getAll();
                getAllRequest.onsuccess = function () {
                    console.log(getAllRequest.result)
                    resolve(getAllRequest.result)
                }
            }
            request.result.close()
        }
    })
}

export const addData = async (putData) => {
    let DBName = "UnifoIndexedDB"
    let version = 1
    let request = idb.open(DBName, version)
    request.onsuccess = e => {
        let db = request.result;
        let dataObjectStore = db.transaction("MasterData", "readwrite").objectStore("MasterData")
        let requestAdd = dataObjectStore.put(putData, putData.key);
        requestAdd.onerror = function (event) {
          console.log("unable to add the key value pair ")
        };
        requestAdd.onsuccess = function (event) {
          console.log("successfully added  key value pair ")
        };
        request.result.close()
    }
}

export const deleteData = async (deleteKey) => {
    let DBName = "UnifoIndexedDB"
    let version = 1
    let request = idb.open(DBName, version)
    request.onsuccess = e => {
        let db = request.result;
        let dataObjectStore = db.transaction("MasterData", "readwrite").objectStore("MasterData")
        let requestDelete = dataObjectStore.delete(deleteKey);
        requestDelete.onerror = function (event) {
          console.log("unable to delete the key value pair ")
        };
        requestDelete.onsuccess = function (event) {
          console.log("successfully deleted the key value pair ")
        };
        request.result.close()
    }
}
export const getFilteredData = async (min, max) => {
  let DBName = "UnifoIndexedDB"
  let version = 1
  let request = idb.open(DBName, version)
  let db, dbExists = true;
  if(min && max){
    const keyRange = IDBKeyRange.bound(parseInt(min),parseInt(max),false,false)
    return new Promise((resolve, reject) => {
      //if the IDB exists return the keys else returns an empty array
      request.onupgradeneeded = (e) => {
        if (request.result.version === 1) {
        dbExists = false;
        window.indexedDB.deleteDatabase(DBName);
        resolve([])
        }
      }
      request.onsuccess=(event)=>{
        if (dbExists) {
          // alert("DB  exist")
          db = request.result;
          if(db.objectStoreNames.contains('MasterData')){
            let tx = db.transaction('MasterData', "readonly")
            let dataObjectStore = tx.objectStore('MasterData')
            let indexedDataStore = dataObjectStore.index("price")
            let getAllRequest = indexedDataStore.getAll(keyRange);
            getAllRequest.onsuccess = function () {
              console.log(getAllRequest.result)
              resolve(getAllRequest.result)
            }
          }
          request.result.close()   
        }
      }
    })
  }
    
}
 