import authReducer from "../slice/authSlice";
import userReducer from "../slice/user.slice";
import modalReducer from "../slice/modalSlice";
import sidebarTaskReducer from "../slice/sidebarTaskSlice";
import newReducer from "../slice/newSlice";
import roleReducer from "../slice/roleSlice";
import tasksReducer from "../slice/taskSlice";
import departmentReducer from "../slice/departmentSlice";
import logReducer from "../slice/logSlice";
import projectsReducer from "../slice/projectSlice";
import brandReducer from "../slice/brandSlice";
import kpiBonusReducer from "../slice/kpiBonusSlice";
import teamReducer from "../slice/teamSlice";
import blogReducer from "../slice/blogSlice";
import activityReducer from "../slice/activitySlice";
import seoProjectSlice from "../slice/seoProjectSlice";
import domainReducer from "../slice/domainSlice";
import seoReducer from "../slice/seoSlice";
import yourTicketReducer from "../slice/yourTicketSlice";
import dayOffReducer from "../slice/dayOffSlice";
import commentReducer from "../slice/commentSlice";
const rootReducer = {
  auth: authReducer,
  modal: modalReducer,
  sidebarTask: sidebarTaskReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  user: userReducer,
  new: newReducer,
  role: roleReducer,
  department: departmentReducer,
  log: logReducer,
  brand: brandReducer,
  kpiBonus: kpiBonusReducer,
  team: teamReducer,
  blog: blogReducer,
  activity: activityReducer,
  seoProject: seoProjectSlice,
  domain: domainReducer,
  seo: seoReducer,
  yourTicket: yourTicketReducer,
  dayOff: dayOffReducer,
  comment: commentReducer,
};

export default rootReducer;
