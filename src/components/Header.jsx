export default function Header() {
  return (
    <header className="mb-4 text-center">
      <h1 className="text-accent neon-accent text-2xl md:text-4xl font-bold">
        JOAO ZANARDO
      </h1>
      <p>Bem-vindo ao meu portfólio terminal!</p>
      <p>
        Digite{' '}
        <span className="text-accent neon-accent font-bold">'help'</span>{' '}
        para ver a lista de comandos.
      </p>
    </header>
  );
}
