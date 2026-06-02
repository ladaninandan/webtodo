import NetInfo from '@react-native-community/netinfo';

class NetworkService {
  _isOnline = false;
  _listeners = [];

  constructor() {
    NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      const changed = online !== this._isOnline;
      this._isOnline = online;
      if (changed) {
        this._listeners.forEach(fn => fn(online));
      }
    });
  }

  isOnline() {
    return this._isOnline;
  }

  // check connection change
  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  }

  //check current state
  async fetchState() {
    const state = await NetInfo.fetch();
    this._isOnline = !!state.isConnected && !!state.isInternetReachable;
    return this._isOnline;
  }
  
}

export default new NetworkService(); // singleton