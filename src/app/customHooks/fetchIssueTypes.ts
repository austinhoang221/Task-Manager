import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IssueTypeService } from "../../services/issueTypeService";
import { checkResponseStatus } from "../helpers";
import { IIssueType } from "../models/IIssueType";
import { IPagination } from "../models/IPagination";

function useIssueTypeData(projectId: string, requestParam: IPagination) {
  const [listIssueType, setListOfData] = useState<IIssueType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    setLoading(true);
    IssueTypeService.getAll(
      projectId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        setListOfData(res?.data?.content!);
        setTotalCount(res?.data?.totalCount!);
        setLoading(false);
      }
    });
  }, [
    projectId,
    requestParam.pageNum,
    requestParam.pageSize,
    requestParam.sort,
  ]);

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
  }, [fetchData, project?.id, requestParam.pageNum, requestParam.pageSize]);

  return { listIssueType, totalCount, refreshData, isLoading };
}

export default useIssueTypeData;
