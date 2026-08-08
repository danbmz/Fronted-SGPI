let navegar: ((path: string) => void) | null = null;

export function registrarNavegador(fn: (path: string) => void) {
  navegar = fn;
}

export function irA(path: string) {
  if (navegar) {
    navegar(path);
  } else {
    console.warn("Navegador no registrado todavía");
  }
}