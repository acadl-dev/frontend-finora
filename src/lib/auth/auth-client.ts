/**
 * Camada de autenticação (client-side).
 *
 * Este arquivo é o PONTO CENTRAL da arquitetura de autenticação.
 * As telas de login e cadastro chamam apenas as funções daqui, então
 * eu só preciso implementar o back-end abaixo (chamada de API, Better Auth,
 * Supabase, Firebase, etc.) sem tocar na UI.
 *
 * Substituir o conteúdo de cada função pela sua lógica real.
 */

export type User = {
  id: string
  name: string
  email: string
}

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string }

export type SignInInput = {
  email: string
  password: string
  remember?: boolean
}

export type SignUpInput = {
  name: string
  email: string
  password: string
}

/**
 * Autentica um usuário com email e senha.
 *
 * TODO: conecte ao back-end. Exemplo:
 *
 *   const res = await fetch("/api/auth/sign-in", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(input),
 *   })
 *   if (!res.ok) return { success: false, error: "Credenciais inválidas" }
 *   return { success: true, user: await res.json() }
 */
export async function signIn(input: SignInInput): Promise<AuthResult> {
  // Simulação temporária apenas para a UI funcionar.
  await delay(800)
  console.log("[v0] signIn chamado com:", input.email)
  return {
    success: false,
    error: "Autenticação ainda não conectada ao back-end.",
  }
}

/**
 * Cria uma nova conta com email e senha.
 *
 * TODO: conectar ao back-end (mesmo padrão do signIn).
 */
export async function signUp(input: SignUpInput): Promise<AuthResult> {
  // Simulação temporária apenas para a UI funcionar.
  await delay(800)
  console.log("[v0] signUp chamado com:", input.email)
  return {
    success: false,
    error: "Cadastro ainda não conectado ao back-end.",
  }
}

/**
 * Encerra a sessão do usuário atual.
 *
 * TODO: conectar ao back-end.
 */
export async function signOut(): Promise<void> {
  await delay(300)
  console.log("[v0] signOut chamado")
}

/**
 * Retorna o usuário logado atualmente, ou null.
 *
 * TODO: conectar ao back-end / leitura de sessão.
 */
export async function getSession(): Promise<User | null> {
  await delay(300)
  return null
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
