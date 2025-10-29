export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha) => {
  return senha && senha.length >= 6;
};

export const validarData = (data) => {
  const date = new Date(data);
  return date instanceof Date && !isNaN(date);
};

export const validarTextoMinimo = (texto, minLength = 10) => {
  return texto && texto.trim().length >= minLength;
};
