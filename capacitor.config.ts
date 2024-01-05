import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.patecnik.app',
    appName: 'Pátečník',
    webDir: 'build',
    server: {
        cleartext: true
    }
};

export default config;