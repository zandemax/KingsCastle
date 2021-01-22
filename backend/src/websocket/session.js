const helpers = require('./helpers');

class Session {
  constructor(
    sessionId,
    pointsLeft,
    userA,
    privateSession,
  ) {
    this.sessionId = sessionId;
    this.dots = {};
    this.polygons = [];
    this.userSessionA = UserSession(userA);
    this.userSessionB = null;
    this.private = privateSession;
    this.spectators = [];
    this.currentUsersTurn = userA.userId;
    this.startTime = helpers.getUnixTime();
  }

  joinB(userB, connection) {
    this.userSessionB = new UserSession(userB);
  }
  
  joinSpectator(spectator) {
    this.spectators.add(spectator);
  }
  
  sendUpdate(update) {
    this.userSessionA.connection.send(update);
    this.userSessionB.connection.send(update);
    this.spectators.forEach(spectator => spectator.connection.send(update));
  }
  
  hasPlayerB() {
    return this.userSessionB != null;
  }
}

class UserSession {
  constructor(user, connection) {
    this.user = user;
    this.connection = connection;
    this.points = 0;
    this.dotsLeft = 0;
  }
}

class SpecatorSession {
  constructor(user, connection) {
    this.user = user;
    this.connection = connection;
  }
}

module.exports = Session;