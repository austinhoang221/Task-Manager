import { IBacklog } from "./IBacklog";
import { IProjectConfiguration } from "./IIProjectConfiguration";
import { IIssue } from "./IIssue";
import { IIssueType } from "./IIssueType";
import { ILabel } from "./ILabel";
import { IPermissionGroup } from "./IPermission";
import { IPriority } from "./IPriority";
import { IIssueOnBoard } from "./IProject";
import { ISprint } from "./ISprint";
import { IStatus } from "./IStatus";
import { IUser } from "./IUser";

export interface IDetailProject {
  id: string;
  name: string;
  code: string;
  description: string;
  avatarUrl: string;
  isFavorite: boolean;
  leader: IUser;
  members: IUser[];
  epics: IIssue[];
  backlog: IBacklog;
  sprints: ISprint[];
  issueTypes: IIssueType[];
  statuses: IStatus[];
  issueOnBoard: IIssueOnBoard;
  userPermissionGroup: IPermissionGroup;
  projectConfiguration: IProjectConfiguration;
  labels: ILabel[];
  priorities: IPriority[];
}
