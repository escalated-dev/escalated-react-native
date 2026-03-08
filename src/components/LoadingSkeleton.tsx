import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { spacing, borderRadius } from '../theme/spacing';

interface LoadingSkeletonProps {
  lines?: number;
  showAvatar?: boolean;
}

function SkeletonLine({ width, height = 14 }: { width: string | number; height?: number }) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.line,
        {
          width: width as number | `${number}%`,
          height,
          backgroundColor: theme.colors.border,
          opacity,
        },
      ]}
    />
  );
}

export function LoadingSkeleton({ lines = 3, showAvatar = false }: LoadingSkeletonProps) {
  const { theme } = useTheme();
  const widths = ['100%', '80%', '60%', '90%', '70%'];

  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, cardIndex) => (
        <View
          key={cardIndex}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {showAvatar && (
            <View style={styles.avatarRow}>
              <SkeletonLine width={36} height={36} />
              <View style={styles.avatarText}>
                <SkeletonLine width="60%" />
                <SkeletonLine width="40%" />
              </View>
            </View>
          )}
          {[...Array(lines)].map((_, lineIndex) => (
            <SkeletonLine
              key={lineIndex}
              width={widths[lineIndex % widths.length]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  line: {
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});
