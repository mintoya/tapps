import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
const Storage = new MMKVLoader().initialize();
const loadFrom = async(key:string):Promise<string>=>{
    var result = await Storage.getStringAsync('key');
    if(result==null){
        console.error('position is null?')
        return('')
    }else if(result==undefined){
        console.error('position is undefined?');
        return('');
    }
    return(result)
}
const saveTo = async(item:string,key:string)=>{
    await Storage.setStringAsync(key,item)
}
export {loadFrom,saveTo}