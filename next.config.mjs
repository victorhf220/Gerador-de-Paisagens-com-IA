/** @type {import('next').NextConfig} */
const nextConfig = {
  // Instrui o Next.js a não empacotar os módulos listados no lado do servidor.
  // Eles serão carregados a partir do node_modules em tempo de execução,
  // o que é essencial para a compatibilidade com o Genkit.
  serverExternalPackages: ['genkit', '@genkit-ai/google-ai'],
};

export default nextConfig;
