import React, {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { addUser, addGroup, addVote, addActivity } from '../hooks/useFirestore';
import { fcmService } from '../services/FCMService';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';

const Index = () => {
  const [notification, setNotification] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Request permission and register for notifications
    const requestNotifications = async () => {
      try{
        const userId = currentUser ? currentUser.uid : 'anonymous-test-user';
        const tokens = await fcmService.registerForPushNotificationsAsync (userId);
        console.log("Push notification tokens: ", tokens);

        if(tokens.expoPushToken || tokens.fcmToken){
          setIsRegistered(true);
        }
      }catch(error){
        console.error("Error registering for push notifications");
      }
    };

    requestNotifications();

    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received in index", notification);
      setNotification(notification);
    });

    return () => {
      subscription.remove();
    };
  }, [currentUser]);

  const sendTestNotification = async () => {
    try{
      const success = await fcmService.sendTestLocalNotification(
        "Test Notification",
        "This is a test notification from your app",
        {testData: 'Sample data payload'}
      );

      if(success){
        Alert.alert("Success", "Test notification sent");
      }else{
        Alert.alert("Error", "failed to send test notifications");
      }
    }catch(error){
      console.error("Error sending test notification", error);
      Alert.alert("Error", "Failed to send test notification");
    }
  };


  // Test User Creation
  const handleAddUser = async () => {
    const userId = 'user123';
    const name = 'Madison';
    const email = 'madison@example.com';
    await addUser(userId, name, email);
  };

  // Test Group Creation
  const handleAddGroup = async () => {
    const groupId = 'group123';
    const name = 'Movie Night';
    const description = 'Group for planning movie nights';
    const members = ['user123', 'user456', 'user789'];
    await addGroup(groupId, name, description, members);
  };

  // Test Vote Creation
  const handleAddVote = async () => {
    const voteId = 'vote123';
    const groupId = 'group123';
    const userId = 'user123';
    const vote = 'Yes';
    await addVote(voteId, groupId, userId, vote);
  };

  // Test Activity Creation
  const handleAddActivity = async () => {
    const activityId = 'activity123';
    const name = 'Watch Inception';
    const groupId = 'group123';
    const description = 'Watching the movie Inception together';
    await addActivity(activityId, name, groupId, description);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Firestore Add Functions Test</Text>

      <Button title="Add User" onPress={handleAddUser} />
      <Button title="Add Group" onPress={handleAddGroup} style={styles.button} />
      <Button title="Add Vote" onPress={handleAddVote} style={styles.button} />
      <Button title="Add Activity" onPress={handleAddActivity} style={styles.button} />

      <View>
        <Text>Push Notifications Status:</Text>
        <Text>{isRegistered ? "Device registered for notifications" : "Device not registered for notifications"}</Text>
        <Text>{currentUser ? `Logged in as: ${currentUser.email || currentUser.uid}` : "Not logged in (Testing in anonymous mode)"}</Text>
      </View>
      <Button title="Send Test Notification" onPress={sendTestNotification} disabled={!currentUser} style={styles.button} />
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
