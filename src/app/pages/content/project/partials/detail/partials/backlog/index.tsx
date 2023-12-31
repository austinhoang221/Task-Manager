import {
  Button,
  Col,
  Collapse,
  Divider,
  Dropdown,
  List,
  Menu,
  message,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import "./index.scss";
import HeaderProject from "../header";
import { ReactNode, useEffect, useState } from "react";
import CreateIssueInput from "../../../../../../components/create-issue-input";
import IssueType from "../../../../../../components/issue-type";
import SubMenu from "antd/es/menu/SubMenu";
import UserAvatar from "../../../../../../components/user-avatar";
import SelectUser from "../../../../../../components/select-user";
import EditIssueInput from "../../../../../../components/edit-issue-input";
import { ISprint } from "../../../../../../../models/ISprint";
import { IIssue } from "../../../../../../../models/IIssue";
import { SprintService } from "../../../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../../../helpers";
import {
  getProjectByCode,
  setIsShowEpic,
  setSprints,
} from "../../../../../../../../redux/slices/projectDetailSlice";
import dayjs from "dayjs";
import { IssueService } from "../../../../../../../../services/issueService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import IssueStatusSelect from "../../../../../../components/issue-status-select";
import { Outlet, useParams } from "react-router-dom";
import IssueModal from "../../../../../../components/issue-modal";
import Epic from "../../../../../../components/epic";
import IssueAddParent from "../../../../../../components/issue-add-parent";
import EditSprintModal from "../../../../../../components/edit-sprint-modal";
import IssueFilterSelect from "../../../../../../components/issue-filter-select";

const Backlog: React.FC = () => {
  const params = useParams();
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const backlogIssues = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
  );
  const sprints = useSelector(
    (state: RootState) => state.projectDetail.sprints
  );
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();

  const { isShowEpic, isLoading } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const [mode, setMode] = useState<"start" | "edit" | "complete">("edit");
  const [editSprint, setEditSprint] = useState<ISprint | null>(null);
  const [isShowSprintModal, setShowSprintModal] = useState<boolean>(false);

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const onClickCreateSprint = (e: any) => {
    e.stopPropagation();
    setMode("edit");
    SprintService.createSprint(project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
      }
    });
  };

  const onClickStartSprint = (e: any, sprint: ISprint) => {
    e.stopPropagation();
    openSprintModal("start", sprint);
  };

  const onClickCompleteSprint = (e: any, sprint: ISprint) => {
    e.stopPropagation();
    openSprintModal("complete", sprint);
  };

  const openSprintModal = (
    mode: "start" | "edit" | "complete",
    sprint: ISprint
  ) => {
    setMode(mode);
    setShowSprintModal(true);
    setEditSprint(sprint);
  };

  const onClickEditSprint = (e: any, sprint: ISprint) => {
    e.stopPropagation();
    openSprintModal("edit", sprint);
  };

  const onSaveIssue = () => {
    showSuccessMessage();
  };

  const onDeleteIssue = async (parentId: string, id: string) => {
    await IssueService.deleteIssue(parentId, id).then((res) => {
      if (checkResponseStatus(res)) {
        showSuccessMessage();
        dispatch(getProjectByCode(project?.code!));
      }
    });
  };

  const onDeleteSprint = async (e: any, id: string) => {
    e.stopPropagation();
    await SprintService.deleteSprint(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        const tempSprints = [...sprints!];
        const index = tempSprints.findIndex((item: ISprint) => item.id === id);
        tempSprints.splice(index, 1);
        dispatch(setSprints(tempSprints));
        showSuccessMessage();
      }
    });
  };

  const onRenderListIssue = (
    parentId: string,
    type: string,
    issues: IIssue[]
  ) => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={issues}
        loading={isLoading}
        renderItem={(issue) => (
          <List.Item className="c-backlog-item">
            <div className="align-child-space-between align-center w-100">
              <div className="d-flex align-center">
                <div className="mr-2" style={{ width: "18px", height: "18px" }}>
                  <IssueType
                    issueTypeKey={
                      project?.issueTypes.find(
                        (type) => type.id === issue.issueTypeId
                      )?.icon
                    }
                  ></IssueType>
                </div>
                <EditIssueInput
                  initialValue={issue.name}
                  issueId={issue.id}
                  periodId={parentId}
                  type={type}
                  onSaveIssue={onSaveIssue}
                ></EditIssueInput>
              </div>

              <div className="align-child-space-between align-center">
                {projectPermissions &&
                  projectPermissions.permissions.board.editPermission && (
                    <IssueAddParent
                      issue={issue}
                      periodId={issue.backlogId ?? issue.sprintId!}
                      type={
                        issue?.backlogId
                          ? "backlog"
                          : issue?.sprintId
                          ? "sprint"
                          : "epic"
                      }
                      onSaveIssue={showSuccessMessage}
                    ></IssueAddParent>
                  )}

                <IssueStatusSelect
                  type={type}
                  periodId={parentId}
                  onSaveIssue={onSaveIssue}
                  issueId={issue?.id}
                  selectedId={issue?.statusId}
                ></IssueStatusSelect>
                <UserAvatar
                  className="mr-2 ml-2"
                  userIds={[issue?.issueDetail.assigneeId]}
                  isMultiple={false}
                  isShowName={false}
                ></UserAvatar>
                <Dropdown
                  className="c-backlog-action"
                  overlay={
                    <Menu>
                      <Menu.Item>Copy issue link</Menu.Item>
                      <Menu.Item>Copy issue key</Menu.Item>
                      <SubMenu title={"Assignee"} key={issue.id}>
                        <Menu.Item>
                          <SelectUser
                            fieldName="assigneeId"
                            type={type}
                            periodId={parentId}
                            onSaveIssue={onSaveIssue}
                            issueId={issue?.id}
                            selectedId={issue?.issueDetail?.assigneeId}
                            isUseListUser={false}
                          ></SelectUser>
                        </Menu.Item>
                      </SubMenu>
                      {projectPermissions !== null &&
                        projectPermissions.permissions.board.editPermission && (
                          <Menu.Item>
                            <Popconfirm
                              title="Delete"
                              description="Are you sure to delete this issue?"
                              okText="Yes"
                              cancelText="Cancel"
                              onConfirm={() =>
                                onDeleteIssue(parentId, issue?.id)
                              }
                            >
                              <div onClick={(e) => e.stopPropagation()}>
                                Move to trash
                              </div>
                            </Popconfirm>
                          </Menu.Item>
                        )}
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button type="text" onClick={(e) => e.preventDefault()}>
                    <i className="fa-solid fa-ellipsis"></i>
                  </Button>
                </Dropdown>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  const onRenderBacklogContent: ReactNode = (
    <>
      {backlogIssues?.length === 0 ? (
        <div className="c-backlog-no-content">
          <span className="text-center ">
            Plan and pritoritize your future work in backlog
          </span>
        </div>
      ) : (
        onRenderListIssue(project?.backlog?.id!, "backlog", backlogIssues!)
      )}
      <CreateIssueInput
        type="backlog"
        periodId={project?.backlog?.id}
        onSaveIssue={onSaveIssue}
      ></CreateIssueInput>
    </>
  );

  const onRenderSprintContent = (sprint: ISprint): ReactNode => (
    <>
      {!sprint?.issues || sprint?.issues?.length === 0 ? (
        <div className="c-backlog-no-content">
          <span className="text-center ">
            Plan a sprint by dragging the sprint footer down below some issues,
            or by dragging issues here.
          </span>
        </div>
      ) : (
        sprint?.issues && onRenderListIssue(sprint.id, "sprint", sprint.issues)
      )}
      <CreateIssueInput
        type="sprint"
        periodId={sprint?.id}
        onSaveIssue={onSaveIssue}
      ></CreateIssueInput>
    </>
  );

  const onChangeToggleEpic = (e: any) => {
    dispatch(setIsShowEpic(e));
  };

  const onSearch = (value: string) => {};
  return (
    <>
      <HeaderProject
        title="Backlog"
        isFixedHeader={true}
        onSearch={onSearch}
        actionContent={
          <>
            {/* <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "250px" }}
                        placeholder="Please select"
                        // onChange={handleChange}
                        options={project?.epics.map((epic) => {
                          return {
                            label: <span>{epic.name}</span>,
                            value: epic.id,
                          };
                        })}
                      />
                      <Divider className="mt-2 mb-2"></Divider>
                      <div className="d-flex">
                        <Switch
                          checked={isShowEpic}
                          onChange={(e) => onChangeToggleEpic(e)}
                        />
                        <span className="ml-2">Epic</span>
                      </div>
                    </div>
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <Button type="default" className="ml-2">
                <span>Epic</span>{" "}
                <i className="fa-solid fa-chevron-down ml-2"></i>
              </Button>
            </Dropdown>

            <IssueFilterSelect
              projectId={project?.id}
              initialOption={
                project?.issueTypes?.map((type) => ({
                  label: type.name,
                  value: type.id,
                })) ?? []
              }
              label="Issue type"
              isLoading={isLoading}
              onChangeOption={function (options: any[]): void {
                throw new Error("Function not implemented.");
              }}
            /> */}
          </>
        }
      ></HeaderProject>

      <Row gutter={isShowEpic ? 24 : 0}>
        {isShowEpic && (
          <Col span={6} className="mt-4">
            <Epic></Epic>
          </Col>
        )}
        <Col span={isShowEpic ? 18 : 24}>
          <div className="mt-4 ">
            <Collapse className="c-backlog">
              {sprints?.map((sprint) => {
                return (
                  <Collapse.Panel
                    key={sprint.id}
                    header={
                      <div>
                        <span className="font-weight-bold">
                          {sprint.name}&nbsp;
                          {sprint.startDate && (
                            <span className="font-weight-normal text-muted">
                              {dayjs(sprint.startDate).format("MMM D, YYYY")} -{" "}
                              {dayjs(sprint.endDate).format("MMM D, YYYY")}
                              &nbsp;
                            </span>
                          )}
                          <span className="font-weight-normal text-muted">
                            ({sprint?.issues?.length ?? 0}) issues
                          </span>
                        </span>
                      </div>
                    }
                    extra={
                      projectPermissions &&
                      projectPermissions.permissions.board.editPermission && (
                        <>
                          {sprint.issues?.length > 0 &&
                            !sprint.isComplete &&
                            sprint.isStart && (
                              <Button
                                onClick={(e: any) =>
                                  onClickCompleteSprint(e, sprint)
                                }
                                type="default"
                                className="mr-2"
                              >
                                Complete sprint
                              </Button>
                            )}

                          {sprint.issues?.length > 0 &&
                            !sprint.isComplete &&
                            !sprint.isStart && (
                              <Button
                                onClick={(e: any) =>
                                  onClickStartSprint(e, sprint)
                                }
                                type="default"
                                className="mr-2"
                              >
                                Start sprint
                              </Button>
                            )}

                          <Dropdown
                            className="c-backlog-action"
                            overlay={
                              <Menu key={sprint.id}>
                                <Menu.Item key="edit">
                                  <div
                                    onClick={(e) =>
                                      onClickEditSprint(e, sprint)
                                    }
                                  >
                                    Edit
                                  </div>
                                </Menu.Item>
                                <Menu.Item key="delete">
                                  <Popconfirm
                                    title="Delete"
                                    description="Are you sure to delete this sprint?"
                                    okText="Yes"
                                    cancelText="Cancel"
                                    onConfirm={(e) =>
                                      onDeleteSprint(e, sprint?.id)
                                    }
                                  >
                                    <div onClick={(e) => e.stopPropagation()}>
                                      Move to trash
                                    </div>
                                  </Popconfirm>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <Button
                              type="text"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fa-solid fa-ellipsis"></i>
                            </Button>
                          </Dropdown>
                        </>
                      )
                    }
                  >
                    {onRenderSprintContent(sprint)}
                  </Collapse.Panel>
                );
              })}

              <Collapse.Panel
                key="backlog"
                header={
                  <div>
                    <span className="font-weight-bold">
                      Backlog{" "}
                      <span className="font-weight-normal">
                        ({backlogIssues?.length}) issues
                      </span>
                    </span>
                  </div>
                }
                extra={
                  projectPermissions &&
                  projectPermissions.permissions.board.editPermission && (
                    <Button
                      onClick={(e: any) => onClickCreateSprint(e)}
                      type="default"
                    >
                      Create sprint
                    </Button>
                  )
                }
              >
                {onRenderBacklogContent}
              </Collapse.Panel>
            </Collapse>
            <EditSprintModal
              onSaveSprint={() => {
                showSuccessMessage();
                setShowSprintModal(false);
              }}
              sprint={editSprint!}
              mode={mode}
              isShowModal={isShowSprintModal}
              onCancel={() => setShowSprintModal(false)}
            ></EditSprintModal>
          </div>
        </Col>
      </Row>

      {contextHolder}
      <IssueModal></IssueModal>
      <Outlet></Outlet>
    </>
  );
};

export default Backlog;
