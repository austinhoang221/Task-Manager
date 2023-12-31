import { blue, geekblue, gray, green } from "@ant-design/colors";
import { Button, message, Select, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setProjectDetail } from "../../../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../../../redux/store";
import { FilterService } from "../../../../../../../../../../services/filterService";
import { ProjectService } from "../../../../../../../../../../services/projectService";
import { useAppDispatch } from "../../../../../../../../../customHooks/dispatch";
import { useIsFirstRender } from "../../../../../../../../../customHooks/useIsFirstRender";
import { checkResponseStatus } from "../../../../../../../../../helpers";
import { IFilter } from "../../../../../../../../../models/IFilter";
import { IIssue } from "../../../../../../../../../models/IIssue";
import { IStatus } from "../../../../../../../../../models/IStatus";
import IssueDateSelect from "../../../../../../../../components/issue-date-select";
import IssueFilterSelect from "../../../../../../../../components/issue-filter-select";
import IssuePriority from "../../../../../../../../components/issue-priority";
import IssueStatusSelect from "../../../../../../../../components/issue-status-select";
import IssueType from "../../../../../../../../components/issue-type";
import UserAvatar from "../../../../../../../../components/user-avatar";
import HeaderProject from "../../../header";
import CustomFilterModal from "./create-modal";

export default function CustomFilterList() {
  const { project, isLoading: isLoadingProject } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const params = useParams();
  const dispatch = useAppDispatch();
  const { projects } = useSelector((state: RootState) => state);
  const { filters, isLoading: isFilterLoading } = useSelector(
    (state: RootState) => state.filters
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [listIssue, setListIssue] = useState<IIssue[]>([]);
  const [sprintOptions, setSprintOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setstatusOptions] = useState<any[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<any[]>([]);
  const [labelOptions, setLabelOptions] = useState<any[]>([]);
  const [typeValue, setTypeValue] = useState<any[]>([]);
  const [sprintValue, setSprintValue] = useState<any[]>([]);
  const [statusValue, setStatusValue] = useState<any[]>([]);
  const [assigneeValue, setAssigneeValue] = useState<any[]>([]);
  const [reporterValue, setReporterValue] = useState<any[]>([]);
  const [unassignedValue, setUnAssignedValue] = useState<boolean>(false);
  const [labelValue, setLabelValue] = useState<any[]>([]);
  const [priorityValue, setPriorityValue] = useState<any[]>([]);
  const [createdDateValue, setCreatedDateValue] = useState<any>();
  const [dueDateValue, setDueDateValue] = useState<any>();
  const [updatedDate, setUpdatedDate] = useState<any>();
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isFirstRender = useIsFirstRender();

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const onRenderStatusContent = (status: IStatus) => {
    switch (status.name) {
      case "DONE":
        return (
          <div>
            <Button
              style={{
                backgroundColor: green.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Done
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      case "IN PROGRESS":
        return (
          <div>
            <Button
              style={{
                backgroundColor: geekblue.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Inprogress
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      case "TO DO":
        return (
          <div>
            <Button
              style={{
                backgroundColor: gray.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Ready
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      default:
        return (
          <div>
            <Button
              style={{
                backgroundColor: blue.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              {status.name}
            </Button>
          </div>
        );
    }
  };

  const columns: ColumnsType<IIssue> = [
    {
      title: "",
      key: "type",
      width: "50px",
      align: "center",
      render: (issue: IIssue) => (
        <IssueType issueTypeKey={issue.issueType.icon}></IssueType>
      ),
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      width: "8%",
      render: (text: string) => {
        return (
          <>
            <Link to={text}>{text}</Link>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "auto",
      render: (text: string) => {
        return (
          <>
            <Tooltip title={text}>
              <span>{text}</span>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Assignee",
      key: "assignee",
      width: "15%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            {issue?.issueDetail.assigneeId ? (
              <UserAvatar
                userIds={[issue?.issueDetail.assigneeId]}
                isMultiple={false}
                isShowName={true}
              ></UserAvatar>
            ) : (
              <span>Unassigned</span>
            )}
          </>
        );
      },
    },
    {
      title: "Reporter",
      key: "reporter",
      width: "15%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[issue?.issueDetail.reporterId]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
    {
      title: "Priority",
      key: "priority",
      width: "8%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <IssuePriority priorityId={issue.priorityId ?? ""}></IssuePriority>
          </>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: "10%",
      render: (issue: IIssue) => {
        return <>{onRenderStatusContent(issue.status)}</>;
      },
    },
    {
      title: "Created",
      key: "created",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            {issue?.creationTime
              ? dayjs(issue?.creationTime).format("MMM D, YYYY")
              : ""}
          </>
        );
      },
    },
    {
      title: "Due date",
      key: "dueDate",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            {issue?.dueDate
              ? dayjs(issue?.creationTime).format("MMM D, YYYY")
              : ""}
          </>
        );
      },
    },
  ];

  const resetFilter = () => {
    setSprintValue([]);
    setStatusValue([]);
    setTypeValue([]);
    setReporterValue([]);
    setAssigneeValue([]);
    setLabelValue([]);
    setDueDateValue("");
    setCreatedDateValue("");
    setUpdatedDate("");
  };

  useEffect(() => {
    if (!projectId && projects?.length > 0 && params?.filterId === "new") {
      setProjectId(projects?.[0].id);
    }
  }, [projects, params?.filterId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchData = useCallback(async () => {
    if (projectId) {
      await fetchProjectData(projectId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const fetchProjectData = (id: string) => {
    const code = projects?.find((project) => project?.id === id)?.code;
    setIsLoading(true);

    ProjectService.getByCode(userId, code!).then((res) => {
      if (checkResponseStatus(res)) {
        resetFilter();

        setSprintOptions(res?.data.sprints!);
        setTypeOptions(res?.data.issueTypes!);
        setstatusOptions(res?.data.statuses!);
        setAssigneeOptions(res?.data.members!);
        setLabelOptions(res?.data.labels!);
        setPriorityOptions(res?.data.priorities!);
        dispatch(setProjectDetail(res?.data!));
      }
      setIsLoading(false);
    });
  };

  const onCreateFilter = () => {
    showSuccessMessage();
    setIsOpenModal(false);
  };

  const getPayload = () => {
    return {
      name: searchValue,
      project: {
        projectIds: [projectId],
        sprintIds: sprintValue,
        backlogIds: null,
      },
      sprints: {
        noSprint: false,
        sprintIds: sprintValue?.length > 0 ? sprintValue : null,
      },
      type: {
        issueTypeIds: typeValue?.length > 0 ? typeValue : null,
      },
      status: {
        statusIds: statusValue?.length > 0 ? statusValue : null,
      },
      assginee: {
        unassigned: unassignedValue,
        currentUserId: null,
        userIds: assigneeValue?.length > 0 ? assigneeValue : null,
      },
      created: {
        ...(createdDateValue ? createdDateValue : null),
      },
      dueDate: {
        ...(dueDateValue ? dueDateValue : null),
      },
      updated: {
        ...(updatedDate ? updatedDate : null),
      },
      labels: {
        labelIds: labelValue?.length > 0 ? labelValue : null,
      },
      priority: {
        priorityIds: priorityValue?.length > 0 ? priorityValue : null,
      },
      reporter: {
        currentUserId: null,
        unassigned: false,
        userIds: reporterValue?.length > 0 ? reporterValue : null,
      },
      resolved: null,
    };
  };

  const fetchIssueData = useCallback(() => {
    if (params?.filterId === "new") {
      const payload = getPayload();
      setIsLoading(true);
      FilterService.getAllIssue(payload).then((res) => {
        if (checkResponseStatus(res)) {
          setListIssue(res?.data!);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      FilterService.getByFilterId(params?.filterId!).then((res) => {
        if (checkResponseStatus(res)) {
          setListIssue(res?.data!);
        }
        setIsLoading(false);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchValue,
    sprintValue,
    typeValue,
    statusValue,
    unassignedValue,
    assigneeValue,
    createdDateValue,
    dueDateValue,
    updatedDate,
    labelValue,
    priorityValue,
    reporterValue,
    params?.filterId,
  ]);

  useEffect(() => {
    fetchIssueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchValue,
    sprintValue,
    typeValue,
    statusValue,
    unassignedValue,
    assigneeValue,
    createdDateValue,
    dueDateValue,
    updatedDate,
    labelValue,
    priorityValue,
    reporterValue,
    params?.filterId,
  ]);

  const onChangeProject = (id: string) => {
    setProjectId(id);
  };

  const onChangeCreatedDate = (value: any) => {
    setCreatedDateValue(value);
  };

  const onChangeDueDate = (value: any) => {
    setDueDateValue(value);
  };

  const onChangeUpdatedDate = (value: any) => {
    setUpdatedDate(value);
  };

  const onRenderMember = () => {
    const members = [
      ...(assigneeOptions.map((member) => {
        return { label: member.name, value: member.id };
      }) ?? []),
      { label: project?.leader.name, value: project?.leader.id },
    ];
    return members;
  };

  const onRenderAction: React.ReactNode = (
    <>
      {params?.filterId === "new" && projectId && (
        <>
          <Select
            value={projectId}
            style={{ width: "150px" }}
            className="mr-1"
            onChange={(e) => onChangeProject(e)}
            options={
              projects.map((project) => {
                return {
                  label: project.name,
                  value: project.id,
                };
              }) ?? []
            }
          ></Select>
          <IssueFilterSelect
            projectId={projectId}
            initialOption={
              sprintOptions?.map((sprint) => ({
                label: sprint.name,
                value: sprint.id,
              })) ?? []
            }
            label="Sprint"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setSprintValue}
          />
          <IssueFilterSelect
            projectId={projectId}
            initialOption={
              typeOptions?.map((type) => ({
                label: type.name,
                value: type.id,
              })) ?? []
            }
            label="Type"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setTypeValue}
          />
          <IssueFilterSelect
            projectId={projectId}
            initialOption={
              statusOptions?.map((status) => ({
                label: status.name,
                value: status.id,
              })) ?? []
            }
            label="Status"
            initialChecked={statusValue}
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setStatusValue}
          />
          <IssueFilterSelect
            projectId={projectId}
            initialOption={
              priorityOptions.map((priority) => ({
                label: priority.name,
                value: priority.id,
              })) ?? []
            }
            label="Priority"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setPriorityValue}
          />
          <IssueFilterSelect
            projectId={projectId}
            isHaveOtherOption={true}
            otherOptionLabel="Unassigned"
            otherOptionValue={unassignedValue}
            onCheckOtherOptionChange={setUnAssignedValue}
            initialOption={onRenderMember()}
            initialChecked={assigneeValue}
            label="Assignee"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setAssigneeValue}
          />
          <IssueFilterSelect
            projectId={projectId}
            initialOption={onRenderMember()}
            label="Reporter"
            initialChecked={reporterValue}
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setReporterValue}
          />

          <IssueFilterSelect
            projectId={projectId}
            initialOption={
              labelOptions.map((label) => ({
                label: label.name,
                value: label.id,
              })) ?? []
            }
            label="Label"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setLabelValue}
          />

          <IssueDateSelect
            label="Created date"
            projectId={projectId}
            onSaveOption={(value: any) => onChangeCreatedDate(value)}
          />
          <IssueDateSelect
            label="Updated date"
            projectId={projectId}
            onSaveOption={(value: any) => onChangeUpdatedDate(value)}
          />
          <IssueDateSelect
            label="Due date"
            projectId={projectId}
            onSaveOption={(value: any) => onChangeDueDate(value)}
          />
          <a
            className="ml-2"
            style={{ lineHeight: "32px" }}
            onClick={() => setIsOpenModal(true)}
          >
            Save filter
          </a>
        </>
      )}

      <CustomFilterModal
        payload={getPayload()}
        isOpen={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onSave={() => onCreateFilter()}
      />
    </>
  );

  return (
    <>
      {contextHolder}
      <HeaderProject
        title="Issues"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={onRenderAction}
      ></HeaderProject>

      <Table
        className="mt-3"
        columns={columns}
        dataSource={listIssue}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: 1500, y: 400 }}
      />
    </>
  );
}
