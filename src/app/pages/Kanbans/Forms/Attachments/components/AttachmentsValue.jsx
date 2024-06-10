import { TbLayoutBoard } from "react-icons/tb";
import { useSelector } from "react-redux";

function AttachmentsValue() {
	const { task } = useSelector((state) => state.tasks);

    return (  
        <div className="relative mb-6">
			<div className="mb-3">
				<div className="absolute left-0 top-0 p-1">
					<TbLayoutBoard className="text-2xl text-task-icon" />
				</div>

				<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
                    Tập tin đính kèm 
				</p>
			</div>

            <div className="ml-12 grid grid-cols-2 gap-2">
                
            </div>
        </div>
    );
}

export default AttachmentsValue;