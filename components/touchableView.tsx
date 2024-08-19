import React from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback, 
    ViewProps, TouchableOpacityProps, TouchableNativeFeedbackProps,
    Platform, 
    GestureResponderEvent,
    StyleProp,
    ViewStyle, 
    Pressable} from 'react-native';

export type TouchableViewProps = {
    touchableProps?: TouchableNativeFeedbackProps | TouchableOpacityProps,
    onPress?: (event: GestureResponderEvent) => void,
    otherProps?: ViewProps,
    style?: StyleProp<ViewStyle>,
    children: React.ReactNode
}

export class TouchableView extends React.PureComponent<TouchableViewProps> {
    render() {
        const { onPress, touchableProps, children, ...otherProps } = this.props;

        return Platform.select({
            ios: (
                <TouchableOpacity
                    {...touchableProps} {...otherProps} onPress={onPress}>
                    {children}
                </TouchableOpacity>
            ),
            android: (
                <TouchableNativeFeedback {...touchableProps} onPress={onPress}>
                    <View {...otherProps}>
                        {children}
                    </View>
                </TouchableNativeFeedback>
            ),
            web: (
                <Pressable {...touchableProps} onPress={onPress}>
                    <View {...otherProps}>
                        {children}
                    </View>
                </Pressable>
            )
        });
    }
}
