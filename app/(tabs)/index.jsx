import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ProgressBarAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import BackgroundIMG from "../../assets/images/BG.jpg"; 

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(3200 / 5000); 

  const logout = async () => {
    try {
      setLoading(true);
      await SecureStore.deleteItemAsync("userToken");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={BackgroundIMG} style={styles.background}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>🏃‍♂️ Move 5000 Steps Challenge</Text>
        <Text style={styles.subtitle}>Stay accountable & keep moving! 🚀</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>3200 / 5000 Steps</Text>
          {Platform.OS === "android" ? (
            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} color="#FFD700" />
          ) : (
            <View style={styles.progressBar}>
              <View style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
            </View>
          )}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
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
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
  },
  joinButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

