import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { addUser, addGroup, addVote, addActivity } from '../hooks/useFirestore';
import { Link, router} from 'expo-router';

const Index = () => {

  // Test User Creation
  const handleAddUser = async () => {
    const userId = 'user123';
    const name = 'Madison';
    const email = 'madison@example.com';
    await addUser(userId, name, email);
    alert("User added successfully");
  };

  // Test Group Creation
  const handleAddGroup = async () => {
    const groupId = 'group123';
    const name = 'Movie Night';
    const description = 'Group for planning movie nights';
    const members = ['user123', 'user456', 'user789'];
    await addGroup(groupId, name, description, members);
    alert("Group added successfully");
  };

  // Test Vote Creation
  const handleAddVote = async () => {
    const voteId = 'vote123';
    const groupId = 'group123';
    const userId = 'user123';
    const vote = 'Yes';
    await addVote(voteId, groupId, userId, vote);
    alert("Vote added successfully");
  };

  // Test Activity Creation
  const handleAddActivity = async () => {
    const activityId = 'activity123';
    const name = 'Watch Inception';
    const groupId = 'group123';
    const description = 'Watching the movie Inception together';
    await addActivity(activityId, name, groupId, description);
    alert("Activity added successfully");
  };

  //Navigation to Create Group
  const navigateToCreateGroup = () =>{
    router.push('/createGroup');
  }

  //Navigation to View Group
  const navigateToViewGroup = () =>{
    router.push('/viewGroup/group123');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Firestore Add Functions Test</Text>

      <Button title="Add User" onPress={handleAddUser} />
      <Button title="Add Group" onPress={handleAddGroup} style={styles.button} />
      <Button title="Add Vote" onPress={handleAddVote} style={styles.button} />
      <Button title="Add Activity" onPress={handleAddActivity} style={styles.button} />
      <Button title="Navigate to Create Group" onPress={navigateToCreateGroup} style={styles.button} />
      <Button title="Navigate to View Group" onPress={navigateToViewGroup} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default Index;
