// screens/shared/MessagingScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Image, Alert, Animated, Easing,
  StatusBar, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store';
import { useTheme } from '../../theme';
import { GroupDetails } from '../../components/GroupDetails';

// ─── IDENTITÉ ZENIT ───────────────────────────────────────────────────────
const VIOLET = '#7C3AED';
const ORANGE = '#F97316';
const GRADIENT: [string, string] = [VIOLET, ORANGE];
const NAME_COLORS = ['#7C3AED', '#F97316', '#0EA5E9', '#16A34A', '#DB2777', '#D97706'];
const colorOf = (s: string) => NAME_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % NAME_COLORS.length];
const pic = (n: number) => `https://i.pravatar.cc/200?img=${n}`;
const nowTime = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

// ─── TYPES ────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
  read?: boolean;
  kind?: 'text' | 'voice';
  duration?: number;
  avatar?: string;
  fresh?: boolean; // déclenche l'animation d'envoi
}
interface Conversation {
  id: string;
  nom: string;
  avatar?: string;
  dernierMessage: string;
  date: string;
  nonLus: number;
  online?: boolean;
  typing?: boolean;
  estGroupe?: boolean;
  membres?: string[];
  messages: Message[];
}
interface Props { type: 'student' | 'parent' | 'teacher'; onBack?: () => void }

// ─── MOCK ─────────────────────────────────────────────────────────────────
const m = (id: string, from: string, text: string, time: string, mine: boolean, avatar?: string, read = true): Message =>
  ({ id, from, text, time, mine, avatar, read });

const MOCK: Record<string, Conversation[]> = {
  student: [
    { id: '1', nom: 'Mme LOUBAKI', avatar: pic(5), dernierMessage: 'Écrit un message…', date: '11:02', nonLus: 0, online: true, typing: true,
      messages: [m('a1', 'Mme LOUBAKI', 'Bonjour Jean, as-tu fini l\'exercice 4 ?', '10:58', false, pic(5)), m('a2', 'Jean', 'Oui madame, je vous l\'envoie ce soir', '11:00', true)] },
    { id: '2', nom: 'Maman', avatar: pic(47), dernierMessage: 'Tu rentres à quelle heure ce soir ?', date: '11:44', nonLus: 1,
      messages: [m('b1', 'Maman', 'Tu rentres à quelle heure ce soir ?', '11:44', false, pic(47))] },
    { id: '3', nom: 'M. NGOMA', avatar: pic(12), dernierMessage: 'Cours de maths déplacé à jeudi', date: '10:18', nonLus: 0,
      messages: [m('c1', 'M. NGOMA', 'Cours de maths déplacé à jeudi', '10:15', false, pic(12)), m('c2', 'Jean', 'Merci monsieur !', '10:18', true)] },
    { id: '4', nom: 'Ma Classe · 3ème A', avatar: pic(33), estGroupe: true, dernierMessage: 'Marie : Un rattrapage ?', date: '09:35', nonLus: 3,
      membres: ['M. NGOMA', 'Mme LOUBAKI', 'Jean', 'Marie', 'Paul', 'Claire'],
      messages: [m('d1', 'M. NGOMA', 'Bonjour à tous, le cours de maths est annulé', '09:25', false, pic(12)), m('d2', 'Marie', 'Un rattrapage ?', '09:35', false, pic(32))] },
    { id: '5', nom: 'Club Informatique', avatar: pic(60), estGroupe: true, online: true, dernierMessage: 'Hackathon ce samedi à 9h', date: '09:08', nonLus: 0,
      membres: ['M. WAMBA', 'Jean', 'Marie', 'Paul'],
      messages: [m('e1', 'M. WAMBA', 'Hackathon ce samedi à 9h en salle info', '09:08', false, pic(15))] },
  ],
  parent: [
    { id: '6', nom: 'Mme LOUBAKI', avatar: pic(5), dernierMessage: 'Jean progresse très bien', date: '11:02', nonLus: 1, online: true,
      messages: [m('f1', 'Mme LOUBAKI', 'Jean progresse très bien en maths', '11:02', false, pic(5))] },
    { id: '7', nom: 'Direction', avatar: pic(68), dernierMessage: 'Réunion des parents le 25 oct', date: '10:18', nonLus: 0,
      messages: [m('g1', 'Direction', 'Réunion des parents le 25 oct à 18h', '10:18', false, pic(68))] },
    { id: '8', nom: 'Groupe Parents', avatar: pic(25), estGroupe: true, dernierMessage: 'M. NGAPI : Je serai présent', date: '09:35', nonLus: 2,
      membres: ['Mme MOUKOKO', 'M. NGAPI', 'Mme LOUBAKI', 'M. WAMBA'],
      messages: [m('h1', 'M. NGAPI', 'Je serai présent', '09:35', false, pic(7))] },
  ],
  teacher: [
    { id: '9', nom: 'M. MOUKOKO (parent)', avatar: pic(14), dernierMessage: 'Merci pour votre retour', date: '11:02', nonLus: 2, online: true,
      messages: [m('i1', 'M. MOUKOKO', 'Merci pour votre retour sur Jean', '11:02', false, pic(14))] },
    { id: '10', nom: 'Département Maths', avatar: pic(52), estGroupe: true, dernierMessage: 'Réunion des profs demain 15h', date: '10:18', nonLus: 3,
      membres: ['M. NGOMA', 'Mme LOUBAKI', 'M. MFOUMOU'],
      messages: [m('j1', 'M. NGOMA', 'Réunion des profs demain 15h', '10:18', false, pic(12))] },
    { id: '11', nom: '3ème A', avatar: pic(33), estGroupe: true, dernierMessage: 'Jean : Merci madame !', date: '09:08', nonLus: 0,
      membres: ['Jean', 'Marie', 'Paul', 'Claire'],
      messages: [m('k1', 'Jean', 'Merci madame !', '09:08', false, pic(2))] },
  ],
};
const REPLIES = ['D\'accord, merci ! 👍', 'Bien reçu', 'Parfait, à tout à l\'heure', 'Je regarde ça et je reviens vers vous', 'Super, merci pour l\'info 🙏'];

// ─── BRIQUES ──────────────────────────────────────────────────────────────
const Avatar = ({ uri, name, size, online, ring, colors }: { uri?: string; name: string; size: number; online?: boolean; ring?: boolean; colors: any }) => {
  const [failed, setFailed] = useState(false);
  const inner = ring ? size - 6 : size;
  const body = (
    <View style={{ width: inner, height: inner, borderRadius: inner / 2, overflow: 'hidden', backgroundColor: '#EDE4FF', alignItems: 'center', justifyContent: 'center' }}>
      {uri && !failed
        ? <Image source={{ uri }} style={{ width: inner, height: inner }} onError={() => setFailed(true)} />
        : <Text style={{ fontWeight: '700', color: '#16131F', fontSize: inner * 0.34 }}>{name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</Text>}
    </View>
  );
  return (
    <View style={{ width: size, height: size }}>
      {ring ? (
        <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ padding: 2, borderRadius: size / 2, backgroundColor: colors.background }}>{body}</View>
        </LinearGradient>
      ) : body}
      {online && <View style={{ position: 'absolute', right: 0, bottom: 0, width: size * 0.26, height: size * 0.26, borderRadius: size, backgroundColor: '#22C55E', borderWidth: 2, borderColor: colors.background }} />}
    </View>
  );
};

const TypingDots = ({ color }: { color: string }) => {
  const vals = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const loops = vals.map((v, i) => Animated.loop(Animated.sequence([
      Animated.delay(i * 150),
      Animated.timing(v, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.delay(300 - i * 150),
    ])));
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', height: 14 }}>
      {vals.map((v, i) => (
        <Animated.View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }), transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }} />
      ))}
    </View>
  );
};

const Ticks = ({ read, color }: { read?: boolean; color: string }) => (
  <View style={{ width: 16, height: 12, justifyContent: 'center' }}>
    <Feather name="check" size={12} color={color} />
    {read && <Feather name="check" size={12} color={color} style={{ position: 'absolute', left: 5 }} />}
  </View>
);

const bars = (id: string, n = 28) => Array.from({ length: n }, (_, i) => 5 + ((id.charCodeAt(i % id.length) * (i + 3)) % 17));

const VoiceBubble = ({ id, duration, mine, colors }: { id: string; duration: number; mine: boolean; colors: any }) => {
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const prog = useRef(new Animated.Value(0)).current;
  const h = useMemo(() => bars(id), [id]);
  useEffect(() => {
    const l = prog.addListener(({ value }) => setP(value));
    return () => prog.removeListener(l);
  }, []);
  const toggle = () => {
    if (playing) { prog.stopAnimation(); setPlaying(false); return; }
    setPlaying(true);
    const from = p >= 1 ? 0 : p;
    prog.setValue(from);
    Animated.timing(prog, { toValue: 1, duration: duration * 1000 * (1 - from), easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => finished && setPlaying(false));
  };
  const on = mine ? '#FFFFFF' : VIOLET;
  const off = mine ? 'rgba(255,255,255,0.4)' : colors.border;
  const shown = playing || p > 0 ? Math.round(duration * (1 - p)) : duration;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: 210 }}>
      <TouchableOpacity onPress={toggle} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: mine ? 'rgba(255,255,255,0.25)' : VIOLET + '20', alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={playing ? 'pause' : 'play'} size={16} color={on} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 24, gap: 2 }}>
          {h.map((v, i) => <View key={i} style={{ flex: 1, height: v, borderRadius: 2, backgroundColor: i / h.length < p ? on : off }} />)}
        </View>
        <Text style={{ fontSize: 10, marginTop: 2, color: mine ? 'rgba(255,255,255,0.75)' : colors.textMuted }}>
          {Math.floor(shown / 60)}:{String(shown % 60).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

// ─── BULLE (avec animation d'envoi) ───────────────────────────────────────
const Bubble = React.memo(({ item, showAvatar, showName, colors, onLongPress }: { item: Message; showAvatar: boolean; showName: boolean; colors: any; onLongPress: () => void }) => {
  const a = useRef(new Animated.Value(item.fresh ? 0 : 1)).current;
  useEffect(() => {
    if (item.fresh) Animated.spring(a, { toValue: 1, damping: 14, stiffness: 170, mass: 0.8, useNativeDriver: true }).start();
  }, []);
  const mine = item.mine;
  const content = (
    <>
      {showName && <Text style={{ fontSize: 11.5, fontWeight: '700', color: colorOf(item.from), marginBottom: 3 }}>{item.from}</Text>}
      {item.kind === 'voice'
        ? <VoiceBubble id={item.id} duration={item.duration || 5} mine={mine} colors={colors} />
        : <Text style={{ fontSize: 15, lineHeight: 21, color: mine ? '#FFFFFF' : colors.text }}>{item.text}</Text>}
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 4, marginTop: 3 }}>
        <Text style={{ fontSize: 10, color: mine ? 'rgba(255,255,255,0.75)' : colors.textMuted }}>{item.time}</Text>
        {mine && <Ticks read={item.read} color={item.read ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} />}
      </View>
    </>
  );
  const radius = { borderRadius: 20, borderBottomRightRadius: mine ? 6 : 20, borderBottomLeftRadius: mine ? 20 : 6 };
  return (
    <Animated.View style={{
      flexDirection: 'row', alignItems: 'flex-end', justifyContent: mine ? 'flex-end' : 'flex-start', marginVertical: 2,
      opacity: a,
      transform: [
        { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
        { translateX: a.interpolate({ inputRange: [0, 1], outputRange: [mine ? 40 : -40, 0] }) },
        { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
      ],
    }}>
      {!mine && (showAvatar
        ? <View style={{ marginRight: 8 }}><Avatar uri={item.avatar} name={item.from} size={30} colors={colors} /></View>
        : <View style={{ width: 38 }} />)}
      <TouchableOpacity activeOpacity={0.85} onLongPress={onLongPress} style={{ maxWidth: '78%' }}>
        {mine ? (
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[radius, { paddingHorizontal: 14, paddingVertical: 9 }]}>{content}</LinearGradient>
        ) : (
          <View style={[radius, { paddingHorizontal: 14, paddingVertical: 9, backgroundColor: colors.surfaceElevated }]}>{content}</View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── CONVERSATION ─────────────────────────────────────────────────────────
const Chat = ({ conv, onBack, onUpdate, me, colors }: { conv: Conversation; onBack: () => void; onUpdate: (id: string, msgs: Message[]) => void; me: string; colors: any }) => {
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Message[]>(conv.messages);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [rec, setRec] = useState(false);
  const [sec, setSec] = useState(0);
  const [members, setMembers] = useState(false);
  const listRef = useRef<FlatList>(null);
  const timer = useRef<any>(null);
  const timeouts = useRef<any[]>([]);
  const hasText = text.trim().length > 0;

  // morph micro ⇄ envoyer + envol de l'avion
  const morph = useRef(new Animated.Value(0)).current;
  const flight = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => { Animated.spring(morph, { toValue: hasText || rec ? 1 : 0, damping: 14, stiffness: 220, useNativeDriver: true }).start(); }, [hasText, rec]);
  useEffect(() => {
    if (!rec) { pulse.setValue(1); return; }
    const l = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.25, duration: 600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]));
    l.start();
    return () => l.stop();
  }, [rec]);
  useEffect(() => () => { clearInterval(timer.current); timeouts.current.forEach(clearTimeout); }, []);

  const commit = (next: Message[]) => { setMsgs(next); onUpdate(conv.id, next); };
  const later = (fn: () => void, ms: number) => { timeouts.current.push(setTimeout(fn, ms)); };

  const simulateReply = (base: Message[]) => {
    const who = conv.estGroupe ? (conv.membres || []).filter(n => n !== 'Jean')[Math.floor(Math.random() * 3)] || conv.nom : conv.nom;
    later(() => setTyping(true), 900);
    later(() => {
      setTyping(false);
      const reply: Message = { id: `r${Date.now()}`, from: who, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], time: nowTime(), mine: false, avatar: conv.avatar, fresh: true };
      commit([...base.map(x => (x.mine ? { ...x, read: true } : x)), reply]);
    }, 2800);
  };

  const fly = () => {
    flight.setValue(0);
    Animated.timing(flight, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };

  const send = () => {
    const base = [...msgs, { id: `s${Date.now()}`, from: me, text: text.trim(), time: nowTime(), mine: true, read: false, fresh: true } as Message];
    setText('');
    fly();
    commit(base);
    simulateReply(base);
  };

  const startRec = () => { setRec(true); setSec(0); timer.current = setInterval(() => setSec(s => s + 1), 1000); };
  const stopRec = (keep: boolean) => {
    clearInterval(timer.current);
    setRec(false);
    if (keep && sec >= 1) {
      fly();
      const base = [...msgs, { id: `v${Date.now()}`, from: me, text: 'Message vocal', kind: 'voice', duration: sec, time: nowTime(), mine: true, read: false, fresh: true } as Message];
      commit(base);
      simulateReply(base);
    }
    setSec(0);
  };

  const onLong = (it: Message) => it.mine && Alert.alert('Message', undefined, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: () => commit(msgs.filter(x => x.id !== it.id)) },
  ]);

  const sub = typing ? null : conv.estGroupe ? `${conv.membres?.length || 0} membres` : conv.online ? 'En ligne' : 'Hors ligne';

  const renderItem = useCallback(({ item, index }: { item: Message; index: number }) => {
    const next = msgs[index + 1];
    const prev = msgs[index - 1];
    const lastOfRun = !next || next.mine !== item.mine || next.from !== item.from;
    const firstOfRun = !prev || prev.mine !== item.mine || prev.from !== item.from;
    return <Bubble item={item} showAvatar={!!conv.estGroupe && lastOfRun} showName={!!conv.estGroupe && !item.mine && firstOfRun} colors={colors} onLongPress={() => onLong(item)} />;
  }, [msgs, colors]);

  const fmt = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* En-tête */}
      <View style={[s.chatHeader, { paddingTop: insets.top + 8, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={onBack} style={s.iconBtn}><Feather name="arrow-left" size={22} color={colors.text} /></TouchableOpacity>
        <Avatar uri={conv.avatar} name={conv.nom} size={42} online={conv.online && !conv.estGroupe} colors={colors} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16.5, fontWeight: '700', color: colors.text }} numberOfLines={1}>{conv.nom}</Text>
          {typing
            ? <Text style={{ fontSize: 12, fontWeight: '600', color: VIOLET }}>est en train d'écrire…</Text>
            : <Text style={{ fontSize: 12, color: conv.online && !conv.estGroupe ? '#16A34A' : colors.textMuted }}>{sub}</Text>}
        </View>
        {conv.estGroupe && <TouchableOpacity onPress={() => setMembers(true)} style={s.iconBtn}><Feather name="users" size={20} color={colors.text} /></TouchableOpacity>}
        <TouchableOpacity onPress={() => Alert.alert('Signaler', 'Voulez-vous signaler cette conversation ?', [{ text: 'Annuler', style: 'cancel' }, { text: 'Signaler', style: 'destructive' }])} style={s.iconBtn}>
          <Feather name="more-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={<View style={[s.dayChip, { backgroundColor: colors.surfaceElevated }]}><Text style={{ fontSize: 11.5, fontWeight: '600', color: colors.textMuted }}>Aujourd'hui</Text></View>}
        ListFooterComponent={typing ? (
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <View style={{ width: 38 }} />
            <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: 20, borderBottomLeftRadius: 6, paddingHorizontal: 16, paddingVertical: 14 }}>
              <TypingDots color={colors.textMuted} />
            </View>
          </View>
        ) : undefined}
      />

      {/* Composer */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: insets.bottom + 8, flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: colors.background }}>
        {!rec && (
          <TouchableOpacity activeOpacity={0.8} style={[s.round, { backgroundColor: colors.surfaceElevated }]} onPress={() => Alert.alert('Pièces jointes', 'Bientôt disponible')}>
            <Feather name="plus" size={22} color={VIOLET} />
          </TouchableOpacity>
        )}

        <View style={[s.pill, { backgroundColor: colors.surfaceElevated, borderColor: rec ? '#EF444455' : colors.border }]}>
          {rec ? (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 }}>
              <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', opacity: pulse }} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>{fmt}</Text>
              <Text style={{ flex: 1, fontSize: 13, color: colors.textMuted }} numberOfLines={1}>Enregistrement…</Text>
              <TouchableOpacity onPress={() => stopRec(false)} hitSlop={10}><Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>Annuler</Text></TouchableOpacity>
            </View>
          ) : (
            <TextInput
              style={{ flex: 1, fontSize: 15.5, color: colors.text, paddingTop: 11, paddingBottom: 11, maxHeight: 120 }}
              placeholder="Message"
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              multiline
            />
          )}
        </View>

        {/* Bouton micro ⇄ envoyer */}
        <View style={{ width: 46, height: 46 }}>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ scale: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) }] }]} pointerEvents={hasText || rec ? 'none' : 'auto'}>
            <TouchableOpacity activeOpacity={0.8} onPress={startRec} style={[s.round, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="mic" size={21} color={VIOLET} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: morph, transform: [{ scale: morph.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }, { rotate: morph.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) }] }]} pointerEvents={hasText || rec ? 'auto' : 'none'}>
            <TouchableOpacity activeOpacity={0.85} onPress={rec ? () => stopRec(true) : send}>
              <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.round}>
                <Animated.View style={{
                  opacity: flight.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0, 1] }),
                  transform: [
                    { translateX: flight.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, 26, -18, 0] }) },
                    { translateY: flight.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, -26, 18, 0] }) },
                  ],
                }}>
                  <Feather name="send" size={20} color="#FFFFFF" style={{ marginLeft: -2, marginTop: 1 }} />
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {conv.estGroupe && (
        <GroupDetails
          visible={members}
          onClose={() => setMembers(false)}
          groupName={conv.nom}
          members={conv.membres || []}
          colors={colors}
          onReportMember={(mb: string) => Alert.alert('Membre signalé', `${mb} a été signalé avec succès.`)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

// ─── LISTE ────────────────────────────────────────────────────────────────
export const MessagingScreen: React.FC<Props> = ({ type, onBack }) => {
  const { colors, isDark } = useTheme();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { setConvs(MOCK[type] || []); }, [type]);

  const update = useCallback((id: string, msgs: Message[]) => {
    setConvs(prev => prev.map(c => {
      if (c.id !== id) return c;
      const last = msgs[msgs.length - 1];
      return { ...c, messages: msgs, nonLus: 0, typing: false, dernierMessage: last ? (last.kind === 'voice' ? '🎤 Message vocal' : last.text) : '', date: last?.time || c.date };
    }));
  }, []);

  const open = convs.find(c => c.id === openId);
  if (open) {
    return <Chat key={open.id} conv={open} onBack={() => setOpenId(null)} onUpdate={update} me={user?.prenoms || 'Moi'} colors={colors} />;
  }

  const list = convs.filter(c => (c.nom + c.dernierMessage).toLowerCase().includes(q.toLowerCase()));

  const renderItem = ({ item }: { item: Conversation }) => {
    const last = item.messages[item.messages.length - 1];
    const mineLast = last?.mine && !item.typing;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => setOpenId(item.id)} style={s.row}>
        <Avatar uri={item.avatar} name={item.nom} size={56} online={item.online && !item.estGroupe} colors={colors} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: colors.text }} numberOfLines={1}>{item.nom}</Text>
            <Text style={{ fontSize: 12, color: item.nonLus ? VIOLET : colors.textMuted, fontWeight: item.nonLus ? '700' : '400' }}>{item.date}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            {item.typing ? (
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: VIOLET }}>Écrit un message…</Text>
            ) : (
              <Text style={{ flex: 1, fontSize: 14, color: item.nonLus ? colors.text : colors.textMuted, fontWeight: item.nonLus ? '600' : '400' }} numberOfLines={1}>{item.dernierMessage}</Text>
            )}
            {item.nonLus > 0 ? (
              <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.badge}>
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '800' }}>{item.nonLus}</Text>
              </LinearGradient>
            ) : mineLast ? <Ticks read={last?.read} color={last?.read ? VIOLET : colors.textMuted} /> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {onBack && <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}><Feather name="arrow-left" size={24} color={colors.text} /></TouchableOpacity>}
          <Text style={{ flex: 1, fontSize: 32, fontWeight: '800', letterSpacing: -0.8, color: colors.text }}>Messages</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => Alert.alert('Nouveau message', 'Bientôt disponible')}>
            <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.compose}>
              <Feather name="edit-2" size={19} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Raccourcis : recherche + contacts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18, marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, alignItems: 'center' }}>
          {searching ? (
            <View style={[s.search, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="search" size={18} color={colors.textMuted} />
              <TextInput autoFocus value={q} onChangeText={setQ} placeholder="Rechercher…" placeholderTextColor={colors.textMuted} style={{ flex: 1, marginHorizontal: 8, color: colors.text, fontSize: 15 }} />
              <TouchableOpacity onPress={() => { setSearching(false); setQ(''); }}><Feather name="x" size={18} color={colors.textMuted} /></TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSearching(true)} style={[s.searchCircle, { borderColor: colors.border }]}>
                <Feather name="search" size={22} color={colors.text} />
              </TouchableOpacity>
              {convs.map(c => (
                <TouchableOpacity key={c.id} activeOpacity={0.8} onPress={() => setOpenId(c.id)}>
                  <Avatar uri={c.avatar} name={c.nom} size={58} ring={c.nonLus > 0} colors={colors} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }} tintColor={VIOLET} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 48, alignItems: 'center' }}>
            <Feather name={q ? 'search' : 'message-circle'} size={34} color={VIOLET} />
            <Text style={{ marginTop: 14, fontSize: 17, fontWeight: '700', color: colors.text }}>{q ? 'Aucun résultat' : 'Aucune conversation'}</Text>
          </View>
        }
      />
    </View>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  compose: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  searchCircle: { width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, paddingHorizontal: 16, width: 330 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  dayChip: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 10 },
  round: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 46, borderRadius: 24, paddingHorizontal: 16, borderWidth: 1 },
});