import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableView } from './components/touchableView';
import colors from './assets/colors';
import Svg, { Path } from 'react-native-svg'
import {TaskListFromTab,Task, taskList} from './components/task';
import { createTask, tests,loadItem, getTabs } from './components/storage';
import { effect, useSignal } from '@preact/signals-react';
import { EventArgs } from 'react-native/Libraries/Performance/Systrace';


export default function App() {
  const [currentTab,setTab] = useState('tab1')
  const [allTasks,setalltasks] = useState<Record<string,any>[]>(()=>taskList(currentTab))
  const [selectTabVisible,setSelectVisible] = useState(false)
  function addtask(task:Record<string,any>){
    createTask(currentTab,task)
    setalltasks(taskList(currentTab))
  }
  function tabchange(){
    setSelectVisible(!selectTabVisible)
  }
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
        <TaSkroll tasks={allTasks} />
        <View id="padding" style={{ flex: 1 }}></View>
        {newTask(currentTab,addtask)}
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
  type ItemProps = { title: string };
  const Item = ({ title }: ItemProps) => (
    <View style={{
      backgroundColor: colors.deepBlue,
    }}>
      <Text style={{
        color: colors.urple,
        fontSize: 25,
      }}>{title}</Text>
    </View>
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
    animationType='slide'
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

const newTask = (currentTab:string,something:any): ReactNode => {
  function makeNote() {
    something({
      title:nttext,
      color:"#fff"
    })
  }
  const [nttext,setText] = useState('New...')
  return (
    <View
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
    </View>
  )
}
const TaSkroll = ({tasks}:{tasks:Array<Record<string,any>>}): ReactNode => {
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
          {TaskListFromTab(tasks)}
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
