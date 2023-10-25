import Excel from "@common/Excel.module.js"
import dayjs from "dayjs"

export function downLoadExcel(data) {
    print(data)
}

function print(printData) {
    console.log("meeting on print", printData)
    let firstRow = []
    for (let i = 0; i < 46; i++) {
        firstRow.push({ style: { width: 13, height: 1, backgroundColor: "black" } })
    }

    // sheet 1 ---------------------------------
    let listWorker = printData.minutes_attend ?? []
    let meetingStartTime = printData.minutes_time.slice(0, 7)
    let meetingEndTime = printData.minutes_time.slice(7, 14)
    let meetingTime = meetingStartTime + " ~ " + meetingEndTime
    let columStyle = {
        height: 22,
        width: 1,
    }
    let headerStyle = {
        verticalAlign: "middle",
        textAlign: "center",
        backgroundColor: "#c1daf2",
        fontSize: 20,
        fontWeight: "bold",
        border: "1px solid #000000",
    }

    let formLabelStyle = {
        textAlign: "center",
        border: "1px solid #000000",
        backgroundColor: "#c1daf2",
        verticalAlign: "middle",
        fontWeight: "bold",
        fontSize: 10,
    }
    let formInputStyle = {
        textAlign: "left",
        border: "1px solid #000000",
        verticalAlign: "middle",
        fontSize: 10,
    }
    let tableHeaderStyle = {
        textAlign: "center",
        border: "1px solid #000000",
        backgroundColor: "#fff5f5f5",
        verticalAlign: "middle",
        fontWeight: "bold",
        fontSize: 10,
    }
    let tableBodyStyle = {
        textAlign: "center",
        border: "1px solid #000000",
        verticalAlign: "middle",
        fontSize: 10,
    }

    let sheet1 = {
        name: "회의록(1)",
        data: [
            firstRow,
            [
                {
                    text: printData.minutes_type + "\n" + printData.scene_name,
                    colspan: 45,
                    rowspan: 4,
                    style: Object.assign(headerStyle),
                },
                { style: columStyle },
            ],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [
                {
                    text: "공사명",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.scene_name,
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
                {
                    text: "작성자",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.user_name,
                    colspan: 16,
                    style: Object.assign(formInputStyle),
                },
                { style: columStyle },
            ],
            [
                {
                    text: "업체",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.company_name,
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
                {
                    text: "작성일",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.reg_date.slice(0, 10),
                    colspan: 16,
                    style: Object.assign(formInputStyle),
                },
                { style: columStyle },
            ],
            [
                {
                    text: "회의일자",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.minutes_date,
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
                {
                    text: "회의시간",
                    colspan: 6,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: meetingTime,
                    colspan: 16,
                    style: Object.assign(formInputStyle),
                },
                { style: columStyle },
            ],
            [
                {
                    text: "참  석  인  원",
                    colspan: 45,
                    style: Object.assign(formLabelStyle),
                },
                { style: columStyle },
            ],
            [
                {
                    text: "업체",
                    colspan: 9,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "직책",
                    colspan: 5,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "성명",
                    colspan: 4,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "서명",
                    colspan: 5,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "업체",
                    colspan: 9,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "직책",
                    colspan: 5,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "성명",
                    colspan: 4,
                    style: Object.assign(tableHeaderStyle),
                },
                {
                    text: "서명",
                    colspan: 4,
                    style: Object.assign({ width: 21 }, tableHeaderStyle),
                },
                { style: columStyle },
            ],
        ],
    }

    let attendList = []
    for (let i = 0; i < 14; i++) {
        if (listWorker[i]) {
            attendList.push([
                { text: listWorker[i].company_name, colspan: 9, style: tableBodyStyle },
                { text: listWorker[i].ctgo_occupation_name, colspan: 5, style: tableBodyStyle },
                { text: listWorker[i].user_name, colspan: 4, style: tableBodyStyle },
                { text: "", colspan: 5, style: tableBodyStyle },

                { text: listWorker[i].company_name, colspan: 9, style: tableBodyStyle },
                { text: listWorker[i].ctgo_occupation_name, colspan: 5, style: tableBodyStyle },
                { text: listWorker[i].user_name, colspan: 4, style: tableBodyStyle },
                { text: "", colspan: 4, style: tableBodyStyle },
                { style: columStyle },
            ])
        } else {
            attendList.push([
                { text: "", colspan: 9, style: tableBodyStyle },
                { text: "", colspan: 5, style: tableBodyStyle },
                { text: "", colspan: 4, style: tableBodyStyle },
                { text: "", colspan: 5, style: tableBodyStyle },
                { text: "", colspan: 9, style: tableBodyStyle },
                { text: "", colspan: 5, style: tableBodyStyle },
                { text: "", colspan: 4, style: tableBodyStyle },
                { text: "", colspan: 4, style: tableBodyStyle },
                { style: columStyle },
            ])
        }
    }

    const meeting = [
        [
            {
                text: "대상 및 구성",
                colspan: 23,
                style: Object.assign(formLabelStyle),
            },
            {
                text: "의 결 사 항",
                colspan: 22,
                style: Object.assign(formLabelStyle),
            },
            { style: columStyle },
        ],
        [
            {
                text: [
                    "\n 1) 대상 : 동일한 장소에서 사업의 일부를 도급하는  사업 \n" +
                        "\n 2) 구성 : 도급인인 사업주 및 수급인인 사업주 전원 " +
                        "\n (현장소장 및 협력업체 현장소장)\n" +
                        "\n 3) 회의주기 : 위험성평가 회의 시",
                ],
                rowspan: 11,
                colspan: 23,
                style: Object.assign({ fontWeight: "bold", textAlign: "left" }, formInputStyle),
            },
            {
                text: [
                    "\n 1) 산업안전보건위원회에서 의결된 사항의 이행에 관한 사항" +
                        "\n 2) 합동, 순회점검 및 안전교육 실시에 관한 사항" +
                        "\n 3) 작업시작 및 종료시간에 관한 사항" +
                        "\n 4) 작업장 간 연락방법에 관한 사항" +
                        "\n 5) 발파작업, 화재발생 및 토석의 붕괴시 경보의 통일에 관한 사항" +
                        "\n 6) 안전수칙 준수 및 서약서 징구에 관한 사항" +
                        "\n 7) 재해발생시 대피 방법 등",
                ],
                rowspan: 11,
                colspan: 22,
                style: Object.assign({ fontWeight: "bold", textAlign: "left" }, formInputStyle),
            },
        ],
    ]

    const feedBack = [
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [
            {
                text: "전회 미결사항 FEED BACK",
                colspan: 23,
                style: Object.assign(formLabelStyle),
            },
            {
                text: "전회 미결사항의 이행대책 외결사항",
                colspan: 22,
                style: Object.assign(formLabelStyle),
            },
            { style: columStyle },
        ],
        [
            {
                text: "",
                rowspan: 11,
                colspan: 23,
                style: Object.assign(formInputStyle),
            },
            {
                text: "",
                rowspan: 11,
                colspan: 22,
                style: Object.assign(formInputStyle),
            },
            { style: columStyle },
        ],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
        [{ style: columStyle }],
    ]

    attendList.forEach((item) => {
        sheet1.data.push(item)
    })
    meeting.forEach((item) => {
        sheet1.data.push(item)
    })
    feedBack.forEach((item) => {
        sheet1.data.push(item)
    })

    // sheet 2 ------------------------
    let tableHeader = {
        textAlign: "center",
        border: "1px solid #000000",
        verticalAlign: "middle",
        backgroundColor: "#c1daf2",
        fontWeight: "bold",
        fontSize: 10,
        height: 35,
    }
    let indexNumber = {
        textAlign: "left",
        border: "1px solid #000000",
        verticalAlign: "middle",
        fontSize: 10,
        height: 66,
    }
    let tableListStyle = {
        textAlign: "left",
        border: "1px solid #000000",
        verticalAlign: "middle",
        fontSize: 10,
        height: 66,
    }
    let sheet2 = {
        name: "회의록(2)",
        data: [
            firstRow,
            [
                {
                    text: "회 의 내 용",
                    colspan: 45,
                    rowspan: 3,
                    style: Object.assign(headerStyle),
                },
                { style: columStyle },
            ],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [
                {
                    text: "NO",
                    colspan: 2,
                    style: Object.assign(tableHeader),
                },
                {
                    text: "금회 협의체 회의 주요안건",
                    colspan: 22,
                    style: Object.assign(tableHeader),
                },
                {
                    text: "금회 협의체 회의 의결사항",
                    colspan: 21,
                    style: Object.assign({ width: 21 }, tableHeader),
                },
                { style: columStyle },
            ],
        ],
    }

    for (let i = 0; i < 14; i++) {
        if (printData.minutes_detail[i]) {
            let item = [
                {
                    text: i + 1,
                    colspan: 2,
                    style: Object.assign(indexNumber),
                },
                {
                    text: printData.minutes_detail[i].minutes_text,
                    colspan: 22,
                    style: Object.assign(tableListStyle),
                },
                {
                    text: printData.minutes_detail[i].minutes_resolution,
                    colspan: 21,
                    style: Object.assign(tableListStyle),
                },
            ]
            sheet2.data.push(item)
        } else {
            let item = [
                {
                    text: i + 1,
                    colspan: 2,
                    style: Object.assign(indexNumber),
                },
                {
                    text: "",
                    colspan: 22,
                    style: Object.assign(tableListStyle),
                },
                {
                    text: "",
                    colspan: 21,
                    style: Object.assign(tableListStyle),
                },
            ]
            sheet2.data.push(item)
        }
    }

    // sheet 3 ------------------------
    let fileData = JSON.parse(printData.minutes_file_data) ?? []
    let imgUrl1 = fileData[0] ? fileData[0].file_url + fileData[0].file_name : ""
    let imgUrl2 = fileData[1] ? fileData[1].file_url + fileData[1].file_name : ""

    let imageBoxStyle = {
        border: "1px solid #000000",
    }
    let img1 = getImage(imgUrl1)
    let img2 = getImage(imgUrl2)
    function getImage(imgUrl) {
        let imgItem = {
            img: { src: imgUrl, top: 20, left: 20, width: 610, height: 380 },
            colspan: 45,
            rowspan: 20,
            style: Object.assign(imageBoxStyle),
        }
        let bankItem = {
            text: "이미지가 없습니다.",
            colspan: 45,
            rowspan: 20,
            style: {
                textAlign: "center",
                border: "1px solid #000000",
                verticalAlign: "middle",
                fontSize: 12,
            },
        }
        if (imgUrl) {
            return imgItem
        }
        return bankItem
    }
    let sheet3 = {
        name: "회의록(3) 사진대지",
        data: [
            firstRow,
            [
                {
                    text: "사 진 대 지",
                    colspan: 45,
                    rowspan: 3,
                    style: Object.assign(headerStyle),
                },
                { style: columStyle },
            ],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [img1, { style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [
                {
                    text: "내 용",
                    colspan: 5,
                    rowspan: 2,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: "",
                    colspan: 18,
                    rowspan: 2,
                    style: Object.assign(formInputStyle),
                },
                {
                    text: "일시",
                    colspan: 5,
                    style: Object.assign({ width: 21 }, formLabelStyle),
                },
                {
                    text: printData.minutes_date,
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
            ],
            [
                {
                    text: "장소",
                    colspan: 5,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: "",
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
            ],
            [img2, { style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [{ style: columStyle }],
            [
                {
                    text: "내 용",
                    colspan: 5,
                    rowspan: 2,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: "",
                    colspan: 18,
                    rowspan: 2,
                    style: Object.assign(formInputStyle),
                },
                {
                    text: "일시",
                    colspan: 5,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: printData.minutes_date,
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
            ],
            [
                {
                    text: "장소",
                    colspan: 5,
                    style: Object.assign(formLabelStyle),
                },
                {
                    text: "",
                    colspan: 17,
                    style: Object.assign(formInputStyle),
                },
            ],
        ],
    }

    console.log("sheet3", sheet3)

    Excel.make([sheet1, sheet2, sheet3], "안전교육회의록" + dayjs(new Date()).format("YYYY-MM-DD"))
}
