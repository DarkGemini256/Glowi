import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';

type Props = { current: number; goal: number; badge?: any };

export default function StreakProgressBar({ current, goal, badge }: Props) {
	const progress = Math.min(1, current / Math.max(1, goal));
	const scale = useRef(new Animated.Value(1)).current;
	useEffect(() => {
		Animated.sequence([
			Animated.timing(scale, { toValue: 1.1, duration: 200, useNativeDriver: true }),
			Animated.spring(scale, { toValue: 1, useNativeDriver: true })
		]).start();
	}, [current]);
	const size = 80;
	const stroke = 8;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const dash = circumference * progress;
	return (
		<Animated.View style={{ transform: [{ scale }] }}>
			<View style={{ width: size, height: size }}>
				<View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
					<Text style={styles.text}>{Math.round(progress * 100)}%</Text>
				</View>
				{badge ? (<Image source={badge} style={styles.badge} />) : null}
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	circle: { borderWidth: 8, borderColor: '#ff7f32', alignItems: 'center', justifyContent: 'center' },
	text: { fontWeight: '700' },
	badge: { position: 'absolute', right: -6, bottom: -6, width: 32, height: 32 },
});