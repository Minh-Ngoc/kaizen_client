import { memo, useEffect } from "react";
import { setTask } from "_redux/slice/taskSlice";
import { useDispatch } from "react-redux";
import Performers from "./components/Performers";
import Dates from "./components/Dates";
import Project from "./components/Project";
import Labels from "./components/Labels";
import ChecklistValue from "./components/Checklist/components/ChecklistValue";
import Description from "./components/Description";
import Comments from "./components/Comments";
import TaskName from "./components/TaskName";

function TaskDetail({ task }) {
    const dispatch = useDispatch();

	useEffect(() => {
		if (task) {
			dispatch(setTask(task));
		}
	}, []);

    return (  
        <>
            <TaskName />

            <div className="grid grid-cols-12 gap-4 items-center p-6">
                <Performers />

                <Dates />

                <Project />

                <Labels />

                <Description />

                <ChecklistValue />
            </div>

            <Comments />
        </>
    );
}

export default memo(TaskDetail);