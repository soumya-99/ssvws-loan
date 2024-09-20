import {AppRegistry} from 'react-native';
import App from './App';
import {PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {usePaperColorScheme} from './src/theme/theme';

export default function Main() {
  const theme = usePaperColorScheme();
  return (
    //   <AppContext>
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
    //   </AppContext>
  );
}

AppRegistry.registerComponent(appName, () => Main);
