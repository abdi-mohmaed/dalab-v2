import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSupabaseStorage } from '@dalab/shared';
import App from './App';
import { name as appName } from './app.json';

// Inject storage provider for Supabase logic
setSupabaseStorage(AsyncStorage);

AppRegistry.registerComponent(appName, () => App);
