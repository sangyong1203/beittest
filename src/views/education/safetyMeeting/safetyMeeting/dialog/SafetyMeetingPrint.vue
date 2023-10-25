<template>
    <PrintDialog :title="'안전회의록'" @close-dialog="closeDialog" :key="dialogKey">
        <div class="wrap page-break">
            <div class="wrap__header">
                <div class="wrap__header__text-box">
                    <div class="center-box">
                        <p class="center-box__text">관계법령</p>
                        <p class="center-box__text">산업안전보건법 시행규칙 제79조(협의체의 구성 및 운영)</p>
                    </div>

                    <div class="version">
                        <span class="version__text">Ver.3</span>
                    </div>
                </div>

                <div class="wrap__header__title">
                    <div class="main-text">안전보건협의체 회의 ( {{ defaultData.minutes_type }} )</div>
                    <div class="main-text">( {{ defaultData.scene_name }} 현장 )</div>
                </div>
            </div>

            <!-- 개요 -->
            <div class="wrap__work">
                <div class="wrap__work__content">
                    <div class="summary">
                        <div class="summary__colum">
                            <div class="summary__colum__label">공사명</div>
                            <div class="summary__colum__value">
                                {{ loginData.user_main_company.scene_name }}
                            </div>
                        </div>

                        <div class="summary__colum">
                            <div class="summary__colum__label">업체</div>
                            <div class="summary__colum__value">
                                {{ defaultData.company_name }}
                            </div>
                        </div>

                        <div class="summary__colum">
                            <div class="summary__colum__label">회의일자</div>
                            <div class="summary__colum__value">
                                {{ defaultData.minutes_date }}
                            </div>
                        </div>
                    </div>

                    <div class="summary">
                        <div class="summary__colum">
                            <div class="summary__colum__label">작성자</div>
                            <div class="summary__colum__value">{{ defaultData.user_name }}</div>
                        </div>

                        <div class="summary__colum">
                            <div class="summary__colum__label">작성일</div>
                            <div class="summary__colum__value">
                                {{ defaultData.reg_date?.slice(0, 11) }}
                            </div>
                        </div>

                        <div class="summary__colum">
                            <div class="summary__colum__label">회의시간</div>
                            <div class="summary__colum__value">
                                {{ defaultData.minutes_time?.slice(0, 7) + " ~ " + defaultData.minutes_time?.slice(7, 14) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 참석인원 -->
            <div class="wrap__object">
                <div class="wrap__object__size-list">
                    <div class="attend-list">
                        <div class="attend-list__table-title">
                            <div class="attend-list__table-title__value">
                                <div class="main-text">참 석 인 원</div>
                                <div class="sub-text">
                                    <div class="sub-text__text">업체</div>
                                    <div class="sub-text__text">직책</div>
                                    <div class="sub-text__text">성명</div>
                                    <div class="sub-text__text">서명</div>
                                    <div class="sub-text__text">업체</div>
                                    <div class="sub-text__text">직책</div>
                                    <div class="sub-text__text">성명</div>
                                    <div class="sub-text__text">서명</div>
                                </div>
                            </div>
                        </div>
                        <div class="attend-list__table-list">
                            <div class="attend-list__table-list__text" v-for="(item, key) in tableData" :key="key">
                                <div class="width">{{ item.company_name }}</div>
                                <div class="width">{{ item.ctgo_occupation_name }}</div>
                                <div class="width">{{ item.user_name }}</div>
                                <div class="width">{{ item.sign }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 회의내용 / 의결사항 -->
            <div class="wrap__place page-break">
                <div class="wrap__place__content-box">
                    <div class="sub-title">
                        <div>회 의 내 용</div>
                    </div>
                    <div class="contents-text">
                        <div class="contents-text__text">
                            {{ defaultData.minutes_text }}
                        </div>
                    </div>
                </div>
                <div class="wrap__place__content-box">
                    <div class="sub-title">
                        <div>의 결 사 항</div>
                    </div>
                    <div class="contents-text">
                        <div class="contents-text__text">
                            {{ defaultData.minutes_resolution }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 회 의 사 진 -->
            <div class="wrap__place">
                <div class="wrap__place__content-box">
                    <div class="sub-title">회 의 사 진</div>
                    <div class="contents">
                        <!-- 이미지 -->
                        <div class="contents__Map">
                            <img v-if="imageUrls[0]" :src="imageUrls[0] ?? ''" />
                            <div v-else>이미지가 없습니다.</div>
                        </div>
                        <div class="contents__Map">
                            <img v-if="imageUrls[1]" :src="imageUrls[1] ?? ''" />
                            <div v-else>이미지가 없습니다.</div>
                        </div>
                        <div class="contents__Map">
                            <img v-if="imageUrls[2]" :src="imageUrls[2] ?? ''" />
                            <div v-else>이미지가 없습니다.</div>
                        </div>
                        <div class="contents__Map">
                            <img v-if="imageUrls[3]" :src="imageUrls[3] ?? ''" />
                            <div v-else>이미지가 없습니다.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 작성/검토/확인 -->
            <div class="wrap__footer">
                <div class="wrap__footer__logo-box">
                    <img src="@assets/images/kumho.svg" alt="" class="image" />
                </div>
            </div>
        </div>
    </PrintDialog>
</template>

<script setup lang="ts">
import PrintDialog from "@components/common/PrintDialogLayout.vue"
import { useStore } from "@stores/index"
import { ref } from "vue"

const emit = defineEmits(["close-dialog"])

const dialogKey = ref(0)
const closeDialog = () => {
    emit("close-dialog", false)
    dialogKey.value++
}

// store-------------------
const store = useStore()
const loginData: any = store.loginData

// 프린트 page1에 데이터 설정
const defaultData: any = ref({})
const tableData: any = ref([])

function setData(data: any) {
    defaultData.value = data
    console.log("set print data", defaultData.value, "attend", defaultData.value.minutes_attend)
    tableData.value = setlList(data.minutes_attend)
    let file_data = JSON.parse(data.minutes_file_data)
    setImage(file_data)
}
defineExpose({ setData })

// 결재 사인 블록
function setlList(data: any[]) {
    let list = [...data]
    let itemBlock = {
        company_name: "",
        ctgo_occupation_name: "",
        user_name: "",
        sign: "",
    }
    addItem(list)

    function addItem(dataList: any) {
        if (dataList.length < 22) {
            let addNo = 22 - dataList.length
            for (var i = 0; i < addNo; i++) {
                dataList.push(itemBlock)
            }
            addItem(dataList)
        }
    }
    return list
}

// images setting
const imageUrls: any = ref([])
function setImage(fileData: any) {
    console.log("fileData", fileData)

    if (fileData) {
        fileData.forEach((item: any) => {
            imageUrls.value.push(item.file_url + item.file_name)
        })
    }
    console.log("imageUrls", imageUrls)
}
</script>

<style lang="scss" scoped>
div,
b,
p,
span {
    box-sizing: border-box;
}
$border: 1px solid black;

.wrap {
    display: flex;
    flex-direction: column;

    width: 210mm;
    height: 297mm;

    font-size: 15px;
    line-height: 24px;
    text-align: center;
    align-items: center;

    li {
        list-style: none;
    }

    &__header {
        width: 100%;
        margin-bottom: 2mm;

        &__text-box {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            width: 100%;

            border: $border;

            .number {
                display: flex;
                flex-direction: column;

                width: 15%;

                border-right: $border;
                &__text:first-child {
                    border-bottom: 1px solid #000;
                }
            }

            .center-box {
                display: flex;
                flex-direction: column;

                width: 85%;

                border-right: $border;

                &__text {
                    margin: 0;
                }

                &__text:first-child {
                    border-bottom: 1px solid #000;
                }
            }

            .version {
                width: 36mm;
            }
        }

        &__title {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            height: 25mm;

            background-color: #242a5c;
            color: white;
            border: $border;
            border-top: none;
            border-bottom: none;
            .main-text {
                font-size: 25px;
                font-weight: 700;
                margin: 6px;
            }
        }
    }
    // 개요
    &__work {
        display: flex;
        flex-direction: column;

        width: 100%;
        margin-bottom: 2mm;

        font-size: 15px;

        &__title {
            text-align: left;
            font-size: 17px;
        }

        &__content {
            display: flex;
            flex-direction: row;
            border-left: $border;
            border-bottom: 1px solid black;

            .summary {
                display: flex;
                flex-direction: column;
                flex: 1;
                &__colum {
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    white-space: nowrap;
                    border-right: 1px solid black;

                    &__label {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 1px 0;

                        width: 23mm;

                        border-right: $border;
                        border-top: $border;
                        background-color: #c1daf2;
                        font-weight: 600;
                    }

                    &__value {
                        flex: 1;
                        border-top: $border;
                        .sign {
                            margin-left: 6mm;
                        }
                    }
                }
            }
        }
    }

    // 참석인원

    &__object {
        display: flex;
        flex-direction: column;

        width: 100%;
        margin-bottom: 2mm;

        &__title {
            text-align: left;
            font-size: 17px;
        }

        &__size-list {
            display: flex;
            flex-direction: row;
            border-left: 1px solid black;

            .attend-list {
                display: flex;
                flex-direction: column;
                width: 100%;

                &__table-title {
                    display: flex;
                    flex-direction: row;
                    height: 14mm;
                    width: 100%;

                    &__value {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        border-right: $border;
                        margin-right: 1px;

                        div {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100%;
                        }
                        .main-text {
                            border-top: 1px solid black;
                            border-bottom: 1px solid #000;
                            background-color: #c1daf2;
                            font-weight: 600;
                        }

                        .sub-text {
                            display: flex;

                            &__text {
                                width: 100%;

                                border-right: $border;
                                border-bottom: 1px solid #000;

                                font-weight: 600;
                            }

                            &__text:last-child {
                                border-right: none;
                            }
                        }
                    }
                }

                &__table-list {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;

                    &__text {
                        display: flex;
                        width: 396px;
                        border-bottom: $border;
                        flex-direction: row;
                        div {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .width {
                            flex: 1;
                            height: 24px;
                            border-right: $border;
                        }
                    }
                }
            }
        }
    }

    // 회 의 내 용 / 의 결 사 항

    &__place {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-bottom: 2mm;
        font-size: 15px;

        &__title-box {
            display: flex;
            justify-content: space-between;
            font-size: 17px;
        }
        &__content-box:last-child {
            border-right: $border;
        }
        &__content-box {
            border-left: $border;
            border-bottom: $border;
            width: 100%;
            .sub-title {
                display: flex;
                justify-content: center;
                align-items: center;
                border-top: $border;
                border-bottom: $border;
                font-size: 16px;
                background-color: #c1daf2;
                font-weight: 600;
            }
            .contents-text {
                display: flex;
                height: 140mm;
                flex-wrap: wrap;
                padding: 10px;
                &__text {
                    text-align: left;
                }
            }
            .contents {
                display: flex;
                height: 140mm;
                flex-wrap: wrap;
                padding: 5px;
                gap: 5px;
                align-items: center;
                justify-content: center;
                &__Map {
                    width: 49%;
                    height: 49%;
                    border: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        padding: 1px;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }

    &__footer {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 42mm;
        margin-bottom: 1mm;
        font-size: 16px;

        &__logo-box {
            display: flex;
            justify-content: center;
            align-items: center;

            height: 10mm;
            .image {
                width: 5%;
            }
        }
    }
}

@media print {
    .page-break {
        page-break-after: always;
    }
}
</style>
