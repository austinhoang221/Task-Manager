import { Button, Input, InputRef } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import IssueTypeSelect from "../issue-type-select";
export default function CreateIssueInput(props: any, identifier: string) {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [issueTypeName, setIssueTypeName] = useState<string>("Bug");
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const ref = useRef<InputRef>(null);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [issueTypeKey, setIssueTypeKey] = useState<string>(
    project?.issueTypes.find((type) => type.name === "Bug")?.id!
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isCreate) {
      ref.current?.focus();
    }
  }, [isCreate]);

  const onCreateIssue = () => {
    setIsCreate(true);
  };
  const onChangeIssueType = (e: any) => {
    const issueTypeName = project?.issueTypes?.find(
      (type) => type.id === e.key
    )?.name;
    setIssueTypeName(issueTypeName!);
    setIssueTypeKey(e.key);
  };

  const onSaveIssue = (e: any) => {
    if (e?.target.value) {
      if (props.type === "backlog") {
        IssueService.createBacklogIssueByName(props.periodId, {
          name: e.target.value,
          issueTypeId: issueTypeKey,
          creatorUserId: userId,
          projectId: project?.id,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            props.onSaveIssue();
            dispatch(getProjectByCode(project?.code!));
            setIsCreate(false);
          }
        });
      } else {
        IssueService.createSprintIssueByName(props.periodId, {
          name: e.target.value,
          issueTypeId: issueTypeKey,
          creatorUserId: userId,
          projectId: project?.id,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            props.onSaveIssue();
            dispatch(getProjectByCode(project?.code!));
            setIsCreate(false);
          }
        });
      }
    }
  };
  return (
    <>
      {!isCreate ? (
        <Button
          type="text"
          className="w-100 mt-1 text-left"
          onClick={onCreateIssue}
        >
          <i className="fa-solid fa-plus mr-2"></i>
          <span className="font-weight-bold">Add upcoming work here</span>
        </Button>
      ) : (
        <div className="mt-1">
          <div className="w-100 d-flex">
            <Input
              prefix={
                <IssueTypeSelect
                  issueTypeKey={issueTypeName}
                  onChangeIssueType={onChangeIssueType}
                ></IssueTypeSelect>
              }
              ref={ref}
              placeholder="What need to be done?"
              onPressEnter={(e) => onSaveIssue(e)}
              // onBlur={(e) => setIsCreate(false)}
              onKeyDownCapture={(e) => {
                if (e.key === "Escape") setIsCreate(false);
              }}
            ></Input>
          </div>
        </div>
      )}
    </>
  );
}
