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
                console.error("key: ",key," is empty")
                return("")
            default:
                return(res)
        }
    }else{
        var res = Storage.getString(key)
        switch(res){
            case undefined:
                console.error("key: ",key," is empty")
                return("")
            default:
                return(res)
        }
    }
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
    return(loadItem("tabs"))
}
const getTab = (tabname:string):[string[],string]=>{
    var tabs = getTabs()
    var tab = tabs.get(tabname)
    if(tab==undefined){
        console.error('tab doesnt exist')
        throw("tab doesnt exist")
    }
    return([loadItem(tab),tab])
}
const createTab = (tabName:string)=>{
    var tabs:Map<string,string> = loadItem("tabs")
    var tabIndex = "tab"+iterate('tab')
    //tabs is a map with name:pointer
    if(tabs==undefined){console.error("tabs createtab is undefined")}
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
    return(taskindex)
}
const getTasks = (tabname:string)=>{
    let notes = []
    let [noteindexes,tabindex] = getTab(tabname)
    console.log(noteindexes)
    for(let index of noteindexes){
        notes.push(loadItem(index))
    }
    return(notes)
}
let tabs:Map<string,string> = new Map<string,string>()
saveItem("tabs",tabs)

const tests = ()=>{
    //console.log(loadItem("tabs"),"loaditem print")
    createTab("tab1")
    let taskindex = createTask('tab1',
        {
            title:'dummyTitle',
            color:'#fff',
            time:"00:00",
        }
    )
    createTask('tab1',
        {
            title:'dummyTitle',
            color:'#fff',
            time:"00:00",
        }
    )
    //console.log(taskindex,loadItem(taskindex))
    console.log(getTasks('tab1'))
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

export {tests,createTab,getTab,getTasks,createTask}