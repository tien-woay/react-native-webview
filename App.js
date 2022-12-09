import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Share,
  Platform,
  Text,
  TextInput,
} from "react-native";

import { WebView } from "react-native-webview";

export default function App() {
  const [title, setTitle] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const colorValue = useRef("");
  const webviewRef = useRef(null);

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: "Youtube",
        message: "Link Youtube: https://www.youtube.com/",
        url: "https://www.youtube.com/",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getText = (text) => {
    colorValue.current = text;
  };

  const openWebView = () => setIsOpen((e) => !e);

  const emitSetColor = () => {
    alert("RN:" + colorValue.current.toString());

    webviewRef.current.postMessage(
      JSON.stringify({
        event: "set-color",
        payload: {
          color: colorValue.current.toString(),
        },
      })
    );
  };

  const handleWebviewMessage = async (input) => {
    const obj = JSON.parse(input.nativeEvent.data);
    const { event, payload } = obj;
    switch (event) {
      case "share":
        setTitle((e) => (e = JSON.stringify(obj)));
        await Share.share({
          title: "Share URL",
          message: "Link Youtube: " + payload.message,
          url: payload.message,
        });
      case "postText":
      case "postNumber":
        setTitle((e) => (e = JSON.stringify(obj)));

        break;
    }
  };
  return (
    <>
      <SafeAreaView>
        {/* <View style={styles.container}>
        <Button onPress={onShare} title="Share" />
      </View>
      <View style={styles.mt}>
        <Text>{title}</Text>
        <Button marginTop={styles.mt} onPress={openWebView} title="Open Webview" />
      </View> */}
        <Text> {title ? title : "react native title"} </Text>

        {title && (
          <>
            <Text style={styles.mt} >event: {JSON.parse(title).event} </Text>
            <Text>message: {JSON.parse(title).payload.message} </Text>
          </>
        )}
      </SafeAreaView>
      {/* <TextInput onChangeText={getText} style={{backgroundColor: 'yellow'}} selectionColor='red'></TextInput>
    <Button title="Set Color" onPress={emitSetColor}></Button>
    <Text style={styles.mt}>This is Web View </Text> */}

      <View style={styles.viewViewSpace}>
        <Text style={styles.mt}> Web View </Text>
      </View>
      <WebView
        scalesPageToFit={false}
        cacheEnabled={true}
        mixedContentMode="compatibility"
        ref={webviewRef}
        onMessage={handleWebviewMessage}
        source={{
          url: "https://joyful-syrniki-d42e65.netlify.app/demo.html",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  mt: {
    marginTop: 25,
  },
  viewViewSpace: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "black",
  },
});
