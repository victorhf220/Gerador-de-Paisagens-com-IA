import type { SimulatedJob } from './types';

/**
 * Armazenamento em memória para simular um banco de dados de jobs.
 * Em um aplicativo de produção, use um banco de dados real como Firestore, Redis ou PostgreSQL.
 * A chave é o `jobId` e o valor é o objeto `SimulatedJob`.
 */
export const SIMULATED_JOBS = new Map<string, SimulatedJob>();
