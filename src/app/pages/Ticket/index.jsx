import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  Flex,
  Icon,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Divider,
} from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from "@ajna/pagination";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Card from "components/Card/Card";
import { IoSearchSharp } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { yourticketAction } from "_redux/slice/yourTicketSlice";
import moment from "moment";
import { Chip } from "@nextui-org/react";
import {
  getPriorityText,
  getProjectTicketText,
  getResponseStatusText,
  listPriority,
  listProjectTicket,
  listResponseStatus,
} from "_utils";
import { Tooltip } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { BiTrash, BiPlus } from "react-icons/bi";
import ModalTicket from "./components/modalTicket";
import DateRangerPicker from "app/components/DateRangerPicker";
import ModalDetailTicket from "./components/modalDetailTicket";
function dateToUtcTime(date) {
  if (!date) return "";
  const userTimeZoneOffset = date?.getTimezoneOffset();
  const utcOffsetInHours = -userTimeZoneOffset / 60;
  const utcTime = new Date(date.getTime() + utcOffsetInHours * 60 * 60 * 1000);
  return utcTime;
}
export default function Ticket() {
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.yourTicket.counts);
  const listTicket = useSelector((state) => state.yourTicket.listTicket);
  const isLoading = useSelector((state) => state.yourTicket.isLoading);
  const [priority, setPriority] = useState("all");
  const [project, setProject] = useState("all");
  const [responseStatus, setResponseStatus] = useState("all");
  const [isOpenModalTicket, setIsOpenModalTicket] = useState(false);
  const [isOpenModalDetailTicket, setIsOpenModalDetailTicket] = useState(false);
  const [ticket, setTicket] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    dispatch(yourticketAction.getAllYourTicketPaging({}));
  }, []);
  const columns = [
    {
      header: "Tiêu đề",
      accessorKey: "title",
      cell: ({ row }) => (
        <p className="text-[13px] text-white ">{row.original?.title}</p>
      ),
    },
    {
      header: "Độ ưu tiên",
      accessorKey: "priority",
      cell: ({ row }) => (
        <Chip
          radius="sm"
          color={getPriorityText[row.original?.priority]?.color}
        >
          {getPriorityText[row.original?.priority]?.text}
        </Chip>
      ),
    },
    {
      header: "Dự án",
      accessorKey: "project",
      cell: ({ row }) => (
        <Chip
          radius="sm"
          color={getProjectTicketText[row.original?.project]?.color}
        >
          {getProjectTicketText[row.original?.project]?.text}
        </Chip>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "responseStatus",
      cell: ({ row }) => (
        <Chip
          radius="sm"
          color={getResponseStatusText[row.original?.responseStatus]?.color}
        >
          {getResponseStatusText[row.original?.responseStatus]?.text}
        </Chip>
      ),
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <p className="text-[13px] text-white">
          {moment(row.getValue("createdAt")).format("DD/MM/yyyy")}
        </p>
      ),
    },
    {
      header: "Hành động",
      accessorKey: "id",
      cell: ({ row }) => {
        return (
          <Stack gap={1} direction={"row"}>
            <Tooltip
              color={"primary"}
              content={"Xem chi tiết"}
              className="capitalize"
              disableAnimation={true}
            >
              <Button
                p={0}
                minW={"30px"}
                h={"30px"}
                borderRadius={"full"}
                color={"white"}
                _hover={{
                  bg: "blue.400",
                }}
                bg={"#0389e9"}
                onClick={() => {
                  setTicket(row.original);
                  setIsOpenModalDetailTicket(true);
                }}
              >
                <Icon as={FaRegEye} />
              </Button>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
  const {
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = usePagination({
    total: counts,
    limits: {
      outer: 1,
      inner: 1,
    },
    initialState: {
      pageSize: 10,
      currentPage: 1,
    },
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const handlePageChange = (nextPage, nextPageSize) => {
    nextPageSize && setPageSize(nextPageSize);
    setCurrentPage(nextPage);
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: nextPage,
        pageSize: nextPageSize ?? pageSize,
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const handleonComplete = () => {
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: currentPage,
        pageSize,
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const handleSearh = () => {
    setCurrentPage(1);
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: 1,
        pageSize,
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const table = useReactTable({
    data: listTicket,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <>
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
        <Box
          mb="16px"
          borderRadius="4px"
          px="0px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          align="center"
          zIndex={2}
					className="shadow-wrapper"
        >
          <Card p="24px" borderRadius="20px">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="max-w-[220px] flex items-center gap-2">
                <Button
                  borderRadius="4px"
                  transition="background .3s ease"
                  bg={"green.500"}
                  _hover={{
                    bg: "green.500",
                  }}
                  _active={{
                    bg: "green.500",
                  }}
                  leftIcon={<Icon color="white" as={BiPlus} />}
                  minW="135px"
                  onClick={() => {
                    setIsOpenModalTicket(true);
                  }}
                >
                  <Text fontSize="xs" color="#fff" fontWeight="bold">
                    Tạo ticket
                  </Text>
                </Button>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 ">
                <DateRangerPicker
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={(day) => {
                    setStartDate(day);
                  }}
                  setEndDate={(day) => {
                    setEndDate(day);
                  }}
                />
                <Select
                  onChange={(e) => setPriority(e.target.value)}
                  color={"#ffffff"}
                  defaultValue={"all"}
                  fontSize={"14px"}
                  className="!min-w-40"
                >
                  {listPriority.map((priority) => (
                    <option
                      style={{
                        backgroundColor: "red !important",
                        color: "#1a1a1a",
                      }}
                      value={priority?.value}
                    >
                      {priority?.label}
                    </option>
                  ))}
                </Select>
                <Select
                  onChange={(e) => setProject(e.target.value)}
                  color={"#ffffff"}
                  defaultValue={"all"}
                  fontSize={"14px"}
                  className="!min-w-40"
                >
                  {listProjectTicket.map((project) => (
                    <option
                      style={{
                        backgroundColor: "red !important",
                        color: "#1a1a1a",
                      }}
                      value={project?.value}
                    >
                      {project?.label}
                    </option>
                  ))}
                </Select>
                <Select
                  onChange={(e) => setResponseStatus(e.target.value)}
                  color={"#ffffff"}
                  defaultValue={"all"}
                  fontSize={"14px"}
                  className="!min-w-40"
                >
                  {listResponseStatus.map((status) => (
                    <option
                      style={{
                        backgroundColor: "red !important",
                        color: "#1a1a1a",
                      }}
                      value={status?.value}
                    >
                      {status?.label}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={handleSearh}
                  borderRadius="4px"
                  transition="background .3s ease"
                  bg={"blue.500"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  _active={{
                    bg: "blue.500",
                  }}
                  me={{ base: "none", lg: "20px" }}
                  leftIcon={<Icon color="white" as={IoSearchSharp} />}
                  minW="135px"
                >
                  <Text fontSize="xs" color="#fff" fontWeight="bold">
                    Tìm kiếm
                  </Text>
                </Button>
              </div>
            </div>
          </Card>
        </Box>
        <Box
          mb="16px"
          borderRadius="4px"
          px="0px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          align="center"
          overflowY={"auto"}
					className="shadow-wrapper"
        >
          <Card p="24px" borderRadius="20px">
            <Divider />
            <Table variant="simple" color="gray.500" mb="24px">
              <Thead className="bg-[#758beb]">
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <Tr key={index}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Th key={header.id} padding={""}>
                          <Flex
                            justify="space-between"
                            align="center"
                            fontSize={{ sm: "10px", lg: "12px" }}
                            color="gray.400"
                            className="!text-white font-bold"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Flex>
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>

              <Tbody>
                {!isLoading && table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: "14px" }}
                          color="black"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : isLoading ? (
                  Array.from(Array(pageSize)).map((e) => (
                    <Tr className="w-full">
                      {Array.from(Array(columns.length)).map((cell) => (
                        <Td
                          key={cell}
                          color="black"
                          className={`${cell === 3 && "w-36"}`}
                        >
                          <p className="text-white text-sm">Đang tải...</p>
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      colSpan={columns.length}
                      className="h-96 !text-center max-sm:!text-start max-sm:!px-32"
                      color="white"
                    >
                      Không có dữ liệu
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            {listTicket.length !== 0 ? (
              <Flex
                justify="space-between"
                alignItems={{ sm: "start", md: "center" }}
                className="flex-row max-sm:flex-col max-sm:justify-start max-sm:items-start"
                align="center"
                w="100%"
                px={{ md: "22px" }}
              >
                <Text
                  fontSize="sm"
                  color="white"
                  fontWeight="normal"
                  className="text-center"
                  p={1}
                  mt={{ sm: "5px", md: "0px" }}
                  mb={{ sm: "5px", md: "0px" }}
                >
                  Có tất cả {counts} ticket
                </Text>
                <div className="flex flex-row justify-center items-center max-sm:flex-col  max-sm:items-end max-sm:w-full ">
                  <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  >
                    <PaginationContainer
                      className="w-full max-sm:!px-1 max-sm:!py-3 gap-2 max-sm:gap-0"
                      align="center"
                      justify="space-between"
                      ms="auto"
                      p={4}
                    >
                      <PaginationPrevious
                        transition="all .5s ease"
                        w="40px"
                        h="40px"
                        borderRadius="8px"
                        bg="#fff"
                        border="1px solid lightgray"
                        _hover={{
                          bg: "gray.200",
                          opacity: "0.7",
                          borderColor: "gray.500",
                        }}
                      >
                        <Icon
                          as={GrFormPrevious}
                          w="16px"
                          h="16px"
                          color="gray.400"
                        />
                      </PaginationPrevious>
                      <PaginationPageGroup
                        align="center"
                        separator={
                          <PaginationSeparator
                            onClick={() =>
                              console.log(
                                "Im executing my own function along with Separator component functionality"
                              )
                            }
                            bg="gray.300"
                            fontSize="sm"
                            w={7}
                            jumpSize={5}
                          />
                        }
                      >
                        {pages.map((page) => (
                          <PaginationPage
                            page={page}
                            key={page}
                            className="!text-[13px]"
                            variant="no-effects"
                            transition="all .5s ease"
                            w="40px"
                            h="40px"
                            borderRadius="8px"
                            bg={"#fff"}
                            border={"1px solid lightgray"}
                            _hover={{
                              opacity: "0.7",
                              borderColor: "gray.500",
                            }}
                            _current={{
                              border: "none",
                              bg: "blue.500",
                              color: "white",
                            }}
                          />
                        ))}
                      </PaginationPageGroup>
                      <PaginationNext
                        transition="all .5s ease"
                        w="40px"
                        h="40px"
                        borderRadius="8px"
                        bg="#fff"
                        border="1px solid lightgray"
                        _hover={{
                          bg: "gray.200",
                          opacity: "0.7",
                          borderColor: "gray.500",
                        }}
                      >
                        <Icon
                          as={GrFormNext}
                          w="16px"
                          h="16px"
                          color="gray.400"
                        />
                      </PaginationNext>
                    </PaginationContainer>
                  </Pagination>
                  <Stack
                    direction={{ sm: "column", md: "row" }}
                    spacing={{ sm: "4px", md: "12px" }}
                    align="center"
                    ms={3}
                  >
                    <div className="min-w-32">
                      <Select
                        variant="outline"
                        value={pageSize}
                        onChange={(e) => {
                          handlePageChange(1, Number(e.target.value));
                        }}
                        color="white"
                        size="sm"
                        borderRadius="12px"
                        cursor="pointer"
                      >
                        <option className="!text-black">10</option>
                        <option className="!text-black">20</option>
                        <option className="!text-black">30</option>
                        <option className="!text-black">50</option>
                        <option className="!text-black">100</option>
                      </Select>
                    </div>
                  </Stack>
                </div>
              </Flex>
            ) : null}
          </Card>
        </Box>
      </Flex>
      <ModalTicket
        isOpen={isOpenModalTicket}
        onClose={() => {
          setIsOpenModalTicket(!isOpenModalTicket);
        }}
        onComplete={handleonComplete}
      />
      <ModalDetailTicket
        isOpen={isOpenModalDetailTicket}
        onClose={() => {
          setIsOpenModalDetailTicket(!isOpenModalDetailTicket);
        }}
        ticket={ticket}
      />
    </>
  );
}
