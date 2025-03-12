import { Stack, useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true; 

    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        console.log("Token:", token);

        if (isMounted) {
          setIsAuthenticated(!!token);
          
          if (navigation.isReady()) {
            if (token) {
              router.replace("/(tabs)"); 
            } else {
              router.replace("/auth/login");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    checkAuth();

    return () => {
      isMounted = false; 
    };
  }, [navigation]); 

  if (isAuthenticated === null) return null; 

  return <Stack screenOptions={{ headerShown: false }} />;
}
