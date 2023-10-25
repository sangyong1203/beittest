<template>
    <PrintDialog :title="'안전교육'" @close-dialog="closeDialog" :key="dialogKey">
        <div class="wrap page-break">
            <div class="wrap__header">
                <div class="wrap__header__title">
                    <div class="main-text">{{ defaultData.education_class_name }} 교욱</div>
                    <div class="main-text">( {{ defaultData.scene_name }} )</div>
                </div>
            </div>

            <!-- 개요 -->
            <div class="wrap__work">
                <div class="wrap__work__content">
                    <div class="summary">
                        <!-- <div class="summary__colum">
                            <div class="summary__colum__label">공 사 명</div>
                            <div class="summary__colum__value">
                                {{ defaultData.scene_name }}
                            </div>
                        </div> -->
                        <div class="summary__colum">
                            <div class="summary__colum__label">업체</div>
                            <div class="summary__colum__value">
                                {{ defaultData.company_name }}
                            </div>
                        </div>
                        <!-- <div class="summary__colum">
                            <div class="summary__colum__label">교육강사</div>
                            <div class="summary__colum__value">
                                {{ defaultData.lecturer_name }}
                            </div>
                        </div> -->
                        <div class="summary__colum">
                            <div class="summary__colum__label">교육장소</div>
                            <div class="summary__colum__value">
                                {{ defaultData.education_area }}
                            </div>
                        </div>
                    </div>
                    <div class="summary">
                        <!-- <div class="summary__colum">
                            <div class="summary__colum__label">작성자</div>
                            <div class="summary__colum__value">
                                {{ defaultData.user_name }}
                            </div>
                        </div> -->
                        <!-- <div class="summary__colum">
                            <div class="summary__colum__label">작성일</div>
                            <div class="summary__colum__value">
                                {{ defaultData.reg_date }}
                            </div>
                        </div> -->
                        <div class="summary__colum">
                            <div class="summary__colum__label">직책</div>
                            <div class="summary__colum__value">
                                {{ defaultData.lecturer_position }}
                            </div>
                        </div>
                        <div class="summary__colum">
                            <div class="summary__colum__label">교육일자</div>
                            <div class="summary__colum__value">
                                {{ defaultData.education_date + " " + defaultData.education_start_time + " ~ " + defaultData.education_end_time }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap__work__content">
                    <div class="summary">
                        <div class="summary__colum">
                            <div class="summary__colum__label">교육내용</div>
                            <div class="summary__colum__value text-area">
                                {{ defaultData.education_contents }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 사진 -->
            <div class="wrap__place border-bottom">
                <div class="wrap__place__content-box">
                    <div class="sub-title">
                        <div>교 육 사 진</div>
                    </div>
                    <div class="contents">
                        <div class="contents__Map">
                            <img v-if="imageFile" :src="imageFile.full_url ?? ''" />
                            <div v-else>이미지가 없습니다.</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- footer -->
            <div class="wrap__footer" style="margin-bottom: 20px">
                <div class="wrap__footer__logo-box">
                    <img src="@assets/images/kumho.svg" alt="" class="image" />
                </div>
            </div>
        </div>

        <div class="wrap page-break">
            <!-- 참석인원 -->
            <div class="wrap__place">
                <div class="content-table">
                    <div class="sub-title">
                        <div>교 육 참 석 인 원</div>
                    </div>
                    <div class="contents" style="flex-wrap: nowrap">
                        <div class="table-menu border-right-nth-odd middleline" v-for="i in 2">
                            <div v-for="(item, index) in tableMenu" class="table-menu__item">
                                <span>{{ item }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="contents">
                        <div v-for="item in defaultData.member" class="table-list border-right-nth-odd">
                            <div class="table-list__item" style="width:24%">{{ item.company_name }}</div>
                            <div class="table-list__item" style="width:40%">{{ item.ctgo_occupation_name }}</div>
                            <div class="table-list__item" style="width:18%">{{ item.user_name }}</div>
                            <div class="table-list__item" style="width:18%">{{ item.reg_date.slice(0, 10) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- footer -->
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
import { ref } from "vue"

const emit = defineEmits(["close-dialog"])

const dialogKey = ref(0)
const closeDialog = () => {
    emit("close-dialog", false)
    dialogKey.value++
}

const tableMenu = ["업체", "직종", "성명", "서명"]

// 프린트 데이터 설정
const defaultData: any = ref({})
const imageFile: any = ref("")
function setData(data: any) {
    console.log("priint data", data)
    defaultData.value = data
    setMemberList(defaultData.value.member)
    defaultData.value.file_data = data.file_data !== null ? JSON.parse(data.file_data) : []
    imageFile.value = defaultData.value.file_data[0]
}
defineExpose({ setData })

// 참석인원 빈값 추가
function setMemberList(member: any[]) {
    let itemBlock = {
        company_name: "",
        ctgo_occupation_name: "",
        user_name: "",
        reg_date:""
    }

    addItem(member)

    function addItem(dataList: any) {
        if (dataList.length < 60) {
            let addNo = 60 - dataList.length

            for (var i = 0; i < addNo; i++) {
                dataList.push(itemBlock)
            }
            addItem(dataList)
        }
    }
}
</script>

<style lang="scss" scoped>
div,
b,
p,
span {
    box-sizing: border-box;
}

.border-bottom {
    border-bottom: 1px solid black;
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
    margin-bottom: 50px;
    li {
        list-style: none;
    }

    &__header {
        width: 100%;

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
        font-size: 15px;

        &__title {
            text-align: left;
            font-size: 17px;
        }

        &__content {
            display: flex;
            flex-direction: row;
            border-left: $border;
        }
    }
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

            .text-area {
                height: 350px;
                text-align: left;
                padding: 6px;
                display: flex;
                white-space: break-spaces;
            }
        }
    }

    &__title-box {
        display: flex;
        width: 100%;
        justify-content: center;
        font-size: 17px;
        font-weight: 600;
        background-color: #c1daf2;
        border-top: $border;
        border-left: $border;
        border-right: $border;
    }
    &__place {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        font-size: 15px;

        &__content-box:last-child {
            border-right: $border;
        }
        &__content-box {
            border-left: $border;
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
            .contents {
                display: flex;
                flex-wrap: nowrap;
                padding: 5px;
                align-items: center;
                justify-content: center;
                &__Map {
                    width: 100%;
                    height: 530px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        padding: 1px;
                        height: 100%;
                        width: 100%;
                        object-fit: contain;
                    }
                }
            }
        }

        .content-table {
            border-left: $border;
            width: 100%;
            .sub-title {
                display: flex;
                justify-content: center;
                align-items: center;
                border-top: $border;
                border-bottom: $border;
                border-right: $border;
                font-size: 16px;
                background-color: #c1daf2;
                font-weight: 600;
            }
            .contents {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
            }

            .table-menu {
                width: 100%;
                display: flex;
                &__item {
                    border-right: $border;
                    border-bottom: $border;
                }
                &__item:nth-child(1){
                    width: 24%;
                }
                &__item:nth-child(2){
                    width: 40%;
                }
                &__item:nth-child(3){
                    width: 18%;
                }
                &__item:nth-child(4){
                    width: 18%;
                }
            }
            .table-list {
                width: 50%;
                height: 35px;
                display: flex;
                font-size: 11px;
                line-height: 15px;
                &__item {
                    border-right: $border;
                    border-bottom: $border;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }

    &__footer {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 16px;

        &__logo-box {
            display: flex;
            justify-content: center;
            align-items: center;

            height: 10mm;
            .image {
                width: 8%;
            }
        }
    }
    .border-right-nth-odd:nth-child(odd) {
        border-right: 1px solid black;
        padding-right: 1px;
    }
    .middleline:first-child {
        width: calc(100% - 2px);
        padding-right: 1px;
    }
}

@media print {
    .page-break {
        page-break-after: always;
    }
}
</style>
