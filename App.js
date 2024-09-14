import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './pages/Login';
import Sign from './pages/Sign';


const Stack = createNativeStackNavigator();

const App = (navigation) => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='LoginPage' component={Login}/>
        <Stack.Screen name='SignPage' component={Sign}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  },
});
