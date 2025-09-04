import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  // Get user data and the signOut function from Clerk hooks
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* Only show content if the user is signed in */}
      <SignedIn>
        {/* Check if user data is available before rendering */}
        {user && (
          <>
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.email}>
              {user.primaryEmailAddress?.emailAddress}
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => signOut()}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
      </SignedIn>

      {/* Show this content if the user is signed out */}
      <SignedOut>
        <Text style={styles.userName}>Welcome!</Text>
        <Text style={styles.email}>Sign in to view your profile.</Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </SignedOut>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it a circle
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});