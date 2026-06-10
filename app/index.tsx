import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";

export default function Index() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/index" as any);
    } else {
      router.replace("/(auth)/splash");
    }
  }, [isAuthenticated]);

  return null;
}