import { Stack } from "expo-router";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { View, Button, StyleSheet } from 'react-native';

const LayoutInner = () => {
  const { user, logoutUser } = useAuth();

  return (
    <>
      {/* Sign Out Button only if user is logged in */}
      {user && (
        <View style={styles.logoutContainer}>
          <Button title="Sign Out" onPress={logoutUser} />
        </View>
      )}
      <Stack />
    </>
  );
};

const Layout = () => {
  return (
    <AuthProvider>
      <LayoutInner />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    zIndex: 100,  // make sure it's on top
  },
});

export default Layout;
