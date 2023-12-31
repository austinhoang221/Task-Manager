import { Button, message, Pagination } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import useProjectData from "../../../customHooks/fetchProject";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import UserAvatar from "../../components/user-avatar";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
import { useState } from "react";
import CreateProjectDrawer from "./partials/create";
import { IUser } from "../../../models/IUser";
import { ProjectService } from "../../../../services/projectService";

export default function Project() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 20,
    sort: ["name:asc"],
  };

  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const { listProject, totalCount, refreshData, isLoading } = useProjectData(
    userId,
    requestParam
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<IProject> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      key: "isFavourite",
      width: "40px",
      align: "center",
      render: (project: IProject) => (
        <ButtonIcon
          onClick={() => onClickAddFavourite(project.isFavourite, project.id)}
          iconClass={
            project.isFavourite ? "fa-solid fa-star" : "fa-regular fa-star"
          }
        ></ButtonIcon>
      ),
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Link to={`${text}/backlog`}>{text}</Link>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <span>{text}</span>
          </>
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "leader",
      key: "leader",
      width: "30%",
      render: (leader: IUser) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[leader?.id]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
  ];

  const onClickAddFavourite = async (isFavourite: boolean, id: string) => {
    const payload = {
      isFavourite: !isFavourite,
    };
    await ProjectService.patch(userId, payload, id!);
    refreshData();
  };

  const onChangePagination = (page: number, size: number) => {
    setRequestParam({
      pageNum: page,
      pageSize: size,
      sort: requestParam.sort,
    });
  };

  return (
    <div className="c-content">
      <div className="align-child-space-between align-center">
        <h2>Project</h2>
        <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
          Create project
        </Button>
      </div>
      <div className="d-flex align-center">
        <Search
          className="mr-2"
          placeholder="Search..."
          style={{ width: 200 }}
        />
      </div>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listProject}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
      />
      {totalCount > 0 && (
        <Pagination
          className="mt-2 float-right"
          current={requestParam.pageNum}
          pageSize={requestParam.pageSize}
          total={totalCount}
          onChange={(page, size) => onChangePagination(page, size)}
        />
      )}
      {contextHolder}
      <CreateProjectDrawer
        isDrawerOpen={isDrawerOpen}
        setOpen={(isOpen: boolean) => setIsDrawerOpen(isOpen)}
      />
    </div>
  );
}
