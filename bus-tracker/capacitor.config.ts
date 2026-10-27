import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bustrack.app',
  appName: 'TNSTC Bus Tracker',
  webDir: 'out',
  server: {
    // Point to the live Vercel deployment so the APK works without a local server
    url: 'https://bus-tracker-henna-two.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0f172a',
  },
};

export default config;
