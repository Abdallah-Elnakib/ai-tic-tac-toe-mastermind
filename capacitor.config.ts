
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7bfb47cffde74bf9b686270f0b61d83d',
  appName: 'ai-tic-tac-toe-mastermind',
  webDir: 'dist',
  server: {
    url: "https://7bfb47cf-fde7-4bf9-b686-270f0b61d83d.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: false
    }
  }
};

export default config;
