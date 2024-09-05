import { MMKV } from 'react-native-mmkv'
import { Platform } from 'react-native';
import * as secureStorage from 'expo-secure-store';
let Storage: any;

if (Platform.OS != "web") { Storage = secureStorage }
else{Storage = new MMKV()}

let tabIterator: number = 0;
let taskIterator: number = 0;

const loadFrom = (key: string): string => {
    //console.log("loading : "+key)
    if (typeof key != "string") {
        throw new Error((typeof key) + " is invalid key type")
    }
    if (Platform.OS != 'web') {
        var res = Storage.getItem(key)
        switch (res) {
            case null:
                throw new Error("key: " + key + " is empty")
            default:
                return (res)
        }
    } else {
        var res = Storage.getString(key)
        switch (res) {
            case undefined:
                throw new Error("key: " + key + " is empty")
            default:
                return (res)
        }
    }
}
const saveTo = (item: string, key: string) => {
    if (Platform.OS != 'web') {
        Storage.setItem(key, item)
        return
    } else {
        Storage.set(key, item)
        return
    }

}

const removeItem = async (itemIndex: string) => {
    if (Platform.OS !== 'web') {
        try {
            await Storage.deleteItemAsync(itemIndex); // SecureStore requires async call
            console.log(`Removed item: ${itemIndex} from SecureStore`);
        } catch (error) {
            console.error(`Failed to remove item from SecureStore: ${itemIndex}`, error);
        }
    } else {
        try {
            Storage.removeItem(itemIndex); // MMKV uses removeItem method
            console.log(`Removed item: ${itemIndex} from MMKV`);
        } catch (error) {
            console.error(`Failed to remove item from MMKV: ${itemIndex}`, error);
        }
    }
};


function replacer(key: any, value: any) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}
function reviver(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

const saveItem = (key: string, item: any) => {
    saveTo(JSON.stringify(item, replacer), key)
    console.log(`Saved item to ${key}`);

}
const loadItem = (key: string): any => {
    try { return (JSON.parse(loadFrom(key), reviver)) } catch (e) { console.log(e, key); throw e }
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

const removeTask = (tabname: string, taskindex: string) => {
    console.log("removing: ", taskindex, " from: ", tabname)
    let [tab, tabindex] = getTab(tabname)
    tab = tab.filter((e) => { return (e != taskindex) })
    saveItem(tabindex,tab)
    removeItem(taskindex)
}

const removeTab =  (tabName: string) => {
    let map = getTabs()
    var [tab, tabindex] = getTab(tabName)
    tab.forEach( index => {
        removeItem(index)
    })
    map.delete(tabName)
    removeItem(tabindex)
    saveItem("tabs", map)
}

const clearStorage = () => {
    if (Platform.OS != 'web') {
        console.warn("securestore has no clear function")
        clearSecureStore()
    } else {
        Storage.clearAll()
    }
}


const clearSecureStore = async () => {
    let map = getTabs()
    map.forEach(async (tabname, tabindex) => {
        var [tab, tabindex] = getTab(tabname)
        tab.forEach(async index => {
            await Storage.deleteItemAsync(index)
        })
        await Storage.deleteItemAsync(tabindex)
    });
    Storage.deleteItemAsync("tabs")

}
const iterate = (type: string): number | null => {
    switch (type) {
        case 'tab':
            tabIterator += 1
            return (tabIterator)
        case 'task':
            taskIterator += 1
            return (taskIterator)
        default:
            return (null)
    }
}
const initializeStorage = () => {
    try { loadItem("tabs") } catch (e) {
        let tabs: Map<string, string> = new Map<string, string>()

        saveItem("tabs", tabs)
        createTab("Main Tab")
    }
    try{getTab("Main Tab")}catch(e){createTab("Main Tab")}

}


const getTabs = (): Map<string, string> => {
    let tabs = loadItem("tabs")
    return (tabs)
}
const getTab = (tabname: string): [string[], string] => {
    var tabs = getTabs()
    var tab = tabs.get(tabname)
    if (tab == undefined) {
        throw new Error('tab ' + tabname + ' doesnt exist')
    }
    return ([loadItem(tab), tab])
}
const createTab = (tabName: string,contents?:string[]) => {
    if(contents){contents = contents}else{contents = []}
    var tabs: Map<string, string> = loadItem("tabs")
    var tabIndex = "tab" + iterate('tab')
    //tabs is a map with name:"pointer"
    if (tabs == undefined) {
        throw new Error("cannot create tab, tabs is undefined")
    }

    tabs.set(tabName, tabIndex)
    saveItem("tabs", tabs)
    saveItem(tabIndex, contents)
}
const createTask = (tabname: string, task: Record<string, any>) => {
    var taskindex = "task" + iterate('task')
    task.adress = taskindex
    var [tab, tabindex] = getTab(tabname)
    tab.push(taskindex)
    saveItem(taskindex, task)
    saveItem(tabindex, tab)
    console.log(`created task ${taskindex} at ${tabname}`)
    return (taskindex)
}
const saveTask = (taskIndex: string, taskData: Record<string, any>) => {
    try {
        loadItem(taskIndex)
    } catch (e) {
        console.log(taskIndex)
        throw new Error('could not load item, key might be incorrect at saveTask? ')
    }
    // console.log('previous task: ', loadItem(taskIndex))
    // console.log('merging task:  ',taskData)
    // console.log('result',{...loadItem(taskIndex), ...taskData})
    let newtask = {
        ...loadItem(taskIndex), ...taskData
    }
    saveItem(taskIndex, newtask)
}
const getTasks = (tabname: string): Array<Record<string, any>> => {
    console.log(`getting tasks from ${tabname}`)
    let notes: Array<Record<string, any>> = []
    let [noteindexes, tabindex] = getTab(tabname)
    console.log(noteindexes)
    for (let index of noteindexes) {
        let note = loadItem(index)
        if (!note.adress) {
            console.warn('note without adress at :', index)
        }
        notes.push(loadItem(index))
    }
    return (notes)
}

const tests = () => {
    clearStorage()
    initializeStorage()
    console.log(loadItem("tabs"), "loaditem print")
    createTab("tab1")
    createTab("tab2")
    let taskindex = createTask('tab1',
        {
            title: 'dummyTitleTtile',
            color: '#f0f',
            time: "00:00",
        }
    )
    createTask('tab1',
        {
            title: 'dummyTitle',
            time: "00:00",
        }
    )
    createTask('tab1',
        {
            title: 'test',
            time: "00:00",
        }
    )
    createTask('tab1',
        {
            title: 'test',
            time: "00:00",
            color: '#ff0'
        }
    )
    createTask('tab1',
        {
            title: 'test',
            time: "00:00",
        }
    )
}
initializeStorage()
//tests()



export { tests, createTab, getTab, getTabs, getTasks, createTask, initializeStorage, saveTask, loadItem, removeTask,removeTab }