export const events = [
  { title: "All Day Event", start: getDate("YEAR-MONTH-01") },
  {
    title: "Rendezvous",
    start: getDate("YEAR-MONTH-07"),
    end: getDate("YEAR-MONTH-10")
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: getDate("YEAR-MONTH-09T16:00:00+00:00")
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: getDate("YEAR-MONTH-16T16:00:00+00:00")
  },
  {
    title: "Dontiste",
    start: "YEAR-MONTH-17",
    end: getDate("YEAR-MONTH-19")
  },
  {
    title: "Consultation",
    start: getDate("YEAR-MONTH-18T10:30:00+00:00"),
    end: getDate("YEAR-MONTH-18T12:30:00+00:00")
  },
  { title: "Visit", start: getDate("YEAR-MONTH-18T12:00:00+00:00") },
  { title: "maladie", start: getDate("YEAR-MONTH-19T07:00:00+00:00") },
  { title: "Meeting", start: getDate("YEAR-MONTH-18T14:30:00+00:00") },
  { title: "controlle", start: getDate("YEAR-MONTH-18T17:30:00+00:00") },
  { title: "finish", start: getDate("YEAR-MONTH-18T20:00:00+00:00") }
];

function getDate(dayString) {
  const today = new Date();
  const year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString();

  if (month.length === 1) {
    month = "0" + month;
  }

  return dayString.replace("YEAR", year).replace("MONTH", month);
}

export const tasks = [
  {
    "_id": "663edc0aee51d16592664451",
    "name": "Dựng UI about us",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb62331b96b6a72d91d8",
    "position": 1,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e30",
        "username": "trolyduyet2",
        "avatar": "",
        "name": "tro ly"
      },
      {
        "_id": "6628eb6b99245f9190415e31",
        "username": "leader01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "2024-05-14T17:00:00.000Z",
    "dateEnd": "2024-05-16T16:59:59.999Z",
    "description": "",
    "labels": [
      {
        "_id": "663edc0aee51d16592664454",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.530Z",
        "updatedAt": "2024-05-11T02:46:34.530Z"
      },
      {
        "_id": "663edc0aee51d16592664455",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.530Z",
        "updatedAt": "2024-05-11T02:46:34.530Z"
      },
      {
        "_id": "663edc0aee51d16592664456",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.531Z",
        "updatedAt": "2024-05-11T02:46:34.531Z"
      },
      {
        "_id": "663edc0aee51d16592664457",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.531Z",
        "updatedAt": "2024-05-11T02:46:34.531Z"
      },
      {
        "_id": "663edc0aee51d16592664458",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.531Z",
        "updatedAt": "2024-05-11T02:46:34.531Z"
      },
      {
        "_id": "663edc0aee51d16592664459",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.531Z",
        "updatedAt": "2024-05-11T02:46:34.531Z"
      },
      {
        "_id": "663edc0aee51d1659266445a",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "663edc0aee51d16592664451",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:34.531Z",
        "updatedAt": "2024-05-11T02:46:34.531Z"
      }
    ],
    "checklist": []
  },
  {
    "_id": "663edc12ee51d1659266446c",
    "name": "Viết API bài viết",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb7c331b96b6a72d91f9",
    "position": 1,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e39",
        "username": "elain",
        "avatar": ""
      },
      {
        "_id": "6628eb6b99245f9190415e3d",
        "username": "team7",
        "avatar": ""
      },
      {
        "_id": "6628eb6b99245f9190415e42",
        "username": "teamhaudai",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "2024-05-17T00:00:00.000Z",
    "dateEnd": "2024-05-18T00:00:00.000Z",
    "description": "",
    "labels": [
      {
        "_id": "663edc12ee51d1659266446f",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.665Z",
        "updatedAt": "2024-05-11T02:46:42.665Z"
      },
      {
        "_id": "663edc12ee51d16592664470",
        "title": "Khẩn cấp",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": true,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.665Z",
        "updatedAt": "2024-05-11T02:47:36.266Z"
      },
      {
        "_id": "663edc12ee51d16592664471",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.666Z",
        "updatedAt": "2024-05-11T02:46:42.666Z"
      },
      {
        "_id": "663edc12ee51d16592664472",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.666Z",
        "updatedAt": "2024-05-11T02:46:42.666Z"
      },
      {
        "_id": "663edc12ee51d16592664473",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": true,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.666Z",
        "updatedAt": "2024-05-11T02:47:22.393Z"
      },
      {
        "_id": "663edc12ee51d16592664474",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.666Z",
        "updatedAt": "2024-05-11T02:46:42.666Z"
      },
      {
        "_id": "663edc12ee51d16592664475",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "663edc12ee51d1659266446c",
        "__v": 0,
        "createdAt": "2024-05-11T02:46:42.666Z",
        "updatedAt": "2024-05-11T02:46:42.666Z"
      }
    ],
    "checklist": [
      {
        "_id": "663edc1aee51d1659266447e",
        "title": "layout",
        "taskId": "663edc12ee51d1659266446c",
        "items": [
          {
            "_id": "664197fbf8aaa3e624eed5da",
            "title": "thiết kế layout",
            "isChecked": false,
            "createdBy": "6628eb6b99245f9190415f45",
            "dateStart": null,
            "dateEnd": null,
            "createdAt": "2024-05-13T04:32:59.389Z",
            "updatedAt": "2024-05-15T02:42:18.334Z",
            "performer": {
              "_id": "6628eb6b99245f9190415f45",
              "username": "mrrobot"
            }
          }
        ],
        "dateStart": "2024-05-15T17:00:00.000Z",
        "dateEnd": "2024-05-30T17:00:00.000Z"
      },
      {
        "_id": "6641857d985ff90ca2b71fb0",
        "title": "content",
        "taskId": "663edc12ee51d1659266446c",
        "items": [
          {
            "_id": "66419801f8aaa3e624eed5e4",
            "title": "format content",
            "isChecked": false,
            "createdBy": "6628eb6b99245f9190415f45",
            "dateStart": "2024-05-06T17:00:00.000Z",
            "dateEnd": "2024-05-14T17:00:00.000Z",
            "createdAt": "2024-05-13T04:33:05.261Z",
            "updatedAt": "2024-05-15T10:28:02.165Z",
            "performer": {
              "_id": "6628eb6b99245f9190415f45",
              "username": "mrrobot"
            }
          }
        ],
        "dateStart": null,
        "dateEnd": null
      }
    ]
  },
  {
    "_id": "664192744751b6dd6eec5d16",
    "name": "Trang about us",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb75331b96b6a72d91ee",
    "position": 1,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e32",
        "username": "trolyduyet01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "2024-05-04T17:00:00.000Z",
    "dateEnd": "2024-05-06T17:00:00.000Z",
    "description": "",
    "labels": [
      {
        "_id": "664192744751b6dd6eec5d19",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.481Z",
        "updatedAt": "2024-05-13T04:09:24.481Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1a",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.481Z",
        "updatedAt": "2024-05-13T04:09:24.481Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1b",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.481Z",
        "updatedAt": "2024-05-13T04:09:24.481Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1c",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.482Z",
        "updatedAt": "2024-05-13T04:09:24.482Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1d",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.482Z",
        "updatedAt": "2024-05-13T04:09:24.482Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1e",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.482Z",
        "updatedAt": "2024-05-13T04:09:24.482Z"
      },
      {
        "_id": "664192744751b6dd6eec5d1f",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "664192744751b6dd6eec5d16",
        "__v": 0,
        "createdAt": "2024-05-13T04:09:24.482Z",
        "updatedAt": "2024-05-13T04:09:24.482Z"
      }
    ],
    "checklist": []
  },
  {
    "_id": "6644209c679b9940ca795130",
    "name": "Viết API đăng nhập",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb6c331b96b6a72d91e3",
    "position": 1,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e30",
        "username": "trolyduyet2",
        "avatar": "",
        "name": "tro ly"
      },
      {
        "_id": "6628eb6b99245f9190415e31",
        "username": "leader01",
        "avatar": ""
      },
      {
        "_id": "6628eb6b99245f9190415e33",
        "username": "trolybank01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "",
    "dateEnd": "",
    "description": "",
    "labels": [
      {
        "_id": "6644209c679b9940ca795133",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.350Z",
        "updatedAt": "2024-05-15T02:40:28.350Z"
      },
      {
        "_id": "6644209c679b9940ca795134",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      },
      {
        "_id": "6644209c679b9940ca795135",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      },
      {
        "_id": "6644209c679b9940ca795136",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      },
      {
        "_id": "6644209c679b9940ca795137",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      },
      {
        "_id": "6644209c679b9940ca795138",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      },
      {
        "_id": "6644209c679b9940ca795139",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "6644209c679b9940ca795130",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:28.351Z",
        "updatedAt": "2024-05-15T02:40:28.351Z"
      }
    ],
    "checklist": []
  },
  {
    "_id": "664193cc4751b6dd6eec5d73",
    "name": "Chính sách hoàn trả",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb75331b96b6a72d91ee",
    "position": 2,
    "performers": [],
    "attachments": [],
    "dateStart": "2024-05-07T17:00:00.000Z",
    "dateEnd": "2024-05-08T17:00:00.000Z",
    "description": "",
    "labels": [
      {
        "_id": "664193cc4751b6dd6eec5d76",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.048Z",
        "updatedAt": "2024-05-13T04:15:08.048Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d77",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.048Z",
        "updatedAt": "2024-05-13T04:15:08.048Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d78",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.048Z",
        "updatedAt": "2024-05-13T04:15:08.048Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d79",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.048Z",
        "updatedAt": "2024-05-13T04:15:08.048Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d7a",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.048Z",
        "updatedAt": "2024-05-13T04:15:08.048Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d7b",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.049Z",
        "updatedAt": "2024-05-13T04:15:08.049Z"
      },
      {
        "_id": "664193cc4751b6dd6eec5d7c",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "664193cc4751b6dd6eec5d73",
        "__v": 0,
        "createdAt": "2024-05-13T04:15:08.049Z",
        "updatedAt": "2024-05-13T04:15:08.049Z"
      }
    ],
    "checklist": [
      {
        "_id": "66419450f8aaa3e624eecaf5",
        "title": "Validate",
        "taskId": "664193cc4751b6dd6eec5d73",
        "items": [],
        "dateStart": null,
        "dateEnd": null
      }
    ]
  },
  {
    "_id": "6641b499f8aaa3e624eed65b",
    "name": "UI người dùng.",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb62331b96b6a72d91d8",
    "position": 2,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e30",
        "username": "trolyduyet2",
        "avatar": "",
        "name": "tro ly"
      },
      {
        "_id": "6628eb6b99245f9190415e31",
        "username": "leader01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "2024-05-08T17:00:00.000Z",
    "dateEnd": "2024-05-25T16:59:59.999Z",
    "description": "",
    "labels": [
      {
        "_id": "6641b499f8aaa3e624eed65e",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.433Z",
        "updatedAt": "2024-05-13T06:35:05.433Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed65f",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.433Z",
        "updatedAt": "2024-05-13T06:35:05.433Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed660",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.433Z",
        "updatedAt": "2024-05-13T06:35:05.433Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed661",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.433Z",
        "updatedAt": "2024-05-13T06:35:05.433Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed662",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.434Z",
        "updatedAt": "2024-05-13T06:35:05.434Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed663",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.434Z",
        "updatedAt": "2024-05-13T06:35:05.434Z"
      },
      {
        "_id": "6641b499f8aaa3e624eed664",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "6641b499f8aaa3e624eed65b",
        "__v": 0,
        "createdAt": "2024-05-13T06:35:05.434Z",
        "updatedAt": "2024-05-13T06:35:05.434Z"
      }
    ],
    "checklist": []
  },
  {
    "_id": "664420a6679b9940ca79514b",
    "name": "Viết API đăng ký",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb6c331b96b6a72d91e3",
    "position": 2,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e30",
        "username": "trolyduyet2",
        "avatar": "",
        "name": "tro ly"
      },
      {
        "_id": "6628eb6b99245f9190415e31",
        "username": "leader01",
        "avatar": ""
      },
      {
        "_id": "6628eb6b99245f9190415e32",
        "username": "trolyduyet01",
        "avatar": ""
      },
      {
        "_id": "6628eb6b99245f9190415e33",
        "username": "trolybank01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "",
    "dateEnd": "",
    "description": "",
    "labels": [
      {
        "_id": "664420a6679b9940ca79514e",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.392Z",
        "updatedAt": "2024-05-15T02:40:38.392Z"
      },
      {
        "_id": "664420a6679b9940ca79514f",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.393Z",
        "updatedAt": "2024-05-15T02:40:38.393Z"
      },
      {
        "_id": "664420a6679b9940ca795150",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.393Z",
        "updatedAt": "2024-05-15T02:40:38.393Z"
      },
      {
        "_id": "664420a6679b9940ca795151",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.393Z",
        "updatedAt": "2024-05-15T02:40:38.393Z"
      },
      {
        "_id": "664420a6679b9940ca795152",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.393Z",
        "updatedAt": "2024-05-15T02:40:38.393Z"
      },
      {
        "_id": "664420a6679b9940ca795153",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.394Z",
        "updatedAt": "2024-05-15T02:40:38.394Z"
      },
      {
        "_id": "664420a6679b9940ca795154",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "664420a6679b9940ca79514b",
        "__v": 0,
        "createdAt": "2024-05-15T02:40:38.394Z",
        "updatedAt": "2024-05-15T02:40:38.394Z"
      }
    ],
    "checklist": []
  },
  {
    "_id": "6641945ef8aaa3e624eecb1a",
    "name": "Điều khoản và chính sách",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb62331b96b6a72d91d8",
    "position": 3,
    "performers": [
      {
        "_id": "6628eb6b99245f9190415e30",
        "username": "trolyduyet2",
        "avatar": "",
        "name": "tro ly"
      },
      {
        "_id": "6628eb6b99245f9190415e31",
        "username": "leader01",
        "avatar": ""
      }
    ],
    "attachments": [],
    "dateStart": "2024-05-07T17:00:00.000Z",
    "dateEnd": "2024-05-23T16:59:59.999Z",
    "description": "",
    "labels": [
      {
        "_id": "6641945ef8aaa3e624eecb1d",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.029Z",
        "updatedAt": "2024-05-13T04:17:34.029Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb1e",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.029Z",
        "updatedAt": "2024-05-13T04:17:34.029Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb1f",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.030Z",
        "updatedAt": "2024-05-13T04:17:34.030Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb20",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.030Z",
        "updatedAt": "2024-05-13T04:17:34.030Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb21",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.030Z",
        "updatedAt": "2024-05-13T04:17:34.030Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb22",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.030Z",
        "updatedAt": "2024-05-13T04:17:34.030Z"
      },
      {
        "_id": "6641945ef8aaa3e624eecb23",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "6641945ef8aaa3e624eecb1a",
        "__v": 0,
        "createdAt": "2024-05-13T04:17:34.030Z",
        "updatedAt": "2024-05-13T04:17:34.030Z"
      }
    ],
    "checklist": [
      {
        "_id": "6642ea9a48238d95162b7402",
        "title": "check list",
        "taskId": "6641945ef8aaa3e624eecb1a",
        "items": [
          {
            "_id": "6642eaa248238d95162b7416",
            "title": "item 1",
            "isChecked": false,
            "createdBy": "6628eb6b99245f9190415f45",
            "dateStart": null,
            "dateEnd": null,
            "createdAt": "2024-05-14T04:37:54.825Z",
            "updatedAt": "2024-05-15T10:15:48.327Z",
            "performer": {
              "_id": "6628eb6b99245f9190415f45",
              "username": "mrrobot"
            }
          },
          {
            "_id": "6642eabf48238d95162b7433",
            "title": "item 3",
            "isChecked": false,
            "createdBy": "6628eb6b99245f9190415f45",
            "dateStart": null,
            "dateEnd": null,
            "createdAt": "2024-05-14T04:38:23.267Z",
            "updatedAt": "2024-05-14T04:38:23.267Z",
            "performer": {}
          },
          {
            "_id": "66448b68af09a0e57f6a8cc1",
            "title": "check list 2",
            "isChecked": false,
            "createdBy": "6628eb6b99245f9190415f45",
            "dateStart": "2024-05-15T17:00:00.000Z",
            "dateEnd": "2024-05-29T17:00:00.000Z",
            "createdAt": "2024-05-15T10:16:08.380Z",
            "updatedAt": "2024-05-15T10:16:40.113Z",
            "performer": {
              "_id": "6628eb6b99245f9190415f45",
              "username": "mrrobot"
            }
          }
        ],
        "dateStart": "2024-05-07T17:00:00.000Z",
        "dateEnd": "2024-05-27T17:00:00.000Z"
      }
    ]
  },
  {
    "_id": "664563b1399d438f5f120ec2",
    "name": "xxxx",
    "project": {
      "_id": "663edc01ee51d16592664427",
      "dateStart": "2024-04-30T17:00:00.000Z",
      "dateEnd": "2024-05-31T16:59:59.999Z"
    },
    "statusId": "6629bb62331b96b6a72d91d8",
    "position": 4,
    "performers": [],
    "attachments": [],
    "dateStart": "",
    "dateEnd": "",
    "description": "",
    "labels": [
      {
        "_id": "664563b1399d438f5f120ec5",
        "title": "",
        "colorLabel": "green",
        "colorCode": "bg-green-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.830Z",
        "updatedAt": "2024-05-16T01:38:57.830Z"
      },
      {
        "_id": "664563b1399d438f5f120ec6",
        "title": "",
        "colorLabel": "blue",
        "colorCode": "bg-blue-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.830Z",
        "updatedAt": "2024-05-16T01:38:57.830Z"
      },
      {
        "_id": "664563b1399d438f5f120ec7",
        "title": "",
        "colorLabel": "sky",
        "colorCode": "bg-sky-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.830Z",
        "updatedAt": "2024-05-16T01:38:57.830Z"
      },
      {
        "_id": "664563b1399d438f5f120ec8",
        "title": "",
        "colorLabel": "yellow",
        "colorCode": "bg-yellow-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.831Z",
        "updatedAt": "2024-05-16T01:38:57.831Z"
      },
      {
        "_id": "664563b1399d438f5f120ec9",
        "title": "",
        "colorLabel": "orange",
        "colorCode": "bg-orange-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.831Z",
        "updatedAt": "2024-05-16T01:38:57.831Z"
      },
      {
        "_id": "664563b1399d438f5f120eca",
        "title": "",
        "colorLabel": "red",
        "colorCode": "bg-red-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.831Z",
        "updatedAt": "2024-05-16T01:38:57.831Z"
      },
      {
        "_id": "664563b1399d438f5f120ecb",
        "title": "",
        "colorLabel": "purple",
        "colorCode": "bg-purple-400",
        "isChecked": false,
        "taskId": "664563b1399d438f5f120ec2",
        "__v": 0,
        "createdAt": "2024-05-16T01:38:57.831Z",
        "updatedAt": "2024-05-16T01:38:57.831Z"
      }
    ],
    "checklist": []
  }
]
