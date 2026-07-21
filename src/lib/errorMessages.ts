// Sanitize Supabase error messages to prevent information leakage
const knownErrors: Record<string, string> = {
  'Invalid login credentials': 'Email ou senha incorretos',
  'User already registered': 'Este email já está cadastrado',
  'Email not confirmed': 'Por favor, confirme seu email',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
  'Signup requires a valid password': 'A senha deve ter pelo menos 6 caracteres',
  'Unable to validate email address: invalid format': 'Formato de email inválido',
  'User not found': 'Usuário não encontrado',
  'Email rate limit exceeded': 'Muitas tentativas. Tente novamente mais tarde.',
  'For security purposes, you can only request this once every 60 seconds': 'Aguarde 60 segundos antes de tentar novamente',
};

export function getSafeErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return "Ocorreu um erro. Por favor, tente novamente.";
  }
  
  const message = (error as { message: unknown }).message;
  if (typeof message !== "string") {
    return "Ocorreu um erro. Por favor, tente novamente.";
  }
  
  return knownErrors[message] || "Ocorreu um erro. Por favor, tente novamente.";
}
