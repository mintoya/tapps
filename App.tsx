import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableView } from './components/touchableView';
import colors from './assets/colors';
import Svg, { Path } from 'react-native-svg'
import Task from './components/task';

export default function App() {
  const taskname = "taskList1";
  return (
    <View style={styles.container}>
      {Tabs(taskname)}
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
        {taSkroll()}
        <View id="padding" style={{ flex: 1 }}></View>
        {newTask()}
      </View>
      <StatusBar hidden={true} style="auto" />
    </View>
  );
}
const Tabs = (tabName: string): ReactNode => {
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
        onPress={() => { console.log('tabcall') }}
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
const newTask = (): ReactNode => {
  const [text,setText] = useState('New...')
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
        value={text}
        onChangeText={setText}
      />
      <TouchableView
        onPress={() => { console.log('tabcall') }}
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
const taSkroll = (): ReactNode => {
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
          {Task({
            title: "tTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "te2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
                    {Task({
            title: "tempTask",
            color: "#fff",
            time: "11:30"
          })}
          {Task({
            title: "tempTask2",
            time: "9:40",
          })}
          {Task({
            title: "tempTask3",
            color: "#0f0",
          })}
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
