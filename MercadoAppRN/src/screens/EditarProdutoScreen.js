npx expo install @react-native-community/datetimepickernpx expo install @react-native-community/datetimepickernpx expo install @react-native-community/datetimepickernpx expo install @react-native-community/datetimepickerimport React, { useState, useCallback } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { obterProduto, atualizarProduto } from '../../api/produtos';
import { colors, spacing } from '../theme';

export default function EditarProdutoScreen({ route, navigation }) {
  const { id } = route.params;
  const [nome, setNome] = useState('');
  const [fotoBase64, setFotoBase64] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEntradaPicker, setShowEntradaPicker] = useState(false);
  const [showValidadePicker, setShowValidadePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const p = await obterProduto(id);
          if (cancelled) return;
          setNome(p.nomeProduto || '');
          setFotoBase64(p.fotoProduto || '');
          setDataEntrada(fromIsoToBr((p.dataEntrada || '').toString().slice(0, 10)));
          setDataValidade(fromIsoToBr((p.dataValidade || '').toString().slice(0, 10)));
          setQuantidade(String(p.quantidade ?? 1));
        } catch (e) {
          if (!cancelled) Alert.alert('Erro', e.message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [id])
  );

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
    setSaving(true);
    try {
      const dataEntradaIso = toIsoDate(dataEntrada);
      const dataValidadeIso = toIsoDate(dataValidade);
      if (!dataEntradaIso || !dataValidadeIso) {
        Alert.alert('Atenção', 'Informe as datas no formato DD-MM-AAAA.');
        return;
      }
      await atualizarProduto(id, {
        nomeProduto: n,
        fotoProduto: fotoBase64,
        dataEntrada: dataEntradaIso,
        dataValidade: dataValidadeIso,
        quantidade: qtd,
      });
      Alert.alert('Sucesso', 'Produto atualizado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.central}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome do produto</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
        placeholderTextColor={colors.textSecondary}
      />
      <Text style={styles.label}>Foto</Text>
      <View style={styles.fotoRow}>
        {fotoBase64 ? (
          <Image
            source={{
              uri: fotoBase64.startsWith('data')
                ? fotoBase64
                : `data:image/jpeg;base64,${fotoBase64}`,
            }}
            style={styles.preview}
          />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]} />
        )}
        <TouchableOpacity style={styles.fotoBtn} onPress={() => pickImage(false)}>
          <Text style={styles.fotoBtnText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Data de entrada (DD-MM-AAAA)</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          value={dataEntrada}
          onChangeText={(t) => setDataEntrada(maskDateInput(t))}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => setShowEntradaPicker(true)}
          accessibilityLabel="Abrir calendario de entrada"
        >
          <Text style={styles.calendarText}>CAL</Text>
        </TouchableOpacity>
      </View>
      {showEntradaPicker && (
        <DateTimePicker
          value={parseBrToDate(dataEntrada)}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowEntradaPicker(false);
            if (selectedDate) setDataEntrada(formatDateBr(selectedDate));
          }}
        />
      )}
      <Text style={styles.label}>Data de validade (DD-MM-AAAA)</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          value={dataValidade}
          onChangeText={(t) => setDataValidade(maskDateInput(t))}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => setShowValidadePicker(true)}
          accessibilityLabel="Abrir calendario de validade"
        >
          <Text style={styles.calendarText}>CAL</Text>
        </TouchableOpacity>
      </View>
      {showValidadePicker && (
        <DateTimePicker
          value={parseBrToDate(dataValidade)}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowValidadePicker(false);
            if (selectedDate) setDataValidade(formatDateBr(selectedDate));
          }}
        />
      )}
      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        style={[styles.btnSalvar, saving && styles.btnDisabled]}
        onPress={salvar}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSalvarText}>Salvar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  central: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  inputFlex: { flex: 1, marginBottom: 0 },
  calendarBtn: {
    marginLeft: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarText: { color: colors.textSecondary, fontWeight: '700', fontSize: 12 },
  fotoRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'center' },
  preview: { width: 100, height: 100, borderRadius: 8 },
  previewPlaceholder: { backgroundColor: colors.surface },
  fotoBtn: {
    marginLeft: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
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

function formatDateBr(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function fromIsoToBr(isoDate) {
  const match = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(isoDate);
  if (!match) return '';
  const year = match[1];
  const month = match[2];
  const day = match[3];
  return `${day}-${month}-${year}`;
}

function maskDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function parseBrToDate(brDate) {
  const match = /^\s*(\d{2})[/-](\d{2})[/-](\d{4})\s*$/.exec(brDate);
  if (!match) return new Date();
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return new Date();
  }
  return date;
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
