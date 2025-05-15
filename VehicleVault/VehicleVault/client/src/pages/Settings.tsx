import { FC } from "react";

const Settings: FC = () => {
  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Page</h3>
            <p className="text-gray-500">This page is under construction. Coming soon!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
