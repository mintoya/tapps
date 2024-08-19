import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableView } from './components/touchableView';
import { loadFrom } from './components/storage';
import Svg,{Path} from 'react-native-svg'

export default function App() {
  const taskname = "taskList1";
  return (
    <View style={styles.container}>
      {Tabs(taskname)}
      <StatusBar style="auto" />
    </View>
  );
}
const Tabs = (tabName: string): ReactNode => {
  return (
    <View
    style = {{
      backgroundColor:colors.deepBlue,
      borderRadius:999,
      width:'90%',
      marginBottom:10,
      marginTop:'auto',
      flexDirection:'row',
    }}
    >
      <Text
      style = {{
        color:colors.urple,
        padding:20,
      }}
      >{tabName}</Text>
      <TouchableView
      style = {{
        marginLeft:'auto',
        marginRight:10,
        padding:20,
      }}
      >
        <Svg width="20" height="20" viewBox="0 0 1 1">
          <Path d="M 0.25 0.75 L 0.5 0.35 L 0.75 0.75" stroke="#fff" strokeWidth="0.1" fill="none" />
        </Svg>
      </TouchableView>
    </View>
  )
}

const colors = {
  deepBlue:'#000c18',
  lowBlue:'#2c4157',
  liteBlue:'#6688cc',
  urple:'#9966b8',
  range:'#ddbb88',
  lowYellow:'#ffeebb',
  ellow:'#efd700',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.lowBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
