import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeBaseProvider } from 'native-base';

//SCREENS
import Dashboard from './Dashboard';
import History from './History';
import About from './About';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout()
{
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <App />;
}

const Drawer = createDrawerNavigator();

function App() {

  return (
    <NativeBaseProvider>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FAF9F6',
          },
          drawerActiveTintColor: '#FFFFFF',
          drawerActiveBackgroundColor: '#4790FC',
        }}
        >
        <Drawer.Screen 
          name='Dashboard' 
          component={Dashboard} 
          options = {{ 
            title: "Dashboard", 
            headerShown: true,
            headerStyle: {
              backgroundColor: 'rgb(0,0,0,0)',
              
            },
            
          }} 
        />
        <Drawer.Screen 
          name='History' 
          component={History} 
          options = {{ 
            title: "History", 
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name='About' 
          component={About} 
          options = {{ 
            title: "About Us", 
            headerTitle: "", 
            headerShown: true
          }}
        />
      </Drawer.Navigator>
    </NativeBaseProvider>
  );
}
