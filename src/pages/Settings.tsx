import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";

const Settings = () => {
  return (
    <Routes>
      <Route path="profile" element={<Profile />} />
      <Route
        path="appearance"
        element={
          <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
        }
      />
      <Route
        path="budget"
        element={
          <h1 className="text-3xl font-bold text-gray-900">Budget Settings</h1>
        }
      />
    </Routes>
  );
};

export default Settings;