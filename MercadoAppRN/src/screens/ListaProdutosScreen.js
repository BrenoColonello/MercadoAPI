import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarProdutos, excluirProduto, conferirProduto } from '../../api/produtos';
import { colors, spacing } from '../theme';

function getAlertaColor(nivelAlerta) {
  if (nivelAlerta === 2) return colors.alertRed;
  if (nivelAlerta === 1) return colors.alertOrange;
  return colors.alertGreen;
}

function ProdutoCard({ item, onEditar, onConferir, onExcluir }) {
  const corNome = getAlertaColor(item.nivelAlerta);

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.fotoProduto ? (
          <Image
            source={{
              uri: item.fotoProduto.startsWith('data')
                ? item.fotoProduto
                : `data:image/jpeg;base64,${item.fotoProduto}`,
            }}
            style={styles.foto}
          />
        ) : (
          <View style={[styles.foto, styles.fotoPlaceholder]} />
        )}
        <View style={styles.cardContent}>
          <Text style={[styles.nome, { color: corNome }]} numberOfLines={2}>
            {item.nomeProduto}
          </Text>
          <Text style={styles.textoValidade}>{item.textoValidade}</Text>
          <View style={styles.botoesRow}>
            <TouchableOpacity style={[styles.btn, styles.btnOk]} onPress={() => onConferir(item)}>
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnEditar]} onPress={() => onEditar(item)}>
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnExcluir]} onPress={() => onExcluir(item)}>
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ListaProdutosScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState('');

  const carregar = useCallback(async () => {
    try {
      const lista = await listarProdutos(busca || undefined);
      setProdutos(lista);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível carregar. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [busca]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [carregar])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  const handleConferir = (item) => {
    Alert.alert(
      'Conferir produto',
      'Produto saiu do estoque. Deseja alterar a data de validade (novo lote)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Manter data', onPress: () => conferirSemAlterar(item) },
        { text: 'Alterar data', onPress: () => navigation.navigate('EditarProduto', { id: item.id }) },
      ]
    );
  };

  const conferirSemAlterar = async (item) => {
    try {
      await conferirProduto(item.id);
      carregar();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleExcluir = (item) => {
    Alert.alert('Excluir', `Excluir "${item.nomeProduto}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirProduto(item.id);
            carregar();
          } catch (e) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  };

  if (loading && produtos.length === 0) {
    return (
      <View style={styles.central}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome..."
        value={busca}
        onChangeText={setBusca}
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity
        style={styles.btnAdicionar}
        onPress={() => navigation.navigate('AdicionarProduto')}
      >
        <Text style={styles.btnAdicionarText}>+ Adicionar Produto</Text>
      </TouchableOpacity>
      <FlatList
        data={produtos}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => (
          <ProdutoCard
            item={item}
            onEditar={(p) => navigation.navigate('EditarProduto', { id: p.id })}
            onConferir={handleConferir}
            onExcluir={handleExcluir}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum produto cadastrado.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  central: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  busca: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  btnAdicionar: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  btnAdicionarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  lista: { paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: { flexDirection: 'row' },
  foto: { width: 64, height: 64, borderRadius: 8 },
  fotoPlaceholder: { backgroundColor: colors.surface },
  cardContent: { flex: 1, marginLeft: spacing.md },
  nome: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  textoValidade: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  botoesRow: { flexDirection: 'row' },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
  btnOk: { backgroundColor: colors.alertGreen },
  btnEditar: { backgroundColor: colors.textSecondary },
  btnExcluir: { backgroundColor: colors.alertRed },
  btnText: { color: '#fff', fontSize: 14 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl },
});
