// screens/parent/PaymentsScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_VIOLET, BRAND_ORANGE];

// ─── TYPES ────────────────────────────────────────────────────────────────
type PaymentStatus = 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD';
type PaymentKind = 'SCOLARITE' | 'FOURNITURES' | 'TRANSPORT' | 'CANTINE';

interface Payment {
  id: string;
  kind: PaymentKind;
  label: string;
  childName: string;
  date: string;
  amount: number;
  status: PaymentStatus;
}

// ─── MOCK (à remplacer par les vraies données du backend) ─────────────────
const PARENT_NAME = 'M. Moukoko';
const SCHOOL_YEAR = '2025-2026';
const TOTAL_DUE = 1200000; // total annuel à régler, tous enfants confondus
const ALREADY_PAID = 750000; // cumul déjà réglé sur l'année
const NEXT_DUE_DATE = '30 nov.';
const CHILDREN_COUNT = 4;

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', kind: 'SCOLARITE', label: 'Scolarité · Tranche 2', childName: 'Jean Junior', date: '12 oct.', amount: 150000, status: 'PAYE' },
  { id: '2', kind: 'FOURNITURES', label: 'Fournitures scolaires', childName: 'Sarah', date: '05 oct.', amount: 35000, status: 'PAYE' },
  { id: '3', kind: 'SCOLARITE', label: 'Scolarité · Tranche 3', childName: 'Marie Claire', date: '30 nov.', amount: 150000, status: 'EN_ATTENTE' },
  { id: '4', kind: 'TRANSPORT', label: 'Transport · Trimestre 1', childName: 'David', date: '18 sept.', amount: 45000, status: 'EN_RETARD' },
  { id: '5', kind: 'CANTINE', label: 'Cantine · Octobre', childName: 'Sarah', date: '02 oct.', amount: 20000, status: 'PAYE' },
];

const KIND_ICON: Record<PaymentKind, keyof typeof Feather.glyphMap> = {
  SCOLARITE: 'book-open',
  FOURNITURES: 'shopping-bag',
  TRANSPORT: 'truck',
  CANTINE: 'coffee',
};

const STATUS_LABEL: Record<PaymentStatus, string> = { PAYE: 'Payé', EN_ATTENTE: 'En attente', EN_RETARD: 'En retard' };
const STATUS_COLOR: Record<PaymentStatus, string> = { PAYE: '#16A34A', EN_ATTENTE: '#D97706', EN_RETARD: '#DC2626' };

const formatAmount = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

// ─── ACTION RAPIDE ───────────────────────────────────────────────────────
const QuickAction = ({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.action, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionIcon}>
        <Feather name={icon} size={17} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ─── LIGNE DE TRANSACTION ────────────────────────────────────────────────
const PaymentRow = ({ item, onPress }: { item: Payment; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} accessibilityRole="button" style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceElevated }]}>
        <Feather name={KIND_ICON[item.kind]} size={18} color={colors.text} />
      </View>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>{item.label}</Text>
        <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>
          {item.childName} · {item.date}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.rowAmount, { color: colors.text }]}>{formatAmount(item.amount)} F</Text>
        <Text style={[styles.rowStatus, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── SCREEN PRINCIPAL ───────────────────────────────────────────────────
export const PaymentsScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const payments = MOCK_PAYMENTS;
  const remaining = Math.max(TOTAL_DUE - ALREADY_PAID, 0);
  const progress = Math.min(ALREADY_PAID / TOTAL_DUE, 1);

  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.spring(lift, { toValue: 0, damping: 18, useNativeDriver: true }),
    ]).start();
  }, []);

  // TODO : adapter les noms de routes à ta navigation
  const goPay = () => navigation.navigate('PayFees');
  const goReceipts = () => navigation.navigate('Receipts');
  const goSchedule = () => navigation.navigate('PaymentSchedule');
  const goHistory = () => navigation.navigate('PaymentHistory');
  const goPayment = (p: Payment) => navigation.navigate('PaymentDetail', { paymentId: p.id });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40 }}>
        {/* ───── EN-TÊTE ───── */}
        <View style={styles.header}>
          <View style={styles.hello}>
            <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.helloRing}>
              <View style={[styles.helloInner, { backgroundColor: colors.surface }]}>
                <Text style={[styles.helloInitial, { color: colors.text }]}>{PARENT_NAME.replace('M. ', '')[0]}</Text>
              </View>
            </LinearGradient>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.helloSmall, { color: colors.textMuted }]}>Bonjour</Text>
              <Text style={[styles.helloName, { color: colors.text }]}>{PARENT_NAME}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={[styles.bell, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Feather name="bell" size={18} color={colors.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }] }}>
          {/* ───── CARTE SCOLARITÉ ───── */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ma scolarité</Text>

          <View style={styles.cardWrap}>
            <LinearGradient colors={['#2B2138', '#15101D', '#0A090E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              {/* brumes de couleur, très discrètes */}
              <LinearGradient
                pointerEvents="none"
                colors={[`${BRAND_ORANGE}40`, `${BRAND_ORANGE}00`]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0.35, y: 0.7 }}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                pointerEvents="none"
                colors={[`${BRAND_VIOLET}55`, `${BRAND_VIOLET}00`]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.6, y: 0.3 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.cardTop}>
                <Text style={styles.cardBrand}>Zenit · {SCHOOL_YEAR}</Text>
                <View style={styles.cardPill}>
                  <Feather name="users" size={12} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.cardPillText}>{CHILDREN_COUNT} enfants</Text>
                </View>
              </View>

              <View>
                <Text style={styles.cardLabel}>Reste à payer</Text>
                <View style={styles.cardAmountRow}>
                  <Text style={styles.cardAmount}>{formatAmount(remaining)}</Text>
                  <Text style={styles.cardCurrency}>FCFA</Text>
                </View>
              </View>

              <View>
                <View style={styles.track}>
                  <LinearGradient
                    colors={GRADIENT_BRAND}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.trackFill, { width: `${Math.round(progress * 100)}%` }]}
                  />
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardMeta}>{Math.round(progress * 100)} % réglé</Text>
                  <Text style={styles.cardMeta}>Échéance {NEXT_DUE_DATE}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ───── ACTIONS ───── */}
          <View style={styles.actions}>
            <QuickAction icon="arrow-up-right" label="Payer" onPress={goPay} />
            <QuickAction icon="file-text" label="Reçus" onPress={goReceipts} />
            <QuickAction icon="calendar" label="Échéancier" onPress={goSchedule} />
          </View>

          {/* ───── TRANSACTIONS ───── */}
          <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0, paddingHorizontal: 0 }]}>Transactions</Text>
            <TouchableOpacity onPress={goHistory} activeOpacity={0.7} accessibilityRole="button" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.viewAll, { color: BRAND_VIOLET }]}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {payments.map((p) => (
              <PaymentRow key={p.id} item={p} onPress={() => goPayment(p)} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 26 },
  hello: { flexDirection: 'row', alignItems: 'center' },
  helloRing: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  helloInner: { width: 43, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  helloInitial: { fontSize: 18, fontWeight: '600' },
  helloSmall: { fontSize: 12.5 },
  helloName: { fontSize: 16, fontWeight: '600', marginTop: 1, letterSpacing: -0.2 },
  bell: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 12, right: 13, width: 7, height: 7, borderRadius: 3.5, backgroundColor: BRAND_ORANGE },

  sectionTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, paddingHorizontal: 20, marginBottom: 14 },

  cardWrap: {
    marginHorizontal: 20,
    borderRadius: 28,
    shadowColor: BRAND_VIOLET,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    height: 196,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardBrand: { fontSize: 15, fontWeight: '300', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.4 },
  cardPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  cardPillText: { fontSize: 11.5, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  cardLabel: { fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },
  cardAmountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  cardAmount: { fontSize: 38, fontWeight: '300', color: '#FFFFFF', letterSpacing: -1 },
  cardCurrency: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 7, letterSpacing: 1 },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' },
  trackFill: { height: 4, borderRadius: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cardMeta: { fontSize: 11.5, color: 'rgba(255,255,255,0.6)' },

  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 20, marginBottom: 32 },
  action: { flex: 1, borderRadius: 22, borderWidth: 1, paddingVertical: 16, alignItems: 'center' },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, fontWeight: '600' },

  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  viewAll: { fontSize: 13, fontWeight: '600' },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowTitle: { fontSize: 14.5, fontWeight: '600', letterSpacing: -0.1 },
  rowSub: { fontSize: 12, marginTop: 3 },
  rowAmount: { fontSize: 14.5, fontWeight: '600' },
  rowStatus: { fontSize: 11.5, fontWeight: '600', marginTop: 3 },
});

export default PaymentsScreen;