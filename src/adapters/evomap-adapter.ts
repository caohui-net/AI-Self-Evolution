export interface EvoCapsule {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  problemType: string;
  strategy: string;
}

export interface EvomapAdapter {
  fetchCapsules(): Promise<EvoCapsule[]>;
  syncToLocal(capsules: EvoCapsule[]): Promise<void>;
}
