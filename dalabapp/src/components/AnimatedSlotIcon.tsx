import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';

interface AnimatedSlotIconProps {
    topWords: [string, string];
    bottomWord: string;
    interval?: number;
}

export const AnimatedSlotIcon: React.FC<AnimatedSlotIconProps> = ({
    topWords,
    bottomWord,
    interval = 3000,
}) => {
    const translateY = useSharedValue(0);
    const opacity1 = useSharedValue(1);
    const opacity2 = useSharedValue(0);

    useEffect(() => {
        // Animation loop:
        // 0: Word 1 visible
        // 1: Transition to Word 2 (Slide up)
        // 2: Pause
        // 3: Transition to Word 1 (Slide up)
        translateY.value = withRepeat(
            withSequence(
                // Pause on first word
                withDelay(
                    interval,
                    withTiming(-20, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
                ),
                // Pause on second word
                withDelay(
                    interval,
                    withTiming(-40, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
                )
            ),
            -1, // Infinite loop
            false // Do not reverse, manually handle loop in translateY logic or use a simpler offset
        );

        // Opacity mapping for the two words
        opacity1.value = withRepeat(
            withSequence(
                withDelay(interval, withTiming(0, { duration: 500 })),
                withDelay(interval, withTiming(1, { duration: 500 }))
            ),
            -1,
            false
        );

        opacity2.value = withRepeat(
            withSequence(
                withDelay(interval, withTiming(1, { duration: 500 })),
                withDelay(interval, withTiming(0, { duration: 500 }))
            ),
            -1,
            false
        );
    }, []);

    // Simplified animation logic: Using a step-based index might be cleaner for multiple words,
    // but for 2 words, a simple Y toggle works.
    
    // Let's refine for "Slot Machine" feel: Word 1 -> Word 2 -> Word 1 (repeat)
    // We'll use a single shared value `progress` [0, 1]
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withSequence(
                withDelay(interval, withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) })),
                withDelay(interval, withTiming(0, { duration: 600, easing: Easing.inOut(Easing.quad) }))
            ),
            -1,
            false
        );
    }, []);

    const animatedTopStyle1 = useAnimatedStyle(() => ({
        transform: [{ translateY: -progress.value * 25 }],
        opacity: 1 - progress.value,
    }));

    const animatedTopStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - progress.value) * 25 }],
        opacity: progress.value,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.slotContainer}>
                <Animated.View style={[styles.wordWrapper, animatedTopStyle1]}>
                    <Text style={styles.topText}>{topWords[0]}</Text>
                </Animated.View>
                <Animated.View style={[styles.wordWrapper, styles.absolute, animatedTopStyle2]}>
                    <Text style={styles.topText}>{topWords[1]}</Text>
                </Animated.View>
            </View>
            <Text style={styles.bottomText}>{bottomWord}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    slotContainer: {
        height: 20,
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',
    },
    wordWrapper: {
        height: 20,
        justifyContent: 'center',
    },
    absolute: {
        position: 'absolute',
        top: 0,
    },
    topText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
    },
    bottomText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginTop: -2,
    },
});
