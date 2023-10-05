import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setProjects } from "../../../redux/slices/projectSlice";
import { setUsers } from "../../../redux/slices/userSlice";
import useProjectData from "../../customHooks/fetchProject";
import useUserData from "../../customHooks/fetchUser";
import { IPagination } from "../../models/IPagination";
import Header from "../components/header";
export default function Content() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
    sort: ["modificationtime:asc"],
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const dispatch = useDispatch();
  const { listUser } = useUserData(userId);
  const { listProject } = useProjectData(userId, initialRequestParam);

  useEffect(() => {
    dispatch(setUsers(listUser));
  }, [userId, listUser]);
  useEffect(() => {
    dispatch(setProjects(listProject));
  }, [userId, listProject]);
  return (
    <>
      <Header></Header>
      <div>
        <Outlet />
      </div>
    </>
  );
}
