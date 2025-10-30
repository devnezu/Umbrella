const toUserDTO = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    status: user.status,
    disciplinas: user.disciplinas,
    turmas: user.turmas,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const toUserProfileDTO = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    status: user.status,
    disciplinas: user.disciplinas,
    turmas: user.turmas,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  toUserDTO,
  toUserProfileDTO,
};