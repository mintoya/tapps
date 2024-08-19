import { ReactNode } from "react";
import { Text,View } from "react-native";
import { TouchableView } from "./touchableView";
import colors from "../assets/colors";

/*
structure
-task
    title
    color?
    time?
*/
const Task = (data:Record<string,any>):ReactNode=>{
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
            flexDirection:'row',
            margin:20,
            alignItems:'center',
            padding:10,
        }}
        >
            <Text
            style={{
                color:'white',
                fontSize:25,
            }}
            >{data.title}</Text>
            {hasTime?(
                <Text
                style={{
                    color:'white',
                    fontSize:15,
                    marginHorizontal:5,
                }}>{data.time}</Text>
                ):(
                <View></View>
                )
            }
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
        </TouchableView>
    )

}

export default Task