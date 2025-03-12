import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import BackgroundIMG from "../../assets/images/BG.jpg";

const API_URL = "http://localhost:5000/user"; 

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (isSignup && !username)) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignup ? `${API_URL}/register` : `${API_URL}/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, ...(isSignup && { username }) }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

    
      await SecureStore.setItemAsync("userToken", data.token);
      
      router.replace("(tabs)"); 
    } catch (error) {
      Alert.alert(isSignup ? "Sign-Up Failed" : "Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={BackgroundIMG} style={styles.background}>
        <View style={styles.overlay} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            
            <Text style={styles.heading}>Own It</Text>
            <Text style={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</Text>

            <View style={styles.container}>
              {isSignup && (
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                />
              )}

              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              {loading ? (
                <ActivityIndicator size="large" color="#FFD700" />
              ) : (
                <>
                  <TouchableOpacity onPress={handleAuth} style={styles.button}>
                    <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Login"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.toggleTextContainer}>
                    <Text style={styles.toggleText}>
                      {isSignup ? "Already have an account? " : "Don't have an account? "}
                      <Text style={styles.toggleLink}>{isSignup ? "Login" : "Sign Up"}</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50, 
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dc1919",
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  toggleTextContainer: {
    marginTop: 15,
  },
  toggleText: {
    fontSize: 14,
    color: "white",
  },
  toggleLink: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
