import { useLocation } from "react-router-dom";

export function LFooter() {
  const location = useLocation();
  const showIcon = location.pathname === "/";

  return (
    <>
      <div className="flex justify-between items-start my-6 px-20 ">
        <div>
          <p className="font-semibold text-xl text-blue-600">Nearer</p>
          <p className="text-sm w-48 lg:w-96 text-white">
            Create and get shareable dapp links on any web environment. Access all the possibilities on Near.
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          {showIcon && (
            <img
              src="/icons/Twitter X.svg"
              className="bg-white rounded-sm w-6 h-6 mr-4"
              alt="Twitter"
            />
          )}
        </div>
      </div>

      {/* Todo: add image here */}
    </>
  );
}
