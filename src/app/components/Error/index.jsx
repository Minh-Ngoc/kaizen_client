// Images
import { Button, Image } from "@nextui-org/react";
import { navigates } from "_constants";
import error404 from "assets/img/error-404.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Error403() {
  const navigate = useNavigate();

  return (
      <div className="h-[60vh] bg-white rounded-md p-4 flex flex-col justify-center gap-6">
        <div className="flex flex-col items-center">
          <p className="text-xl uppercase font-bold text-red-500">
            404 Not Found
          </p>
          <p className="text-task-title text-base">
            Trang web không hợp lệ. Vui lòng thử lại!
          </p>

          <Button 
            variant="solid"
            color="primary"
            className="mt-4 px-4 text-base items-center"
            startContent={<FaArrowLeftLong />}
            onClick={() => navigate(navigates.dashboard)}
          >
            Quay lại
          </Button>
        </div>

        <Image
            src={error404}
            className="w-auto h-auto max-h-96"
            alt=""
        />
      </div>
  );
}

export default Error403;