import { green, red } from "@ant-design/colors";
import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPermissions } from "../../../../../../../../redux/slices/permissionSlice";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { PermissionService } from "../../../../../../../../services/permissionService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IPermissionGroup } from "../../../../../../../models/IPermission";
import HeaderProject from "../header";

export default function AccessProject() {
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const { permissions, isLoading } = useSelector(
    (state: RootState) => state.permissions
  );
  const [drawerForm] = Form.useForm();

  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [permissionId, setPermissionId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const initialPermissionsData = {
    timeline: ["viewPermission", "editPermission"],
    backlog: ["viewPermission", "editPermission"],
    board: ["viewPermission", "editPermission"],
    project: ["viewPermission", "editPermission"],
  };

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
    drawerForm.resetFields();
  };

  const onOpenModal = (mode: string, item?: IPermissionGroup) => {
    setIsModalOpen(true);
    setMode(mode);
    if (mode === "edit") {
      drawerForm.setFieldsValue(item);
      drawerForm.setFieldValue(
        "backlog",
        convertObjectToArray(item?.permissions.backlog!)
      );
      drawerForm.setFieldValue(
        "timeline",
        convertObjectToArray(item?.permissions.timeline!)
      );
      drawerForm.setFieldValue(
        "board",
        convertObjectToArray(item?.permissions.board!)
      );
      drawerForm.setFieldValue(
        "project",
        convertObjectToArray(item?.permissions.project!)
      );
      setPermissionId(item?.id!);
    } else {
      drawerForm.setFieldValue("backlog", initialPermissionsData.backlog);
      drawerForm.setFieldValue("timeline", initialPermissionsData.timeline);
      drawerForm.setFieldValue("board", initialPermissionsData.board);
      drawerForm.setFieldValue("project", initialPermissionsData.project);
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onDeletePermission = async (id: string) => {
    await PermissionService.delete(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        dispatch(getPermissions(project?.id!));
        showSuccessMessage();
      }
    });
  };

  const columns: ColumnsType<IPermissionGroup> = [
    {
      title: "Name",
      key: "name",
      width: "20%",
      render: (permission: IPermissionGroup) => {
        return (
          <a onClick={() => onOpenModal("edit", permission)}>
            {permission.name}
          </a>
        );
      },
    },
    {
      title: "Timeline",
      key: "timeline",
      width: "10%",
      align: "center",
      colSpan: 2,
      render: (permissions: any) => (
        <Tooltip title="View">
          {onRenderStatusPermission(
            permissions.permissions?.timeline?.viewPermission
          )}
        </Tooltip>
      ),
    },
    {
      key: "timeline_editPermission",
      align: "center",
      width: "10%",
      colSpan: 0,
      render: (permissions: any) => (
        <Tooltip title="Edit">
          {onRenderStatusPermission(
            permissions.permissions?.timeline?.editPermission
          )}
        </Tooltip>
      ),
    },
    {
      title: "Backlog",
      key: "backlog",
      width: "10%",
      align: "center",
      colSpan: 2,
      render: (permissions: any) => (
        <Tooltip title="View">
          {onRenderStatusPermission(
            permissions.permissions?.backlog?.viewPermission
          )}
        </Tooltip>
      ),
    },
    {
      key: "backlog_editPermission",
      align: "center",
      width: "10%",
      colSpan: 0,
      render: (permissions: any) => (
        <Tooltip title="Edit">
          {onRenderStatusPermission(
            permissions.permissions?.backlog?.editPermission
          )}
        </Tooltip>
      ),
    },
    {
      title: "Board",
      key: "board",
      width: "10%",
      align: "center",
      colSpan: 2,
      render: (permissions: any) => (
        <Tooltip title="View">
          {onRenderStatusPermission(
            permissions.permissions?.board?.viewPermission
          )}
        </Tooltip>
      ),
    },
    {
      key: "board_editPermission",
      align: "center",
      width: "10%",
      colSpan: 0,
      render: (permissions: any) => (
        <Tooltip title="Edit">
          {onRenderStatusPermission(
            permissions.permissions?.board?.editPermission
          )}
        </Tooltip>
      ),
    },
    {
      title: "Project",
      key: "project",
      width: "10%",
      align: "center",
      colSpan: 2,
      render: (permissions: any) => (
        <Tooltip title="View">
          {onRenderStatusPermission(
            permissions.permissions?.project?.viewPermission
          )}
        </Tooltip>
      ),
    },
    {
      key: "project_editPermission",
      align: "center",
      width: "10%",
      colSpan: 0,
      render: (permissions: any) => (
        <Tooltip title="Edit">
          {onRenderStatusPermission(
            permissions.permissions?.project?.editPermission
          )}
        </Tooltip>
      ),
    },
    {
      title: "",
      key: "action",
      width: "40px",
      render: (permissions: any) => {
        return (
          <Popconfirm
            title="Delete the group"
            description="Are you sure to delete this group?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeletePermission(permissions.id)}
            disabled={!editPermission || permissions.isMain}
          >
            <Button
              type="text"
              shape="circle"
              disabled={!editPermission || permissions.isMain}
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

  const onRenderStatusPermission = (status: boolean) => {
    return status ? (
      <Button type="text" shape="circle">
        <i style={{ color: green.primary }} className="fa-solid fa-check"></i>
      </Button>
    ) : (
      <Button type="text" shape="circle">
        <i style={{ color: red.primary }} className="fa-solid fa-xmark"></i>
      </Button>
    );
  };

  const convertToPermissionsData = (permissions: any) => {
    const permissionsObject: Record<string, boolean> = {};

    permissions.forEach((permission: any) => {
      permissionsObject[permission] = true;
    });

    return permissionsObject;
  };

  const convertObjectToArray = (permissionsObject: any) => {
    return Object.keys(permissionsObject).filter(
      (key) => permissionsObject[key]
    );
  };

  const onSubmit = async () => {
    setIsLoadingButtonSave(true);
    const drawerFormValue = drawerForm.getFieldsValue();

    try {
      await drawerForm.validateFields();
      if (
        drawerFormValue.backlog?.length === 0 &&
        drawerFormValue.backlog?.timeline === 0 &&
        drawerFormValue.board?.length &&
        drawerFormValue.project?.length
      ) {
        return;
      }
      setIsLoadingButtonSave(true);

      const payload: IPermissionGroup = {
        ...drawerFormValue,
        backlog: convertToPermissionsData(drawerFormValue.backlog),
        timeline: convertToPermissionsData(drawerFormValue.timeline),
        board: convertToPermissionsData(drawerFormValue.board),
        project: convertToPermissionsData(drawerFormValue.project),
        projectId: project?.id,
      };
      let response;
      if (mode === "create") {
        response = await PermissionService.create(project?.id!, payload);
      } else {
        response = await PermissionService.update(
          project?.id!,
          permissionId,
          payload
        );
      }
      if (checkResponseStatus(response)) {
        dispatch(getPermissions(project?.id!));
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
        setIsModalOpen(false);
      }
      setIsLoadingButtonSave(false);
    } catch (error) {
      setIsLoadingButtonSave(false);
    }
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Access"
        isFixedHeader={true}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button
              className="ml-2"
              type="primary"
              onClick={() => onOpenModal("create")}
            >
              Create group
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={permissions}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
      />

      {contextHolder}
      <Drawer
        title={mode === "edit" ? "Update" : "Create"}
        closeIcon={null}
        open={isModalOpen}
        footer={
          <Footer
            onClickCancel={onCancel}
            onSubmit={onSubmit}
            mode={mode}
            isLoadingButtonSave={isLoadingButtonSave}
          />
        }
      >
        <Form form={drawerForm} className="form" onFinish={onSubmit}>
          <Form.Item
            label="Name"
            required={true}
            name="name"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your priority name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            key="timeline"
            name="timeline"
            label="Timeline"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Checkbox.Group>
              <Checkbox value="viewPermission">View</Checkbox>
              <Checkbox value="editPermission">Edit</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            key="backlog"
            name="backlog"
            label="Backlog"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Checkbox.Group>
              <Checkbox value="viewPermission">View</Checkbox>
              <Checkbox value="editPermission">Edit</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            key="board"
            name="board"
            label="Board"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Checkbox.Group>
              <Checkbox value="viewPermission">View</Checkbox>
              <Checkbox value="editPermission">Edit</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            key="project"
            name="project"
            label="Project"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Checkbox.Group>
              <Checkbox value="viewPermission">View</Checkbox>
              <Checkbox value="editPermission">Edit</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

function Footer(props: any) {
  return (
    <div>
      <Button type="default" onClick={props.onClickCancel}>
        Cancel
      </Button>
      {props.mode === "edit" ? (
        <Button
          className="ml-2 float-right"
          type="primary"
          onClick={props.onSubmit}
          htmlType="submit"
          loading={props.isLoadingButtonSave}
        >
          Update
        </Button>
      ) : (
        <Button
          className="ml-2 float-right"
          type="primary"
          onClick={props.onSubmit}
          htmlType="submit"
          loading={props.isLoadingButtonSave}
          disabled={props.disabled}
        >
          Create
        </Button>
      )}
    </div>
  );
}
