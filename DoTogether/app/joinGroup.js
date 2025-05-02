import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JoinGroup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Group</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default JoinGroup;