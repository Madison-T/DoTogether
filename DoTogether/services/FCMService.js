import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, firestore } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

//Configure the notification handler
Notifications.setNotificationHandler({
    handleNotification: async () =>({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class FCMService{
    isRealDevice = Device.isDevice;
    hasAttemptedRegistration = false;
    async registerForPushNotificationsAsync (userId){
        let fcmToken = null;
        let expoPushToken = null

        try{
            if(Platform.OS === 'android'){
                await Notifications.setNotificationChannelAsync('default',{
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
                console.log("Android notification channel created");
            }
            if(!this.isRealDevice){
                console.warn("Push notifications require a physical device");
                if(Platform.OS === 'web'){
                    console.log("Web platform detected, push notifications may be limited");
                }
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if(existingStatus !== 'granted'){
                console.log("Notification permissions not granted, requesting...")
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                console.log(`Permission request result: ${status}`);
            }

            if(finalStatus !== 'granted'){
                console.log("Failed to get push token for push notifications");
                return {fcmToken: null, expoPushToken: null};
            }

            try{
                //Get Expo push token
                const expoPushTokenResponse = await Notifications.getExpoPushTokenAsync({
                    projectId: "1855352c-67df-4e67-8f1c-651a32b9a5d6"
                });
                expoPushToken = expoPushTokenResponse.data;
                console.log("Expo push token obtained");
            }catch(error){
                console.log("Error geting push token", error);
            }


            //Get FCM token if messaging is initialised
            if(messaging){
                try{
                    fcmToken = await getToken(messaging, {
                        vapidKey: "BAZysKY0xa_S0bHG3Na756docmg8D8D-7G9aYo0Vrl8kMoF15I3vC57zkYdcmOZ4al9S6wEyMHYTm8H8dsIxyF0",
                    });
                    console.log("FCM token obtained");
                }catch(error){
                    console.error("Error getting FCM token:", error);
                }
            }else{
                console.warn("Firebase messaging not available");
            }

            if((fcmToken || expoPushToken) && firestore){
                await this.saveTokenToDatabase(userId, fcmToken, expoPushToken);
            }

            this.hasAttemptedRegistration = true;
            return {fcmToken, expoPushToken};
        }catch(error){
            console.error("Error in push notification registration");
            return {fcmToken: null, expoPushToken: null, error: error.message};
        }
    }
    
    async saveTokenToDatabase(userId, fcmToken, expoPushToken){
        if(!firestore){
            console.warn ("Firestore not initialised, cannot save tokens");
            return false;
        }
        try{
            const userRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userRef);

            if(userDoc.exists()){
                await setDoc(userRef, {
                    ...userDoc.data(),
                    fcmToken: fcmToken || null,
                    expoPushToken: expoPushToken || null,
                    updatedAt: new Date()
                }, {merge: true});
            }else{
                await setDoc(userRef,{
                    fcmToken: fcmToken || null,
                    expoPushToken: expoPushToken || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            console.log("token saved to database for user", userId);
        }catch(error){
            console.log("Error saving token to database", error);
            throw error;
        }
    }

    //Listen for FCM messages
    onMessageListener(){
        if(messaging){
            return onMessage(messaging, (payload) =>{
                console.log("Message received in foreground: ", payload);
                this.displayLocalNotification(payload.notification?.title, payload.notification?.body, payload.data);
                return payload;
            });
        }

        return () => {
            console.log("FCM messaging not available, listener not attached")
        };
    }

    //Display local notifications
    async displayLocalNotification(title, body, data = {}){
        try{
            await Notifications.scheduleNotificationAsync({
                content:{
                    title: title || 'New notification',
                    body: body || '',
                    data: data || {},
                },
                trigger: null,
            });
            console.log("local notification display successfully");
        }catch(error){
            console.error("Error displaying local notification", error);
        }
    }

    async sendTestLocalNotification(title="Test Notification", body = "This is a test notification", data={}){
        try{
            await Notifications.scheduleNotificationAsync({
                content:{
                    title,
                    body,
                    data,
                },
                trigger: null,
            });
            console.log("Test notification sent successfully");
        }catch(error){
            console.error("Error sending test notification", error);
            return false;
        }
    }

    async checkPermissions(){
        const { status } = await Notifications.getPermissionsAsync();
        return status;
    }
}

export const fcmService = new FCMService();