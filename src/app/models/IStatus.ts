export interface IStatus {
  id: string;
  name: string;
  description: string;
  projectId: string;
  statusCategoryId: string;
  isMain: boolean;
  issueCount: number;
}
