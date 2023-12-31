import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./app/pages/authentication";
import Content from "./app/pages/content";
import Dashboard from "./app/pages/content/dashboard";
import Project from "./app/pages/content/project";
import DetailProject from "./app/pages/content/project/partials/detail";
import AccessProject from "./app/pages/content/project/partials/detail/partials/access";
import BacklogProject from "./app/pages/content/project/partials/detail/partials/backlog";
import BoardProject from "./app/pages/content/project/partials/detail/partials/board";
import Calendar from "./app/pages/content/project/partials/detail/partials/calendar";
import CodeProject from "./app/pages/content/project/partials/detail/partials/code";
import CustomFilter from "./app/pages/content/project/partials/detail/partials/custom-filter/filters";
import CustomFilterIssues from "./app/pages/content/project/partials/detail/partials/custom-filter/issues";
import CustomFilterList from "./app/pages/content/project/partials/detail/partials/custom-filter/issues/list";
import FeatureProject from "./app/pages/content/project/partials/detail/partials/feature";
import InfoProject from "./app/pages/content/project/partials/detail/partials/info";
import IssueTypes from "./app/pages/content/project/partials/detail/partials/issue-types";
import Labels from "./app/pages/content/project/partials/detail/partials/labels";
import MembersProject from "./app/pages/content/project/partials/detail/partials/members";
import NotificationProject from "./app/pages/content/project/partials/detail/partials/notification";
import Priorities from "./app/pages/content/project/partials/detail/partials/priorities";
import Release from "./app/pages/content/project/partials/detail/partials/release";
import Statuses from "./app/pages/content/project/partials/detail/partials/statuses";
import TimelineProject from "./app/pages/content/project/partials/detail/partials/timeline";
import User from "./app/pages/content/user";
import { PrivateRoute } from "./app/routes/private-route";

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Content />
            </PrivateRoute>
          }
        >
          <Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="project" element={<Project />}></Route>
            <Route path="user/:userId" element={<User />} />
            <Route path="filters" element={<CustomFilter />} />
            <Route path="issues/:filterId" element={<CustomFilterIssues />} />

            <Route path="project/:code" element={<DetailProject />}>
              <Route path="timeline" element={<TimelineProject />}>
                <Route path="timeline" element={<TimelineProject />}></Route>
              </Route>
              <Route path="backlog" element={<BacklogProject />}>
                <Route path=":issueId"></Route>
              </Route>
              <Route path="board" element={<BoardProject />}>
                <Route path=":issueId"></Route>
              </Route>
              <Route path="releases" element={<Release />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="details" element={<InfoProject />} />
              <Route path="issueTypes" element={<IssueTypes />} />
              <Route path="priorities" element={<Priorities />} />
              <Route path="statuses" element={<Statuses />} />
              <Route path="labels" element={<Labels />} />
              <Route path="notifications" element={<NotificationProject />} />
              <Route path="access" element={<AccessProject />} />
              <Route path="members" element={<MembersProject />} />
              <Route path="features" element={<FeatureProject />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
