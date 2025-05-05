import React, {useEffect, useState, useRef} from 'react';
import { Stack } from "expo-router";
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { fcmService } from '../services/FCMService';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>("initialising");
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  useEffect(() => {
    const isSupportedPlatform = Platform.OS === 'ios' || Platform.OS === 'android';

    const registerForNotifications = async (userId: string) =>{
    try{
        console.log("Attempting to register notifications for user");
        setNotificationStatus("registering");

        const permissionStatus = await fcmService.checkPermissions();
        if(permissionStatus !== 'granted'){
          console.log("Permission not granted", permissionStatus);
        }

        const tokens = await fcmService.registerForPushNotificationsAsync(userId);
        console.log("Push notification registration result", tokens);

        if(tokens.error){
          setNotificationStatus(`error: ${tokens.error}`);
          return;
        }

        if(tokens.expoPushToken || tokens.fcmToken){
          setNotificationStatus("registered");
          console.log("Successfully registered for push notifications");
        }else{
          setNotificationStatus("failed");
          console.log("failed to get push notifications");
        }
      }catch(error){
        console.error("Error in notification registration:", error);
        setNotificationStatus("Error");
      }
    };
    // Listen for authentication state changes
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (userState) => {
      setUser(userState);
      if(isSupportedPlatform || Platform.OS === 'web'){
        const userId = userState ? userState.uid : 'anonymous-test-user';
        await registerForNotifications(userId);
      }else{
        setNotificationStatus("platform-not-supported");
      }
    });

    if(isSupportedPlatform || Platform.OS === 'web'){
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
        const data = response.notification.request.content.data;
        if(data && data.screen){
          console.log(`Should navigate to ${data.screen}`);
        }
      });

          // Set up FCM foreground message handler
      const unsubscribeFCM = fcmService.onMessageListener();

      return () => {
        unsubscribeAuth();
        if(notificationListener.current){
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if(responseListener.current){
          Notifications.removeNotificationSubscription(responseListener.current);
        }
        if(typeof unsubscribeFCM === 'function'){
          unsubscribeFCM();
        }
      };
    }

    return () =>{
      unsubscribeAuth();
    };

  }, []);
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false, title: `Notification Status: ${notificationStatus}`}} />
    </Stack>
  );
}
