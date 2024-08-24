import { ReactNode, useEffect, useReducer, useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { TouchableView } from "./touchableView";
import colors from "../assets/colors";
import { getTasks, createTab, loadItem,saveTask } from "./storage";
import Markdown from "react-native-markdown-display";
import Svg, { Path } from 'react-native-svg'

/*
structure
-task
    title
    color?
    time?
*/
const Task = ({ data,onTask }: { data: Record<string, any>,onTask:any }): ReactNode => {
    var hasTime: Boolean = false
    var hasColor: Boolean = false
    if (data.time) { hasTime = true }
    if (data.color) { hasColor = true }
    function clickdebug(){
        //console.log('clicked: ',data.adress)
        onTask()
    }
    return (
        <TouchableView
            style={{
                backgroundColor: colors.liteBlue,
                flexGrow: 1,
                borderRadius: 10,
                flexDirection: 'column',
                margin: 20,
                alignItems: 'center',
                padding: 10,
            }}
            onPress={clickdebug}
        >
            <View
                style={{ flexDirection: 'row' }}>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 18,
                        marginRight: 10,
                    }}
                >{data.title}</Text>

                {hasColor ? (
                    <TouchableView
                        style={{
                            backgroundColor: data.color,
                            borderRadius: 999,
                            width: 20,
                            margin: 5,
                            marginLeft: 'auto',
                            aspectRatio: 1,
                        }}
                    ><Text></Text></TouchableView>
                ) : (
                    <View></View>
                )
                }
            </View>

            {hasTime ? (
                <Text
                    style={{
                        color: 'white',
                        fontSize: 8,
                        marginHorizontal: 5,
                    }}>{data.time}</Text>
            ) : (
                <View></View>
            )
            }
        </TouchableView>
    )

}
const taskList = (tabName: string): Array<Record<string, any>> => {
    var tasks = getTasks(tabName)
    return tasks
}
const TaskListFromTab = (tasklist: Record<string, any>[],onTask:any) => {
    var taskItems = new Array<ReactNode>
    for (let t of tasklist) {
        if(t.adress==undefined){
            console.error('task is malformed',t)
        }else{
        taskItems.push(<Task key={t.adress} onTask={onTask(t.adress)} data={t} />)
        }
    }
    return taskItems
}
const taskEditor = (taskIndex: string, toggleEdittor: any,visible:boolean): ReactNode => {
    let gdata =  loadItem(taskIndex)
    if (!(gdata.content)) {
        gdata.content = ""
    }
    const [content, changecontent] = useState(gdata.content)
    const [theTitle, chagneTitle] = useState(gdata.title)
    const [time, changeTime] = useState(gdata.time)
    useEffect(
        ()=>{
            gdata = loadItem(taskIndex)
            if (!(gdata.content)) {
                gdata.content = ""
            }
            changecontent(gdata.content)
            chagneTitle(gdata.title)
            changeTime(gdata.time)
        },[taskIndex]
    )
    //unfinished
    const Save = ()=>{
        //console.log('saving...',taskIndex)
        saveTask(taskIndex,{content:content,title:theTitle,time:time})
    }
    function saveAndClose(){
        toggleEdittor(taskIndex)
        Save()
    }

    let displayAsMarkDown = false
    let bstyle = StyleSheet.create({
        most: {
            borderRadius: 20,
            backgroundColor: colors.liteBlue,
            color: 'white',
            padding: 10,
            margin: 10,
        }
    })
    return (
        (visible?( <View style={{ backgroundColor: colors.trasnparent, width: '100%', height: '100%', flexDirection: 'column' }}>
            <TextInput key={'titleBox'} style={{
                ...bstyle.most, ...{
                    width: '50%',
                    maxWidth: 700,
                }
            }}
                value={theTitle}
                onChangeText={chagneTitle}
            />
            <View key={'colorBox'} style={bstyle.most}></View>
            <Text key={'timeBox'} style={bstyle.most}>{time}</Text>
            <View key={'toggle+save'} style = {{height:'auto'}}>

                <TouchableView
                    style={{ ...bstyle.most, ...{backgroundColor:'black',width:'auto',marginLeft:'auto'} }}
                    onPress={saveAndClose}
                >
                    <Svg width="20" height="20" viewBox="0 0 1 1">
                        <Path d="M 0.375 0.25 Q 0.25 0.25 0.25 0.375 L 0.25 0.6 Q 0.25 0.75 0.375 0.75 L 0.56 0.75 Q 0.75 0.75 0.75 0.6 L 0.75 0.4 Q 0.757 0.25 0.627 0.25 L 0.375 0.25 M 0.35 0.44 Q 0.503 0.711 0.819 0.176" stroke={'white'} strokeWidth="0.1" fill="none" />
                    </Svg>
                </TouchableView>
            </View>
            <View style={{
                ...bstyle.most, ...{
                    height: 'auto',
                    flex: 1,
                }
            }}>
                {displayAsMarkDown ? (
                    <Markdown>{content}</Markdown>
                ) : (
                    <TextInput
                        style={{ height: 'auto', flex: 1, }}
                        multiline={true}
                        value={content}
                        onChangeText={changecontent} />
                )}
            </View>


        </View>):(<View/>))
       
    )
}
export { Task, TaskListFromTab, taskList, taskEditor }