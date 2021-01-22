const sendCommand = (socket, method, data = null) => {
  const message = { method, data };
  socket.sendObj(message);
};

const sendJoin = (socket, data) => {
  sendCommand(
    socket,
    'JOIN',
    data,
  );
};

const sendSurrender = (socket, data) => {
  sendCommand(
    socket,
    'SURRENDER',
    data,
  );
};

const sendTurn = (socket, data) => {
  sendCommand(
    socket,
    'TURN',
    data,
  );
};

const onResponse = (route, socket, store, router, response) => {
  const message = JSON.parse(response.data);
  store.dispatch(message.method.toLowerCase(), message.data);
  switch (message.method) {
    case 'SESSION_INIT':
      router.push({ name: 'Session', query: { sid: message.data.sessionId } });
      break;
    case 'SESSION_SPECTATE':
      if (message.data.spectators.some((spectator) => spectator.userId === store.getters.userId)) {
        router.push({ name: 'Session', query: { sid: message.data.sessionId } });
      }
      break;
    case 'CONNECT':
      if (route.name === 'Session' && store.getters.joined) {
        console.log('Reconnect');
        sendCommand(socket, 'CONNECT', { userId: store.getters.userId });
      }
      break;
    default:
      console.log(`Unknown command: ${message.method}`);
  }
};

export default {
  onResponse,
  sendJoin,
  sendTurn,
  sendSurrender,
};
