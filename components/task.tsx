import { ReactNode } from "react";
import { Text,View } from "react-native";
import { TouchableView } from "./touchableView";
import colors from "../assets/colors";
import { initializeTabs, getTasks, createTab } from "./storage";

/*
structure
-task
    title
    color?
    time?
*/
const Task = ({data}:{data:Record<string,any>}):ReactNode=>{
    var hasTime:Boolean = false
    var hasColor:Boolean = false
    if(data.time){hasTime=true}
    if(data.color){hasColor = true}
    return(
        <TouchableView
        style = {{
            backgroundColor:colors.liteBlue,
            flexGrow:1,
            borderRadius:10,
            flexDirection:'column',
            margin:20,
            alignItems:'center',
            padding:10,
        }}
        >
            <View
            style = {{flexDirection:'row'}}>
            <Text
            style={{
                color:'white',
                fontSize:18,
                marginRight:10,
            }}
            >{data.title}</Text>

            {hasColor?(
                <TouchableView
                style={{
                    backgroundColor:data.color,
                    borderRadius:999,
                    width:20,
                    margin:5,
                    marginLeft:'auto',
                    aspectRatio:1,
                }}
                ><Text></Text></TouchableView>
                ):(
                <View></View>
                )
            }
        </View>

            {hasTime?(
                <Text
                style={{
                    color:'white',
                    fontSize:8,
                    marginHorizontal:5,
                }}>{data.time}</Text>
                ):(
                <View></View>
                )
            }
        </TouchableView>
    )

}
const taskList = (tabName:string):Array<Record<string,any>>=>{
    var tasks = new Array<Record<string,any>>
    try {
        tasks = getTasks(tabName)
    } catch (error) {
        if(!(error instanceof Error)){
            throw error
        }
        if(error.message==='tab doesnt exist'){
            createTab(tabName)
        }
        tasks = getTasks(tabName)
    }
    return tasks
}
const TaskListFromTab = (tasklist:Record<string,any>[])=>{
    var taskItems = new Array<ReactNode>
    for(let t of tasklist){
        taskItems.push(<Task key ={t.adress} data = {t}/>)
    }
    return taskItems
}
export {Task,TaskListFromTab,taskList}