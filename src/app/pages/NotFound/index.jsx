import PageNotFound from "app/components/PageNotFound";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col pt-2 px-4 space-y-2 bg-white flex-grow pb-4">
      <div className="w-full h-[90vh] flex flex-wrap items-center justify-center">
        <PageNotFound />
        <div className="ml-10 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded px-5 py-10">
          <div className="flex flex-wrap items-center justify-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 font-semibold mr-8 pr-8 border-r-2 border-r-slate-200">
              404
            </h1>
            <span className="md:text-xl lg:text-2xl text-gray-600">
                Không tìm thấy trang!
            </span>
          </div>
          <Link to={"/"}>
            <button className="flex flex-row justify-center py-3 text-white transition-bg hover:opacity-80 duration-400 w-full uppercase font-semibold bg-[#407bff] rounded items-center !gap-5">
              <FaArrowLeft className="w-5 h-5" />{" "}
              Quay về trang chủ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
