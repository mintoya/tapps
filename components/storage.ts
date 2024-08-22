import { MMKV } from 'react-native-mmkv'
import { Platform } from 'react-native';
import * as secureStorage from 'expo-secure-store';
let Storage:any;

if(Platform.OS!="web"){Storage = secureStorage}
else(Storage = new MMKV())

let tabIterator:number = 0;
let taskIterator:number = 0;
function replacer(key:any, value:any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
function reviver(key:any, value:any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

/*
all data
tabs[] group of notes(map)
    tab[array of task indexes]
        task
            title
            color?
            time?
*/

const clearStorage = ()=>{
    if(Platform.OS!='web'){
        console.error("securestore has no clear function")
        clearSecureStore()
    }else{
        Storage.clearAll()
    }
}
const clearSecureStore = async()=>{
    let map = getTabs()
    map.forEach(async (tabname, tabindex) => {
        var [tab,tabindex] = getTab(tabname)
        tab.forEach(async index=>{
            await Storage.deleteItemAsync(index)
        })
        await Storage.deleteItemAsync(tabindex)
    });
    Storage.deleteItemAsync("tabs")

}
const iterate = (type:string):number|null=>{
    switch(type){
        case'tab':
            tabIterator+=1
            return(tabIterator)
        case 'task':
            taskIterator+=1
            return(taskIterator)
        default:
            return(null)
    }
}
const loadFrom = (key:string):string=>{
    if(Platform.OS!='web'){
        var res = Storage.getItem(key)
        switch(res){
            case null:
                throw new Error("key: "+key+" is empty")
            default:
                return(res)
        }
    }else{
        var res = Storage.getString(key)
        switch(res){
            case undefined:
                throw new Error("key: "+key+" is empty")
            default:
                return(res)
        }
    }
}
const initializeTabs = ()=>{
    let tabs: Map<string, string> = new Map<string, string>()
    saveItem("tabs", tabs)
}
const saveTo = (item:string,key:string)=>{
    if(Platform.OS!='web'){
        Storage.setItem(key,item)
        return
    }else{
        Storage.set(key,item)
        return
    }
    
}
const saveItem = (key:string,item:any)=>{
    saveTo(JSON.stringify(item,replacer),key)
}
const loadItem = (key:string):any=>{
    return(JSON.parse(loadFrom(key),reviver))
}
const getTabs = ():Map<string,string>=>{
    let tabs = loadItem("tabs")
    return(tabs)
}
const getTab = (tabname:string):[string[],string]=>{
    var tabs = getTabs()
    var tab = tabs.get(tabname)
    if(tab==undefined){
        throw new Error('tab '+tabname+' doesnt exist')
    }
    return([loadItem(tab),tab])
}
const createTab = (tabName:string)=>{
    var tabs:Map<string,string> = loadItem("tabs")
    var tabIndex = "tab"+iterate('tab')
    //tabs is a map with name:"pointer"
    if(tabs==undefined){
        throw new Error("cannot create tab, tabs is undefined")
    }
    
    tabs.set(tabName,tabIndex)
    saveItem("tabs",tabs)
    saveItem(tabIndex,[])
}
const createTask = (tabname:string,task:Record<string,any>)=>{
    var taskindex = "task"+iterate('task')
    task.adress = taskindex
    var [tab,tabindex] = getTab(tabname)
    tab.push(taskindex)
    saveItem(taskindex,task)
    saveItem(tabindex,tab)
    console.log("createdtask: ",task)
    return(taskindex)
}
const getTasks = (tabname:string):Array<Record<string,any>>=>{
    let notes:Array<Record<string,any>> = []
    let [noteindexes,tabindex] = getTab(tabname)
    for(let index of noteindexes){
        notes.push(loadItem(index))
    }
    return(notes)
}

const tests = ()=>{
    clearStorage()
    initializeTabs()
    console.log(loadItem("tabs"),"loaditem print")
    createTab("tab1")
    let taskindex = createTask('tab1',
        {
            title:'dummyTitleTtile',
            color:'#f0f',
            time:"00:00",
        }
    )
    createTask('tab1',
        {
            title:'dummyTitle',
            time:"00:00",
        }
    )
    createTask('tab1',
        {
            title:'test',
            time:"00:00",
        }
    )
    createTask('tab1',
        {
            title:'test',
            time:"00:00",
            color:'#ff0'
        }
    )
    createTask('tab1',
        {
            title:'test',
            time:"00:00",
        }
    )
}
//tests()



export {tests,createTab,getTab,getTabs,getTasks,createTask,initializeTabs,loadItem}