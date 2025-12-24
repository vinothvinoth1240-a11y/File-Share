
export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: Blob;
  createdAt: number;
}

export enum ViewMode {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD'
}
