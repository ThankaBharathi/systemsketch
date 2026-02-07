export interface DesignCreate {
  name: string;
  description?: string;
  nodes: string;
  edges: string;
  userId: string;
}

export interface DesignUpdate {
  name?: string;
  description?: string;
  nodes?: string;
  edges?: string;
}

export interface DesignResponse {
  id: string;
  name: string;
  description: string | null;
  nodes: string;
  edges: string;
  thumbnailUrl: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}