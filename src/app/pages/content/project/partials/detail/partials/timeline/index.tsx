import { Empty } from "antd";
import { Gantt, Task } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import { IssueService } from "../../../../../../../../services/issueService";
import { checkResponseStatus } from "../../../../../../../helpers";
import HeaderProject from "../header";
import "gantt-task-react/dist/index.css";
export default function TimelineProject() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      IssueService.getAll(project?.id!).then((res) => {
        if (checkResponseStatus(res)) {
          let data = res?.data?.filter((item) => item.start && item.end)!;
          data = data.map((item) => {
            return {
              ...item,
              start: new Date(item.start),
              end: new Date(item.end),
            };
          });
          setTasks(data);
          setIsLoading(false);
        }
      });
    };
    if (project?.id) fetchData();
  }, [project?.id]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <HeaderProject
        title="Timeline"
        isFixedHeader={true}
        actionContent={<></>}
        onSearch={onSearch}
      ></HeaderProject>
      <div className="mt-4">
        {!isLoading && tasks?.length > 0 ? (
          <Gantt tasks={tasks} />
        ) : (
          <Empty></Empty>
        )}
      </div>
    </>
  );
}
