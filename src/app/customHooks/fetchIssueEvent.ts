import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PermissionService } from "../../services/permissionService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IPermissionGroup } from "../models/IPermission";

function usePermissionData(projectId: string, requestParam: IPagination) {
  const [listPermission, setListOfData] = useState<IPermissionGroup[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    setLoading(true);
    PermissionService.getAll(
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

  return { listPermission, totalCount, refreshData, isLoading };
}

export default usePermissionData;
