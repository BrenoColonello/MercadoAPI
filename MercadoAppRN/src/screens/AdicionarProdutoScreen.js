import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { criarProduto } from '../../api/produtos';
import { colors, spacing } from '../theme';

export default function AdicionarProdutoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [fotoBase64, setFotoBase64] = useState('');
  const [dataEntrada, setDataEntrada] = useState(() => formatDateBr(new Date()));
  const [dataValidade, setDataValidade] = useState(() => formatDateBr(addDays(new Date(), 7)));
  const [quantidade, setQuantidade] = useState('1');
  const [loading, setLoading] = useState(false);

  async function pickImage(camera = false) {
    const { status } = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera ou galeria.');
      return;
    }
    const result = camera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
    if (!result.canceled && result.assets[0].base64) {
      setFotoBase64(result.assets[0].base64);
    }
  }

  async function salvar() {
    const n = nome.trim();
    if (!n) {
      Alert.alert('Atenção', 'Informe o nome do produto.');
      return;
    }
    const qtd = parseInt(quantidade, 10) || 1;
    setLoading(true);
    try {
      const dataEntradaIso = toIsoDate(dataEntrada);
      const dataValidadeIso = toIsoDate(dataValidade);
      if (!dataEntradaIso || !dataValidadeIso) {
        Alert.alert('Atenção', 'Informe as datas no formato DD-MM-AAAA.');
        return;
      }
      await criarProduto({
        nomeProduto: n,
        fotoProduto: fotoBase64,
        dataEntrada: dataEntradaIso,
        dataValidade: dataValidadeIso,
        quantidade: qtd,
      });
      Alert.alert('Sucesso', 'Produto cadastrado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome do produto</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Leite integral 1L"
        placeholderTextColor={colors.textSecondary}
      />
      <Text style={styles.label}>Foto (opcional)</Text>
      <View style={styles.fotoRow}>
        {fotoBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
            style={styles.preview}
          />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]} />
        )}
        <View style={styles.fotoBtns}>
          <TouchableOpacity style={styles.fotoBtn} onPress={() => pickImage(true)}>
            <Text style={styles.fotoBtnText}>Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fotoBtn} onPress={() => pickImage(false)}>
            <Text style={styles.fotoBtnText}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.label}>Data de entrada (DD-MM-AAAA)</Text>
      <TextInput
        style={styles.input}
        value={dataEntrada}
        onChangeText={setDataEntrada}
        placeholder="24-02-2026"
      />
      <Text style={styles.label}>Data de validade (DD-MM-AAAA)</Text>
      <TextInput
        style={styles.input}
        value={dataValidade}
        onChangeText={setDataValidade}
        placeholder="02-03-2026"
      />
      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        style={[styles.btnSalvar, loading && styles.btnDisabled]}
        onPress={salvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSalvarText}>Salvar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatDateBr(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
function toIsoDate(brDate) {
  const match = /^\s*(\d{2})[/-](\d{2})[/-](\d{4})\s*$/.exec(brDate);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function addDays(d, days) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  label: { fontWeight: '700', marginBottom: spacing.xs, color: colors.text },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  fotoRow: { flexDirection: 'row', marginBottom: spacing.md },
  preview: { width: 100, height: 100, borderRadius: 8 },
  previewPlaceholder: { backgroundColor: colors.surface },
  fotoBtns: { marginLeft: spacing.md, justifyContent: 'center' },
  fotoBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  fotoBtnText: { color: '#fff', fontWeight: '600' },
  btnSalvar: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  btnDisabled: { opacity: 0.7 },
  btnSalvarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
