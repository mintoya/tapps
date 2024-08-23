import { StatusBar } from 'expo-status-bar';
import { JSX, JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableView } from './components/touchableView';
import colors from './assets/colors';
import Svg, { Path } from 'react-native-svg'
import {TaskListFromTab,Task, taskList, taskEditor} from './components/task';
import { createTask, tests,loadItem, getTabs } from './components/storage';
import { effect, useSignal } from '@preact/signals-react';


export default function App() {
  const [currentTab,setTab] = useState('tab1')
  const [allTasks,setalltasks] = useState<Record<string,any>[]>(()=>taskList(currentTab))
  const [selectTabVisible,setSelectVisible] = useState(true)
  const [editing,seteditingMode] = useState(false)
  const [currentTask,setCurrentTask]= useState<string>('task1')
  function addtask(task:Record<string,any>){
    createTask(currentTab,task)
    setalltasks(taskList(currentTab))
  }
  function tabchange(){
    setSelectVisible(!selectTabVisible)
  }
  function editorToggle(tabName:string){
    if(typeof tabName !='string'){
      console.log('undefinedToggle')
      seteditingMode(!editing)
    }else{
      console.log('definedToggle',tabName)
      setCurrentTask(tabName)
      seteditingMode(!editing)
    }
    
  }
  useEffect(()=>{
    setalltasks(taskList(currentTab))
  },[currentTab,editing])
  // useEffect(()=>{setalltasks(TaskListFromTab(currentTab))},[allTasks])
  return (
    <View style={styles.container}>
      {modalTabs(currentTab,setTab,selectTabVisible,tabchange,80)}
      {Tabs(currentTab,tabchange)}
      <View
        id="notes+createnote"
        style={{
          marginBottom: 0,
          paddingBottom: 0,
          height: 'auto',
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.lowBlue,
          flex: 1
        }}
      >
        {taskEditor(currentTask,editorToggle,editing)}
        <TaSkroll tasks={allTasks} onTask = {editorToggle} />
        <View id="padding" style={{ flex: 1 }}></View>
        {newTask(currentTab,addtask,!editing)}
      </View>
      
      <StatusBar hidden={true} style="auto" />
    </View>
  );
}
const Tabs = (tabName: string,tabchanger:any): ReactNode => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: colors.urple,
          padding: 20,
          marginRight: 'auto',
        }}
      >{tabName}</Text>
      <TouchableView
        onPress={tabchanger}
        style={{
          marginRight: 10,
          padding: 20,
        }}
      >
        <Svg width="20" height="20" viewBox="0 0 1 1">
          <Path d="M 0.25 0.75 L 0.5 0.35 L 0.75 0.75" stroke={colors.urple} strokeWidth="0.1" fill="none" />
        </Svg>
      </TouchableView>
    </View>
  )
}
const modalTabs = (currentTab:string,tabSet:any,visible:boolean,visibleChanger:any,topSpace:number):ReactNode=>{
  function useTabSet(tab:string){
    return(function(){
      tabSet(tab)
      visibleChanger()

    })
  }
  type ItemProps = { title: string };
  const Item = ({ title }: ItemProps) => (
    <TouchableView style={{
      backgroundColor: colors.deepBlue,
      flexDirection:'row',
      width:'100%',
    }}
    onPress={useTabSet(title)}
    >
      
      <Text style={{
        color: colors.urple,
        fontSize: 25,
        marginRight:'auto'
      }}>{title}</Text>
      {(currentTab==title)?(
        <Text style = {{
        color: colors.urple,
        margin:5,
        fontSize: 25
      }}>{'>'}</Text>):(
      <Text style = {{
        margin:5,
        color: colors.urple,
        fontSize: 25
      }}>{'^'}</Text>)}
    </TouchableView>
  );
  let DATA: Array<any>= [];
  getTabs().forEach(
    (tabindex:string,tab:string)=>{
      DATA.push({
        title:tab,
        id:tabindex
      })
    }
  )

  return(
    <Modal
    visible = {visible}
    transparent = {true}
    animationType='fade'
    onRequestClose={visibleChanger}
    >
      <Pressable key = "viewcloesr" style={{width:'100%',height:'100%'}} onPress={visibleChanger}>
      <TouchableView
      onPress={()=>{}}
      style = {{
        marginTop:topSpace,
        borderRadius:20,
        marginHorizontal:'auto',
        width:'95%',
        height:'50%',
        maxHeight:1000,
        minHeight:400,
        padding:20,
        backgroundColor:colors.deepBlue
      }}
      >
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={item => item.id}
        />
      </TouchableView>
      </Pressable>

    </Modal>
  )
}

const newTask = (currentTab:string,something:any,visible:boolean): ReactNode => {
  function makeNote() {
    something({
      title:nttext,
      color:"#fff"
    })
  }
  const [nttext,setText] = useState('New...')
  return (
    (visible?(    <View
      style={{
        backgroundColor: colors.deepBlue,
        borderRadius: 999,
        width: '90%',
        marginBottom: 10,
        marginTop: 'auto',
        marginHorizontal: 'auto',
        flexDirection: 'row-reverse',
      }}
    >
      <TextInput
        style={{
          width:'70%',
          fontSize: 20,
          color: colors.urple,
          padding: 20,
          marginLeft: 'auto',
        }}
        multiline = {true}
        value={nttext}
        onChangeText={setText}
      />
      <TouchableView
        onPress= {makeNote}
        style={{
          marginRight: 10,
          marginBottom: 3,
          padding: 20,
        }}
      >
        <Svg width="30" height="30" viewBox="0 0 1 1">
          <Path d="M 0.2 0.5 L 0.8 0.5 M 0.5 0.2 L 0.5 0.8" stroke={colors.urple} strokeWidth="0.1" fill="none" />
        </Svg>
      </TouchableView>
    </View>):(<View/>))

  )
}
const TaSkroll = ({tasks,onTask}:{tasks:Array<Record<string,any>>,onTask:any}): ReactNode => {
  function nonTask(taskName:string){
    return(()=>{
      onTask(taskName)
    })
  }
  return (
      <ScrollView
      style ={{
        width: '99%',
        flexWrap: 'nowrap',
      }}
      >
        <View
        style = {{
          flexDirection: 'row',
          justifyContent:'space-evenly',
          flexShrink: 0,
          padding: 10,
          flexWrap: 'wrap',
          width: '100%',
        }}>
          {TaskListFromTab(tasks,nonTask)}
        </View>

      </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepBlue,
  },
});
