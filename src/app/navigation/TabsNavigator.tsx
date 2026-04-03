/**
 * MercyB: Advisor Navigation Engine (Executive Hardening)
 * Path: src/app/navigation/TabsNavigator.tsx
 * Strategy: Mercy | Mastery | Journeys | VIP logic with Slim-Line UI.
 * Protocol V4.0: Full Fixed File.
 */

import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Sparkles, BarChart3, Map, Crown } from 'lucide-react-native'; 
import { useSubscription } from '@/hooks/useSubscription';
import MercyScreen from '@/screens/MercyScreen'; 
import MasteryScreen from '@/screens/MasteryScreen';
import JourneysScreen from '@/screens/JourneysScreen';
import VIPClubScreen from '@/screens/VIPClubScreen';

const Tab = createBottomTabNavigator();

// --- 📐 ELITE SCALING PROTOCOL ---
const ICON_SCALE = 0.85;
const MERCY_BLUE = '#007AFF';
const MUTED_SLATE = '#A1A1AA';
const VIP_GOLD = '#FFD700'; // Elite Status Accent

export default function TabsNavigator() {
  const { isVip, userTier } = useSubscription();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: MERCY_BLUE,
        tabBarInactiveTintColor: MUTED_SLATE,
        tabBarLabelPosition: 'below-icon',
        
        // --- 🏗️ EXECUTIVE COMPRESSION ---
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 54,
          paddingBottom: Platform.OS === 'ios' ? 32 : 6,
          paddingTop: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(0,0,0,0.08)',
          elevation: 0,
          position: 'absolute', // Allows content to flow behind for "Floating" effect
        },

        // --- ✍️ TYPOGRAPHY HARDENING ---
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500', 
          letterSpacing: 0.2,
          marginTop: -2,
        },
      }}
    >
      {/* 🕊️ Pillar 1: Mercy (AI Advisor) */}
      <Tab.Screen 
        name="Mercy" 
        component={MercyScreen}
        options={{ 
          tabBarLabel: 'Mercy',
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={size * ICON_SCALE} color={color} strokeWidth={2.5} />
          )
        }}
      />

      {/* 🎙️ Pillar 2: Mastery (Phonics/Grammar) */}
      <Tab.Screen 
        name="Mastery" 
        component={MasteryScreen}
        options={{ 
          tabBarLabel: 'Mastery',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size * ICON_SCALE} color={color} strokeWidth={2.5} />
          )
        }}
      />

      {/* 🗺️ Pillar 3: Journeys (400+ Rooms) */}
      <Tab.Screen 
        name="Journeys" 
        component={JourneysScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isVip) {
              e.preventDefault();
              navigation.navigate('VIP', { 
                trigger: 'journey_gate',
                msg: "Unlock 400+ advanced rooms with VIP." 
              });
            }
          },
        })}
        options={{ 
          tabBarLabel: 'Journeys',
          tabBarIcon: ({ color, size }) => (
            <Map size={size * ICON_SCALE} color={color} strokeWidth={2.5} />
          )
        }}
      />

      {/* 🏆 Pillar 4: VIP (Tier & Growth) */}
      <Tab.Screen 
        name="VIP" 
        component={VIPClubScreen}
        options={{ 
          tabBarLabel: 'VIP',
          tabBarBadge: isVip ? `V${userTier}` : undefined,
          tabBarBadgeStyle: {
            backgroundColor: isVip ? VIP_GOLD : MERCY_BLUE,
            color: isVip ? '#000' : '#fff',
            fontSize: 9,
            fontWeight: '900',
            marginTop: -2,
          },
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              {/* --- 🌟 THE VIP GLOW --- */}
              {isVip && (
                <View style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: VIP_GOLD,
                  opacity: 0.12,
                }} />
              )}
              <Crown 
                size={size * ICON_SCALE} 
                color={isVip ? VIP_GOLD : color} 
                strokeWidth={2.5} 
              />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}