import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../Shared/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { TouchableOpacity } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import Services from "../Shared/Services";
export default function Login() {
  WebBrowser.maybeCompleteAuthSession();
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const { userData, setUserData } = useContext(AuthContext);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "622634428288-aid71pqjdb1v7ggpra4o5qfirg3hml0l.apps.googleusercontent.com",
    expoClientId:
      "622634428288-unevcdckaeqbg5dvtmdbc1e82b5jig25.apps.googleusercontent.com",
    iosClientId:
      "622634428288-91va6phpf7mn9b6mho77koc7a419m5i1.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type == "success") {
      setAccessToken(response.authentication.accessToken);

      getUserData();
    }
  }, [response]);

  const getUserData = async () => {
    try {
      const resp = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${response.authentication.accessToken}`,
        },
      });

      const user = await resp.json();
      console.log("user Details", user);
      setUserInfo(user);
      setUserData(user);
      await Services.setUserAuth(user);
    } catch (error) {
      // Add your own error handler here
    }
  };
  return (
    <View>
      <Image source={require("./../Assets/Images/login.png")} />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to CodeBox</Text>
        <Text style={{ textAlign: "center", marginTop: 80, fontSize: 20 }}>
          Login/Signup
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <Ionicons
            name="logo-google"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: Colors.white }}>Sign In with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setUserData({
              name: "Rahul Sanap",
              picture:
                "https://cdn3d.iconscout.com/3d/premium/thumb/male-customer-call-service-portrait-6760890-5600697.png?f=webp",
              email: "rahul@gmail.com",
              id: 1,
            })
          }
        >
          <Text>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    marginTop: -25,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  welcomeText: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    margin: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
