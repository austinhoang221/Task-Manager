import { red } from "@ant-design/colors";
import {
  Alert,
  Button,
  message,
  Pagination,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getMembers,
  getPermissions,
} from "../../../../../../../../redux/slices/permissionSlice";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { MemberService } from "../../../../../../../../services/memberService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IMember } from "../../../../../../../models/IMember";
import HeaderProject from "../header";

export default function MembersProject() {
  const dispatch = useAppDispatch();
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const { members, permissions, isLoading } = useSelector(
    (state: RootState) => state.permissions
  );
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const [messageApi, contextHolder] = message.useMessage();
  const user = JSON.parse(localStorage.getItem("user")!);

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const onChangePermission = (member: IMember, permissionId: string) => {
    MemberService.update(project?.id!, member.id, {
      permissionGroupId: permissionId,
    }).then((res) => {
      if (checkResponseStatus(res)) {
        dispatch(getMembers(project?.id!));
        dispatch(getPermissions(project?.id!));
        showSuccessMessage();
      }
    });
  };

  const onDeleteMember = async (id: string) => {
    await MemberService.delete(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        dispatch(getMembers(project?.id!));
        dispatch(getPermissions(project?.id!));
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
      }
    });
  };

  const columns: ColumnsType<IMember> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (name: string) => {
        return <a>{name}</a>;
      },
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      width: "30%",
      render: (email: string) => {
        return <span>{email}</span>;
      },
    },
    {
      title: "Permission",
      key: "permissionId",
      width: "30%",
      render: (member: IMember) => {
        return (
          <Select
            disabled={
              project?.leader.id !== user.id || member.email === user?.email
            }
            loading={isLoading}
            style={{ width: "150px" }}
            defaultValue={member.permissionGroupId}
            className="mb-2"
            onChange={(e) => onChangePermission(member, e)}
            options={permissions.map((permission) => {
              return {
                key: permission.id,
                label: permission.name,
                value: permission.id,
                disabled:
                  (permission.name === "Product Owner" &&
                    members.some(
                      (member) =>
                        permissions.find(
                          (permission) => permission.name === "Product Owner"
                        )?.id === member.permissionGroupId
                    )) ||
                  (permission.name === "Scrum Master" &&
                    members.some(
                      (member) =>
                        permissions.find(
                          (permission) => permission.name === "Scrum Master"
                        )?.id === member.permissionGroupId
                    )) ||
                  permission.name === "Project Lead",
              };
            })}
          ></Select>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: "40px",
      render: (member: IMember) => {
        return (
          <Popconfirm
            title="Delete member from project"
            description="Are you sure to delete this member from project?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteMember(member.id)}
            disabled={!editPermission || member.email === user.email}
          >
            <Button
              type="text"
              shape="circle"
              disabled={!editPermission || member.email === user.email}
            >
              <i
                style={{ color: red.primary }}
                className="fa-solid fa-trash-can"
              ></i>
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <HeaderProject
        title="Members"
        isFixedHeader={true}
        onSearch={onSearch}
        actionContent={<></>}
      ></HeaderProject>
      <Alert
        className="mt-2"
        message="A project must have at least 1 Product Owner, 1 Scrum Master"
        type="info"
      />
      <Table
        className="mt-3"
        columns={columns}
        dataSource={members}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
      />
      {contextHolder}
    </>
  );
}
