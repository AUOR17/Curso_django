export type Gremio = {
    id: number;
    nombre: string; 
    descripcion: string;
}

export type Cazador = {
    id: number;
    username: string; 
    role: string;
    level: number; 
    gold: string;
    gremio_id: number | null;
    gremio_nombre: string | null;
}

export type Candidato = {
    id: number;
    username: string;
    role: string;
}

export type Lead = {
    id: number;
    name: string;
    race_class: string;
    threat_level: number;
    estimated_reward: string;
    status: string;
    days_in_funnel: number;
    hunter_name: string | null
}

export type Quest = {
    id: number;
    title: string;
    description: string;
    status: string;
    difficulty_leve: number;
    gremio_nombre: string | null;
    potential_reward: string;
    assigned_to_details?: {
        id:number;
        username: string;
        role: string;
        level: number;
    } | null
}