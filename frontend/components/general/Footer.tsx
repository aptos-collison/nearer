

export const Footer = () => {
  return (
    <>
      <div className="flex justify-between items-start my-12 px-20">
        <div>
          <p className="text-yellow-300 font-semibold text-lg">TurboGo</p>
        </div>
        <p className="text-base ">Have any feedback? Dm  <span className="underline text-yellow-50">Emeka</span> or <span className="underline text-yellow-50">Wisdom</span>  on X </p>
        <div className="flex space-x-3 items-center">
          <img src="/public/icons/Twitter X.svg" className="bg-white rounded-sm" />
          <img src="/public/icons/Discord Icon.svg" />
        </div>
      </div>
    </>
  );
};
