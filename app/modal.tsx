import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/components/Themed';
import { DynamicView } from '@/types/enum';
import AuthView from '@/components/AuthView/AuthView';
import {
  Platform,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import LogoutView from '@/components/LogoutView/LogoutView';
import SearchResult from '@/components/SearchResult/SearchResult';

export default function ModalScreen() {
  const route = useRoute();
  const { viewType, logoutLink } = route.params as any;
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          {viewType == DynamicView.AUTH_VIEW && <AuthView />}
          {viewType == DynamicView.LOGOUT_VIEW && (
            <LogoutView logoutLink={logoutLink} />
          )}
          {viewType == DynamicView.SEARCHRESULT_VIEW && <SearchResult />}

          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
