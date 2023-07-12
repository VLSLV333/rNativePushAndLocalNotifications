import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Platform, Alert } from "react-native";

import * as Device from "expo-device";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const [notificationToken, setNotificationToken] = useState(null);

  useEffect(() => {
    const gettingTokenAsync = async () => {
      const receivedToken = await registerForPushNotificationsAsync();
      setNotificationToken(receivedToken);
      console.log(receivedToken)
    }

    gettingTokenAsync()

  }, []);


  // logic for interacting with notification that poped up on device screen, even if user did not click it.
  // useEffect(() => {
  //  const subscription =  Notifications.addNotificationReceivedListener((notification) => {
  //     console.log('Notification received')
  //     // console.log(notification)
  //     console.log(notification.request.content.data.userName)
  //   })

  //   // logic to remove notification listener
  //   return () => {subscription.remove()}
  // },[])



  //  logic for reacting to user clicked our notification
  // useEffect(() => {
  //   const subscription = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       // console.log("User Clicked on Notification!");
  //       // console.log(response);
  //       // console.log(response.notification.request.content.data.userName);
  //     }
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const scheduleNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification title",
        body: "This is the body of the notification.",
        data: { userName: "vlslv" },
      },
      trigger: {
        seconds: 5,
      },
    });
  };


  const pushNotificationsHandler = () => {
    // 
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'ExponentPushToken[7oO7SYDzcpT_fweGc4yrP3]',
        title: 'Test title of Push',
        body: 'Test body of push'
      })
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title="Schedule Notification!"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Push notification"
        onPress={pushNotificationsHandler}
      />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  //tokens are needed for push notifications and not local notifications
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Please, go to Settings -> Notifications -> Select this app -> Turn on Notifications:)"
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({projectId:'4672897e-a73c-4b6b-9440-66c9fb3f1afa'})).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
