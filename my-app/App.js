import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ShoesScreen from './screens/ShoesScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminPage from './admin/admin';
import ShoeDetail from './screens/ShoeDetail';

const resolveApiBaseUrl = () => {
  const globalOverride = globalThis?.REACT_NATIVE_API_BASE_URL;
  const envOverride = typeof process !== 'undefined'
    ? (process.env?.EXPO_PUBLIC_API_BASE_URL || process.env?.API_BASE_URL)
    : undefined;

  if (typeof globalOverride === 'string' && globalOverride.length > 0) {
    return globalOverride;
  }

  if (typeof envOverride === 'string' && envOverride.length > 0) {
    return envOverride;
  }

  if (Platform.OS === 'android') {
    // Explicit IP requested by user for Android emulator/device testing
    return 'http://192.168.1.4:5000';
  }

  // Default fallback (also matches requested IP for other platforms)
  return 'http://192.168.1.4:5000';
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/+$/, '')}/api`,
  timeout: 10000,
});

if (__DEV__) {
  console.log('[network] Using API base URL:', api.defaults.baseURL);
}

export default function App() {
  // States
  const [screen, setScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('home');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shoes, setShoes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedShoe, setSelectedShoe] = useState(null);

  // Fetch shoes when on home screen or shoes screen
  useEffect(() => {
    if (screen === 'home' || screen === 'shoes') fetchShoes();
  }, [screen]);

  // Fetch cart items when on cart screen
  useEffect(() => {
    if (screen === 'cart' && isLoggedIn) fetchCartItems();
  }, [screen, isLoggedIn]);

  const fetchShoes = async () => {
    try {
      const res = await api.get('/shoes');
      if (res.data.success && Array.isArray(res.data.shoes)) {
        setShoes(res.data.shoes);
      } else if (Array.isArray(res.data)) {
        setShoes(res.data);
      } else {
        setShoes([]);
      }
    } catch (error) {
      console.error('Failed to fetch shoes:', error.message);
      setShoes([]);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success && Array.isArray(res.data.items)) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error.message);
      setCartItems([]);
    }
  };

  const handleSubmit = async (type) => {
    const { email, password, fullName, phone, confirmPassword } = form;

    if (type === 'login') {
      if (email === 'admin@gmail.com' && password === 'admin123') {
        setMessage('Admin logged in successfully!');
        setTimeout(() => setMessage(null), 1500);
        setIsLoggedIn(true);
        setIsAdmin(true);
        setScreen('home');
        setActiveTab('home');
        setForm({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
        return;
      }

      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      try {
        const res = await api.post('/login', { email, password });
        if (res.data.success) {
          setMessage('User logged in successfully!');
          setTimeout(() => setMessage(null), 1500);
          setIsLoggedIn(true);
          setIsAdmin(false);
          setScreen('home');
          setActiveTab('home');
          setForm({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
        } else {
          Alert.alert('Login Failed', res.data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Login Failed', error.response?.data?.message || 'Unable to reach server.');
      }
    } else if (type === 'register') {
      if (!validateRegisterForm()) return;

      try {
        const res = await api.post('/register', {
          fullName, phone, email, password, confirmPassword,
        });

        if (res.data.success) {
          setMessage('Registered successfully! You can login now.');
          setTimeout(() => setMessage(null), 1500);
          setScreen('login');
          setForm({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
        } else {
          Alert.alert('Registration Failed', res.data.message || 'Registration failed.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert('Registration Failed', error.response?.data?.message || 'Unable to reach server.');
      }
    }
  };

  const validateRegisterForm = () => {
    const { fullName, phone, email, password, confirmPassword } = form;
    
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }
    
    return true;
  };

  const handleTabPress = (tab) => {
    // Only cart requires login
    if (tab === 'cart' && !isLoggedIn) {
      Alert.alert('Login Required', 'Please login to access your cart.');
      return;
    }
    
    // Profile redirects to login if not logged in
    if (tab === 'profile' && !isLoggedIn) {
      setScreen('login');
      return;
    }
    
    setActiveTab(tab);
    setScreen(tab);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setScreen('home');
    setActiveTab('home');
    setCartItems([]);
    setMessage('Logged out successfully!');
    setTimeout(() => setMessage(null), 1500);
  };

  if (isAdmin) {
    return (
      <AdminPage
        onLogout={() => {
          setIsAdmin(false);
          setIsLoggedIn(false);
          setScreen('home');
          setActiveTab('home');
          setMessage('Admin logged out.');
          setTimeout(() => setMessage(null), 1500);
        }}
      />
    );
  }

  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <LoginScreen
          form={form}
          setForm={setForm}
          onSubmit={() => handleSubmit('login')}
          onBack={() => setScreen('register')}
          onSkip={() => {
            setScreen('home');
            setActiveTab('home');
          }}
        />
        {/* Bottom Tab Navigation - Always visible */}
        <View style={styles.bottomTab}>
          <TabItem 
            icon="🏠" 
            label="Home" 
            isActive={activeTab === 'home'}
            onPress={() => {
              setActiveTab('home');
              setScreen('home');
            }}
          />
          <TabItem 
            icon="👟" 
            label="Shoes" 
            isActive={activeTab === 'shoes'}
            onPress={() => {
              setActiveTab('shoes');
              setScreen('shoes');
            }}
          />
          <CenterButton onPress={() => handleTabPress('cart')} />
          <TabItem 
            icon="🛒" 
            label="Cart" 
            isActive={activeTab === 'cart'}
            onPress={() => handleTabPress('cart')}
          />
          <TabItem 
            icon="👤" 
            label="Login" 
            isActive={false}
            onPress={() => setScreen('login')}
          />
        </View>
      </View>
    );
  }

  if (screen === 'register') {
    return (
      <View style={styles.container}>
        <RegisterScreen
          form={form}
          setForm={setForm}
          onSubmit={() => handleSubmit('register')}
          onBack={() => setScreen('login')}
        />
        {/* Bottom Tab Navigation - Always visible */}
        <View style={styles.bottomTab}>
          <TabItem 
            icon="🏠" 
            label="Home" 
            isActive={activeTab === 'home'}
            onPress={() => {
              setActiveTab('home');
              setScreen('home');
            }}
          />
          <TabItem 
            icon="👟" 
            label="Shoes" 
            isActive={activeTab === 'shoes'}
            onPress={() => {
              setActiveTab('shoes');
              setScreen('shoes');
            }}
          />
          <CenterButton onPress={() => handleTabPress('cart')} />
          <TabItem 
            icon="🛒" 
            label="Cart" 
            isActive={activeTab === 'cart'}
            onPress={() => handleTabPress('cart')}
          />
          <TabItem 
            icon="👤" 
            label="Login" 
            isActive={false}
            onPress={() => setScreen('login')}
          />
        </View>
      </View>
    );
  }

  if (screen === 'detail' && selectedShoe) {
    return (
      <ShoeDetail
        shoe={selectedShoe}
        onBack={() => {
          setSelectedShoe(null);
          setScreen(activeTab);
        }}
        isLoggedIn={isLoggedIn}
        onSubmitRating={(rating) => {
          if (!isLoggedIn) {
            Alert.alert('Login Required', 'Please login to rate products.');
            return;
          }
          api.post(`/shoes/${selectedShoe._id}/rate`, { rating })
            .then(() => fetchShoes())
            .catch(err => console.error(err));
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        {screen === 'home' && (
          <HomeScreen
            shoes={shoes}
            isLoggedIn={isLoggedIn}
            message={message}
            setScreen={setScreen}
            setSelectedShoe={setSelectedShoe}
          />
        )}
        
        {screen === 'shoes' && (
          <ShoesScreen
            shoes={shoes}
            setSelectedShoe={setSelectedShoe}
            setScreen={setScreen}
            isLoggedIn={isLoggedIn}
          />
        )}
        
        {screen === 'cart' && isLoggedIn && (
          <CartScreen
            cartItems={cartItems}
            fetchCartItems={fetchCartItems}
          />
        )}
        
        {screen === 'profile' && isLoggedIn && (
          <ProfileScreen
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Bottom Tab Navigation - Always visible */}
      <View style={styles.bottomTab}>
        <TabItem 
          icon="🏠" 
          label="Home" 
          isActive={activeTab === 'home'}
          onPress={() => {
            setActiveTab('home');
            setScreen('home');
          }}
        />
        <TabItem 
          icon="👟" 
          label="Shoes" 
          isActive={activeTab === 'shoes'}
          onPress={() => {
            setActiveTab('shoes');
            setScreen('shoes');
          }}
        />
        <CenterButton onPress={() => handleTabPress('cart')} />
        <TabItem 
          icon="🛒" 
          label="Cart" 
          isActive={activeTab === 'cart'}
          onPress={() => handleTabPress('cart')}
        />
        <TabItem 
          icon="👤" 
          label={isLoggedIn ? 'Profile' : 'Login'} 
          isActive={activeTab === 'profile'}
          onPress={() => handleTabPress('profile')}
        />
      </View>
    </View>
  );
}

// Reusable Tab Item Component
const TabItem = ({ icon, label, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.tabItem, isActive && styles.activeTab]} 
    onPress={onPress}
  >
    <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>{icon}</Text>
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

// Reusable Center Button Component
const CenterButton = ({ onPress }) => (
  <TouchableOpacity 
    style={styles.centerButton}
    onPress={onPress}
  >
    <Text style={styles.centerButtonIcon}>+</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    marginBottom: 70, // Space for bottom tab bar
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTab: {
    // Active state styling
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#888',
  },
  activeTabIcon: {
    color: '#3b82f6',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  centerButton: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centerButtonIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});