export default class Endpoint {
  public static get baseUrl(): string {
    return "https://task-manager-service.azurewebsites.net/api/";
  }
  public static getAllRole: string = this.baseUrl + "roles/";
  public static editUserUrl: string = this.baseUrl + "user";
  public static getAllUser: string = this.baseUrl + "users/";
  public static getAllProject: string = this.baseUrl + "users/";
  public static getProjectByCode: string = this.baseUrl + "users/";
  public static createProject: string = this.baseUrl + "users/";
  public static updateProject: string = this.baseUrl + "users/";
  public static deleteProject: string = this.baseUrl + "users/";
  public static getPriorities: string = this.baseUrl + "projects/";
  public static getIssueType: string = this.baseUrl + "projects/";
  public static getStatus: string = this.baseUrl + "projects/";
  public static getPriority: string = this.baseUrl + "projects/";
  public static createSprint: string = this.baseUrl + "projects/";
  public static startSprint: string = this.baseUrl + "projects/";
  public static completeSprint: string = this.baseUrl + "projects/";
  public static getSprintById: string = this.baseUrl + "projects/";
  public static updateSprint: string = this.baseUrl + "projects/";
  public static deleteSprint: string = this.baseUrl + "projects/";
  public static createBacklogIssue: string = this.baseUrl + "backlogs/";
  public static createSprintIssue: string = this.baseUrl + "sprints/";
  public static createEpic: string = this.baseUrl + "projects/";
  public static updateEpic: string = this.baseUrl + "projects/";
  public static getSprintIssue: string = this.baseUrl + "projects/";
  public static getAll: string = this.baseUrl + "projects/";
  public static getIssue: string = this.baseUrl + "issues/";
  public static upload: string = this.baseUrl + "issues/";
  public static getFiles: string = this.baseUrl + "issues/";
  public static getIssueHistories: string = this.baseUrl + "issues/";
  public static getIssueComment: string = this.baseUrl + "issues/";
  public static deleteIssue: string = this.baseUrl + "sprints/";
  public static editSprintIssue: string = this.baseUrl + "sprints/";
  public static editBacklogIssue: string = this.baseUrl + "backlogs/";
  public static loginUrl: string = this.baseUrl + "users/signin";
  public static signUpUrl: string = this.baseUrl + "users/signup";
}
