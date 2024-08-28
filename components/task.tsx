import { ReactNode, useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
import { TouchableView } from "./touchableView";
import colors from "../assets/colors";
import { getTasks, loadItem,saveTask,removeTask } from "./storage";
import Markdown from "react-native-markdown-display";
// markdown-it later?
//import Markdown from 'react-markdown'
import Svg, { Path } from 'react-native-svg'

/*
structure
-task
    title
    color?
    time?
    content?
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
const taskEditor = (taskIndex: string, toggleEdittor: any,visible:boolean,currentTab:string): ReactNode => {

    function color(data:Record<string,any>):ReactNode{
        const ColoredButton = (currentcolor:string,color: string, onpress: any): ReactNode => {
            let bstyle = {
              backgroundColor: color,
              width: 20,
              aspectRatio: 1,
              margin: 2,
              borderColor:colors.urple,
              borderRadius: 5000,
            };
            if(currentcolor==color){
                bstyle = {...bstyle,...{borderWidth:5}}

            }
            return (
              <TouchableView style={bstyle} onPress={onpress}>
                <View />
              </TouchableView>
            );
          };
          function setColorTo(color?:string){
            if(!color){color = '#fff'}
            return(function(){changeSelfCololr(color)})
          }
        return(
            <View
            style={{
              flexDirection: 'row',
            }}>
            {ColoredButton(selfColor,'#ffec99',setColorTo('#ffec99'))}
            {ColoredButton(selfColor,'#ffd43b',setColorTo('#ffd43b'))}
            {ColoredButton(selfColor,'#fab005',setColorTo('#fab005'))}
            {ColoredButton(selfColor,'#f08c00',setColorTo('#f08c00'))}
            {ColoredButton(selfColor,'#e8590c',setColorTo('#e8590c'))}
          </View>
        )
    }

    
    let gdata: Record<string,any>
    
    if(taskIndex=='000'){
        gdata ={title:'dummyTitleTtile',color:'#f0f',time:"00:00",}
    }else{
        
        try{
            gdata =  loadItem(taskIndex)
        }catch(e){
            gdata ={title:'dummyTitleTtile',color:'#f0f',time:"00:00",}
        }
    }
    
    if (!(gdata.content)) {
        gdata.content = "";
    }
    if (!(gdata.color)) {
        gdata.color = "#ffec99";
    }
    const [content, changecontent] = useState(gdata.content)
    const [selfColor, changeSelfCololr] = useState(gdata.color)
    const [theTitle, chagneTitle] = useState(gdata.title)
    const [time, changeTime] = useState(gdata.time)
    const [displayAsMarkDown,setMdDisplay] = useState(false)
    useEffect(
        ()=>{
            if(taskIndex=='000'){
                gdata ={title:'dummyTitleTtile',color:'#f0f',time:"00:00",}
            }else{
                try{
                    gdata =  loadItem(taskIndex)
                }catch(e){
                    gdata ={title:'dummyTitleTtile',color:'#f0f',time:"00:00",}
                }
                
            }
            if (!(gdata.content)) {
                gdata.content = ""
            }
            changeSelfCololr(gdata.color)
            changecontent(gdata.content)
            chagneTitle(gdata.title)
            changeTime(gdata.time)
        },[taskIndex,visible]
    )
    function mddisplay(){
        setMdDisplay(!displayAsMarkDown)
    }
    //unfinished
    const Save = ()=>{
        saveTask(taskIndex,{content:content,title:theTitle,time:time,color:selfColor})
    }
    const Delete = async()=>{
        await removeTask(currentTab,taskIndex)
    //console.log('saving...',taskIndex)
}
    function saveAndClose(){
        toggleEdittor(taskIndex)
        Save()
    }
    async function deleteAndClose(){
        toggleEdittor(taskIndex)
        await Delete()
    }

    
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
            <View key={'colorBox'} style={{...bstyle.most,...{width:'auto',marginRight:'auto'}}}>
                {color(gdata)}
            </View>
            <Text key={'timeBox'} style={bstyle.most}>{time}</Text>
            <View key={'toggle+save'} style = {{height:'auto',flexDirection:'row'}}>
            <TouchableView
                    style={{ ...bstyle.most, ...{width:'auto',marginLeft:5} }}
                    onPress={mddisplay}
                >
                    <Svg width="40" height="20" viewBox=".04 .27 .74 .41">
                        <Path d="M 0.23 0.37 L 0.09 0.54 L 0.23 0.68 M 0.23 0.6 L 0.28 0.45 L 0.31 0.54 L 0.35 0.45 L 0.41 0.59 M 0.51 0.37 L 0.51 0.59 M 0.58 0.52 L 0.51 0.63 L 0.43 0.54 M 0.63 0.38 L 0.73 0.52 L 0.64 0.66" stroke={'white'} strokeWidth="0.05" fill="none" />
                    </Svg>
                </TouchableView>
                <TouchableView
                    style={{ ...bstyle.most, ...{width:'auto',marginLeft:'auto'} }}
                    onPress={deleteAndClose}
                >
                    <Svg width="20" height="20" viewBox=".2 .15 .6 .5">

                        <Path d="M 0.368 0.203 L 0.619 0.202 M 0.261 0.281 L 0.739 0.28 M 0.35 0.348 L 0.4 0.6 M 0.5 0.35 L 0.5 0.6 M 0.65 0.349 L 0.6 0.6" stroke={'white'} strokeWidth="0.1" fill="none" />
                    </Svg>
                </TouchableView>
                <TouchableView
                    style={{ ...bstyle.most, ...{width:'auto',marginLeft:'auto'} }}
                    onPress={saveAndClose}
                >
                    <Svg width="20" height="20" viewBox=".2 .1 .75 .7">
                        <Path d="M 0.375 0.25 Q 0.25 0.25 0.25 0.375 L 0.25 0.6 Q 0.25 0.75 0.375 0.75 L 0.56 0.75 Q 0.75 0.75 0.75 0.6 L 0.75 0.4 Q 0.757 0.25 0.627 0.25 L 0.375 0.25 M 0.35 0.44 L 0.485 0.564 L 0.903 0.159" stroke={'white'} strokeWidth="0.1" fill="none" />
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
                    <ScrollView><Markdown>{content}</Markdown></ScrollView>
                    
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