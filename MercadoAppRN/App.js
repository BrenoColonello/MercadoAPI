import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListaProdutosScreen from './src/screens/ListaProdutosScreen';
import AdicionarProdutoScreen from './src/screens/AdicionarProdutoScreen';
import EditarProdutoScreen from './src/screens/EditarProdutoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          }}
        >
          <Stack.Screen
            name="ListaProdutos"
            component={ListaProdutosScreen}
            options={{ title: 'Estoque em Dia' }}
          />
          <Stack.Screen
            name="AdicionarProduto"
            component={AdicionarProdutoScreen}
            options={{ title: 'Adicionar Produto' }}
          />
          <Stack.Screen
            name="EditarProduto"
            component={EditarProdutoScreen}
            options={{ title: 'Editar Produto' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
