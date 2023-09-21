import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { JSX, ReactNode, RefAttributes, useEffect } from 'react';
import { Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Container, NativeBaseProvider} from 'native-base';

//SCREENS
import Dashboard from './Dashboard';
import History from './History';

// ICONS
import DashboardIcon from '../assets/icons/dashboardIcon';
import HistoryIcon from '../assets/icons/historyIcon';
import { DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';

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

function CustomDrawer(props: DrawerContentComponentProps)
{
  return (
    <DrawerContentScrollView {...props}>
      <Container
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 32,
          marginLeft: 24,
          marginBottom: 48,
        }}
      >
        <Image
          source={require('../assets/images/icon.png')}
          style={{
            width: 186,
            height: 123,
          }} />
      </Container>
      <DrawerItemList {...props}/>
    </DrawerContentScrollView>
  )
}

function App()
{
  return (
    <NativeBaseProvider>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props}/>}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FAF9F6',
          },
          drawerItemStyle: {
            borderRadius: 6,
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
            headerShown: false,
            drawerIcon: ({ color }) => (
              <DashboardIcon color={color} style={{marginRight: -16}}/>
            ),
          }} 
        />
        <Drawer.Screen 
          name='History' 
          component={History} 
          options = {{ 
            title: "History", 
            headerShown: false,
            drawerIcon: ({ color }) => (
              <HistoryIcon color={color} style={{marginRight: -16}}/>
            )
          }}
        />
      </Drawer.Navigator>
    </NativeBaseProvider>
  );
}
