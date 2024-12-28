import { Routes, Route } from "react-router-dom";

const Settings = () => {
  return (
    <Routes>
      <Route
        path="profile"
        element={<h1 className="text-3xl font-bold text-gray-900">Profile</h1>}
      />
      <Route
        path="notifications"
        element={
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        }
      />
      <Route
        path="categories"
        element={<h1 className="text-3xl font-bold text-gray-900">Categories</h1>}
      />
      <Route
        path="spending-groups"
        element={
          <h1 className="text-3xl font-bold text-gray-900">Spending Groups</h1>
        }
      />
      <Route
        path="integrations"
        element={
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        }
      />
      <Route
        path="billing"
        element={<h1 className="text-3xl font-bold text-gray-900">Billing</h1>}
      />
    </Routes>
  );
};

export default Settings;