

export function LFooter () {
  return (
    <>
      <div className="flex justify-between items-start my-6 px-20 ">
        <div>
          <p className="text-yellow-400 font-semibold text-xl">TurboGo</p>
          <p className="text-sm w-48 lg:w-96">
            Your easy guide to all things onchain. Learn, earn and race through terrains on Aptos, one adventure at a
            time.
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          <img src="/public/icons/Twitter X.svg" className="bg-white rounded-sm w-6 h-6 mr-4" />
        </div>
      </div>

      {/* Todo: add image here */}
    </>
  );
};
