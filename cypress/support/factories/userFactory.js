let userSequence = 0;

function nextUserId() {
  userSequence += 1;
  return `${Date.now()}-${userSequence}`;
}

function buildStandardUser() {
  return {
    nome: 'Test User',
    email: `test.user.${nextUserId()}@example.com`,
    password: 'test123',
    administrador: 'false',
  };
}

function buildAdminUser() {
  return {
    nome: 'Admin User',
    email: `admin.user.${nextUserId()}@example.com`,
    password: 'admin123',
    administrador: 'true',
  };
}

module.exports = { buildAdminUser, buildStandardUser };
