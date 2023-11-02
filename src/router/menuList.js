import * as icons from "./icons.js"

export const menuList = [
    {
        nameZh: "모니터링",
        name: "dashboard",
        path: "/dashboard",
        iconCls: icons.MORNITERING,
        isActive: false,
        menuVOList: [
            {
                nameZh: "현장 모니터링",
                name: "dashboard",
                path: "/dashboard/index",
                iconCls: "",
                isActive: false,
            },
        ],
    },
    {
        nameZh: "알림/공지사항",
        name: "notice",
        path: "/notice",
        iconCls: icons.NOTICE,
        isActive: false,
        menuVOList: [
            // {
            //     nameZh: "공지사항",
            //     name: "noticeList",
            //     path: "/notice/noticeList",
            //     iconCls: "",
            //     isActive: false,
            // },
            // {
            //     nameZh: "알림수신함",
            //     name: "alarmInbox",
            //     path: "/notice/alarmInbox",
            //     iconCls: "",
            //     isActive: false,
            // },
            {
                nameZh: "SOS요청이력",
                name: "sos",
                path: "/notice/sos",
                iconCls: "",
                isActive: false,
            },
            {
                nameZh: "작업중지요청이력",
                name: "workStop",
                path: "/notice/workStop",
                iconCls: "",
                isActive: false,
            },
        ],
    },
    
    {
        nameZh: "인력관리",
        name: "humanResource",
        path: "/humanResource",
        iconCls: icons.HUMAN_RESOURCE,
        isActive: false,
        menuVOList: [
            {
                nameZh: "근로자관리",
                name: "workerManagement",
                path: "/humanResource/workerManagement",
                iconCls: "",
                isActive: false,
            },
            {
                nameZh: "관리자관리",
                name: "managerManagement",
                path: "/humanResource/managerManagement",
                iconCls: "",
                isActive: false,
            },
        ],
    },
    {
        nameZh: "장비관리",
        name: "heavyEquipment",
        path: "/heavyEquipment",
        iconCls: icons.HEAVY_EQUIPMENT,
        isActive: false,
        menuVOList: [
            {
                nameZh: "장비등록관리",
                name: "equipManagement",
                path: "/heavyEquipment/equipManagement",
                iconCls: "",
                isActive: false,
            },
        ],
    },
    
    {
        nameZh: "현장관리/기준설정",
        name: "setting",
        path: "/setting",
        iconCls: icons.SETTING,
        isActive: false,
        menuVOList: [
            {
                nameZh: "현장관리",
                name: "sceneManage",
                path: "/setting/sceneManage",
                iconCls: "",
                isActive: false,
            },
            {
                nameZh: "업체관리",
                name: "companyManage",
                path: "/setting/companyManage",
                iconCls: "",
                isActive: false,
            },
            {
                nameZh: "현장세부정보설정",
                name: "sceneInfoSetup",
                path: "/setting/sceneInfoSetup",
                iconCls: "",
                isActive: false,
            },
            {
                nameZh: "NFC관리",
                name: "NFC",
                path: "/setting/NFC",
                iconCls: "",
                isActive: false,
            },
        ],
    },
]
