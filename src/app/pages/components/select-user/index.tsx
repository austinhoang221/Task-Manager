import { Avatar, Select } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import useUserData from "../../../customHooks/fetchUser";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
} from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { IUser } from "../../../models/IUser";
export default function SelectUser(props: IIssueComponentProps) {
  const initialRequestUserParam = {
    name: "",
  };
  const [requestUserParam, setRequestUserParam] = useState(
    initialRequestUserParam
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const { listUser, loading } = useUserData(userId, requestUserParam.name);
  const dispatch = useAppDispatch();
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const getOptionLabel = (user: IUser) => (
    <>
      <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: "middle" }}
        size={28}
        className="mr-2"
        alt=""
        src={user.avatarUrl}
      >
        {convertNameToInitials(user.name)}
      </Avatar>
      <span>{user.name}</span>
    </>
  );

  const onSearch = (value?: string) => {
    setRequestUserParam({ name: value! });
  };

  const onChangeAssignUser = async (e: any) => {
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, e, {
        assigneeId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, e, {
        assigneeId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    }
  };

  return (
    <Select
      style={{ width: "200px" }}
      showSearch
      onSearch={(e) => onSearch(e)}
      loading={loading}
      defaultValue={props.currentId}
      options={listUser.map((user) => {
        return {
          label: getOptionLabel(user),
          value: user.id,
        };
      })}
      onChange={(e) => onChangeAssignUser(e)}
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    ></Select>
  );
}
