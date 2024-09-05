import React, { useState, useEffect, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Text,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import colors from '../assets/colors';

// export default function App() {
//   const [currentDate, setCurrentDate] = useState<
//     Record<string, number | string>
//   >({
//     day: 1,
//     month: 'January',
//     year: 2024,
//   });
//   console.log(currentDate)
//   return <DatePicker currentDate={currentDate} setDate={setCurrentDate} />;
// }
export default function DatePicker({
  currentDate,
  setDate,
}: {
  currentDate: Record<string, any>;
  setDate: any;
}):ReactNode{
  const dMM = new Map<string, number>([
    ['January', 31],
    ['February', 28],
    ['March', 31],
    ['April', 30],
    ['May', 31],
    ['June', 30],
    ['July', 31],
    ['August', 31],
    ['September', 30],
    ['October', 31],
    ['November', 30],
    ['December', 31],
  ]);
  if(currentDate==undefined||currentDate.day==undefined){
    currentDate = {
          day: 1,
          month: 'January',
          year: 2024,
      };
  }
  console.log(currentDate+' is currentDate')
  let dChoiceArray: Array<number> = [];
  const [dChoice, setDChoice] = useState<number>(currentDate.day);
  let mChoiceArray: Array<string> = [];

  const [mChoice, setMChoice] = useState<any>(currentDate.month);
  const yChoiceArray = [2024,2025,2026];
  const [yChoice, setYChoice] = useState<any>(currentDate.year);
  function refreshDays() {
    mChoiceArray = []
    dMM.forEach((length, month) => {
      mChoiceArray.push(month);
      if (month == mChoice) {
        dChoiceArray = [];
        for (var i = 1; i < length + 1; i += 1) {
          dChoiceArray.push(i);
        }
      }
    });
  }
  refreshDays();
  function mchoiceWrapper(value: string) {
    setMChoice(value);
    setDChoice(1);
    refreshDays();
  }
  useEffect(()=>{setDate({day: dChoice,month:mChoice,year:yChoice,})},[yChoice,mChoice,dChoice])

  return (
    <View
      style={{
        flexDirection: 'row',
        margin: 'auto',
        height: 40,
        width: 200,
      }}>
      <Picker
        choiceArray={mChoiceArray}
        currentChoice={mChoice}
        setChoice={mchoiceWrapper}
      />
      <Picker
        choiceArray={dChoiceArray}
        currentChoice={dChoice}
        setChoice={setDChoice}
      />
      <YPicker
        choiceArray={yChoiceArray}
        currentChoice={yChoice}
        setChoice={setYChoice}
      />
    </View>
  );
};
const Picker = ({
  choiceArray,
  currentChoice,
  setChoice,
}: {
  choiceArray: Array<any>;
  currentChoice: number;
  setChoice: any;
}) => {
  const height = useSharedValue<number>(40);
  const [focused, setFocused] = useState<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    height: withSpring(height.value),
  }));
  function flip() {
    setFocused(!focused);
    if (!focused) {
      height.value = 120;
    } else {
      height.value = 40;
    }
  }
  let DATA = choiceArray;
  const Item = ({ title }: { title: String }) => (
    <Pressable
      style={{
        width: '100%',
        minWidth: 35,
        backgroundColor:colors.liteBlue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
      onPress={() => {
        flip();
        setChoice(title);
      }}>
      <Text style={{ fontSize: 18,color:'white' }}>{title}</Text>
    </Pressable>
  );

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Animated.View
        style={[
          {
            height: 40,
            overflow: 'hidden',
            width: 'auto',
            padding: 5,
            backgroundColor: colors.liteBlue,
            borderRadius: 10,
          },
          animatedStyles,
        ]}>
        {focused ? (
          
          <FlatList
            style={{ width: '100%',  padding: 'auto' }}
            data={DATA}
            renderItem={({ item }) => <Item title={item} />}
            keyExtractor={(item) => item+Math.random()}
          />
        ) : (
          <Pressable
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: colors.liteBlue,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              flip();
            }}>
            <Text style={{ fontSize: 24,color:'white' }}>{currentChoice}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};
const YPicker = ({
  choiceArray,
  currentChoice,
  setChoice,
}: {
  choiceArray: Array<number>;
  currentChoice: number;
  setChoice: any;
}) => {
  const height = useSharedValue<number>(40);
  const [focused, setFocused] = useState<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    height: withSpring(height.value),
  }));
  
  function flip() {
    setFocused(!focused);
    if (!focused) {
      height.value = 120;
    } else {
      height.value = 40;
    }
  }
  let [DATA,setData] = useState(choiceArray);
  const loadMoreItems = ()=>{
    setData([...DATA,DATA[DATA.length-1]+1])
  }
  const Item = ({ title }: { title: String }) => (
    <Pressable
      style={{
        width: '100%',
        minWidth: 35,
        backgroundColor: colors.liteBlue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
      onPress={() => {
        flip();
        setChoice(title);
      }}>
      <Text style={{ fontSize: 18,color:'white' }}>{title}</Text>
    </Pressable>
  );

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Animated.View
        style={[
          {
            height: 40,
            overflow: 'hidden',
            width: 'auto',
            padding: 5,
            backgroundColor: colors.liteBlue,
            borderRadius: 10,
          },
          animatedStyles,
        ]}>
        {focused ? (
          
          <FlatList
            style={{ width: '100%', padding: 'auto' }}
            data={DATA}
            renderItem={({ item }) => <Item title={item+""} />}
            keyExtractor={(item) => item+Math.random()+""}
            onEndReached={() => loadMoreItems()}
          />
        ) : (
          <Pressable
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: colors.liteBlue,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              flip();
            }}>
            <Text style={{ fontSize: 24,color:'white' }}>{currentChoice}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

