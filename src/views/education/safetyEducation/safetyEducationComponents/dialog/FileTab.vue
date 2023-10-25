<template>
    <div class="tab-image">
        <div class="tab-image__header">
            <button class="tab-image__header__button" :class="{ active: isVisibleImage }" @click="showImage">교육사진</button>
            <button class="tab-image__header__button" :class="{ active: isVisibleTable }" @click="showTable">교육참석인원</button>
        </div>
        <div v-if="isVisibleImage" class="tab-image__body">
            <div v-if="!photos.length" class="tab-image__body__image-box">
                <form class="form" v-for="(item, index) in previewList" :key="index">
                    <img :src="item.file_url" alt="" class="form__image" />
                    <img v-if="!disabled" src="@assets/icons/close.svg" alt="" class="form__icon" @click.prevent="deleteImage(item, index)" />
                    <img v-else src="@assets/icons/close.svg" alt="" class="form__icon" />
                </form>
                <button v-if="!disabled && previewList.length < 4" class="button" @click.prevent="openUpload">
                    <img src="@assets/icons/add.svg" alt="" class="button__icon" />
                </button>
                <button v-else-if="previewList.length < 4"  class="button forbidden">
                    <img src="@assets/icons/add.svg" alt="" class="button__icon" />
                </button>
                <input type="file" multiple ref="fileInput" accept="image/*" style="display: none" @change="addFile" />
            </div>
            <div v-else class="tab-image__body__image-box">
                <form class="form" v-for="(item, index) in photos" :key="index">
                    <img :src="item.file_url" alt="" class="form__image" />
                    <img v-if="!disabled" src="@assets/icons/close.svg" alt="" class="form__icon" @click.prevent="deleteImage(item, index)" />
                    <img v-else src="@assets/icons/close.svg" alt="" class="form__icon" />
                </form>
                <button v-if="!disabled && photos.length < 4" class="button" @click.prevent="openUpload">
                    <img src="@assets/icons/add.svg" alt="" class="button__icon" />
                </button>
                <button v-else-if="photos.length < 4" class="button forbidden">
                    <img src="@assets/icons/add.svg" alt="" class="button__icon" />
                </button>
                <input type="file" multiple ref="fileInput" accept="image/*" style="display: none" @change="addFile" />
            </div>
        </div>
        <div v-if="isVisibleTable" class="tab-image__body" style="display: flex; flex-direction: column">
            <!-- 참석자 테이블 -->
            <div class="tab-image__body__table">
                <!-- 테이블 메뉴 -->
                <div class="header">
                    <div class="header__menu" :style="{ width: `${width}%` }">NO</div>
                    <div class="header__menu" :style="{ width: `${width}%` }">업체</div>
                    <div class="header__menu" :style="{ width: `${width}%` }">성명</div>
                    <div class="header__menu" :style="{ width: `${width}%` }">직책</div>
                </div>
                <!-- 테이블 리스트 -->
                <div class="body">
                    <div v-if="data.length === 0" class="body__noData">
                        <img src="@assets/images/logo.svg" alt="" class="body__noData__logo" />
                        <span class="body__noData__inform">회의 참석인원이 없습니다.</span>
                    </div>
                    <div v-else v-for="(item, index) in data" :key="index" class="body__list-box">
                        <div class="body__list-box__list" :style="{ width: `${width}%` }">
                            {{ index + 1 }}
                        </div>
                        <div class="body__list-box__list" :style="{ width: `${width}%` }">
                            {{ item.company_name }}
                        </div>
                        <div class="body__list-box__list" :style="{ width: `${width}%` }">
                            {{ item.user_name }}
                        </div>
                        <div class="body__list-box__list" :style="{ width: `${width}%` }">
                            {{ item.ctgo_occupation_name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onUnmounted } from "vue"
import { useBase64 } from "@vueuse/core"

interface Props {
    data: any[]
    photos: any[]
    disabled?: boolean
}
const props = defineProps<Props>()
const { data, photos, disabled } = toRefs(props)

const menuList = ref<string[]>(["NO", "업체", "성명", "직책", ""])

// Prop 받은 MenuList 길이에 따른 Dynamic Width
const width = computed((): string => {
    const res = String(100 / menuList.value.length + 1)
    return res
})

// 상단 버튼에 따른 UI 보여주기
const isVisibleImage = ref<boolean>(true)
const isVisibleTable = ref<boolean>(false)

onUnmounted(() => {
    previewList.value = []
    files.value = []
})

const showImage = () => {
    isVisibleImage.value = true
    isVisibleTable.value = false
}
const showTable = () => {
    isVisibleImage.value = false
    isVisibleTable.value = true
}

// 이미지 파일 데이터 - 부모 컴포넌트로 전달하기
const previewList = ref<any>([])
const files = ref<any>([])
const emit = defineEmits(["send-event", "delete-file", "open-select"])

// 회의사진 첨부, 파일 업로드 화면 열기
const fileInput: any = ref(null)
const openUpload = () => {
    fileInput.value?.click()
}
const addFile = (event: any) => {
    const file = event.target.files
    let upload = Array.from(file)

    upload.forEach((item: any, index: number) => {
        let { base64 } = useBase64(item)
        let urlItem = {
            name: item.name,
            file_url: base64,
        }
        if (photos.value.length === 0) {
            previewList.value.push(urlItem)
            files.value.push(item)
            emit("send-event", files.value)
        } else {
            photos.value.push(urlItem)
            files.value.push(item)
            emit("send-event", files.value)
        }
    })
}
const deleteImage = (file: any, index: number) => {
    if (photos.value.length === 0) {
        previewList.value.splice(index, 1)
        files.value.forEach((item: any, itemIndex: number) => {
            if (item.name === file.name) {
                files.value.splice(itemIndex, 1)
            }
        })
    } else {
        photos.value.splice(index, 1)
        files.value.forEach((item: any, itemIndex: number) => {
            if (item.name === file.name) {
                files.value.splice(itemIndex, 1)
            }
        })
    }
    fileInput.value.value = ""
    emit("delete-file", file)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.tab-image {
    display: flex;
    flex-direction: column;

    width: 100%;

    gap: 28px;

    &__header {
        display: flex;
        align-items: center;

        width: 100%;
        height: 55px;

        border-bottom: 1px solid $color-white-200;

        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 16px 38px;

            font-weight: 600;
            font-size: 19px;
            line-height: 23px;
            color: $color-white-500;

            outline: none;
            border: none;
            background: transparent;

            cursor: pointer;

            &.active {
                padding: 16px 38px 18px 38px;

                font-weight: 600;
                font-size: 19px;
                line-height: 23px;
                color: $color-blue-850;

                border-bottom: 1.5px solid $color-blue-850;
            }
        }
    }
    &__body {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        width: 100%;

        gap: 32px;

        &__image-box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            width: 100%;

            gap: 28px;

            overflow-x: scroll;

            // /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            // /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }

            .form {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                width: 270px;
                height: 212px;

                background-color: $color-white-050; // 이미지 첨부 기능 완료되면 추후 삭제
                border-radius: 6px;

                position: relative;

                &__image {
                    width: 100%;
                    min-width: 270px;
                    height: 100%;

                    border-radius: 6px;
                    object-fit: cover;
                }
                &__icon {
                    position: absolute;

                    top: 14px;
                    right: 12px;

                    width: 20px;
                    height: 20px;

                    cursor: pointer;
                }
            }
            .button {
                width: 270px;
                min-width: 270px;
                height: 212px;

                border: 2px dashed $color-white-200;
                border-radius: 6px;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                &__icon {
                    width: 32px;
                    height: 32px;
                }
                &.forbidden{
                    cursor: not-allowed
                }
            }
        }
        &__table {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;

            width: 100%;

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                width: 100%;
                height: 48px;

                background-color: $color-white-100;
                border-top: 1px solid $color-white-200;
                border-bottom: 1px solid $color-white-200;

                &__menu {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            .body {
                width: 100%;
                height: 140px;

                overflow-y: scroll;
                border-bottom: 1px solid $color-white-200;

                // /* Hide scrollbar for IE, Edge and Firefox */
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */

                // /* Hide scrollbar for Chrome, Safari and Opera */
                &::-webkit-scrollbar {
                    display: none;
                }

                @include laptop() {
                    height: 242px;
                }
                @include desktop() {
                    height: 100%;
                    height: 400px;
                }

                &__list-box {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    width: 100%;
                    height: 48px;

                    border-bottom: 1px solid $color-white-200;

                    &__list {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        cursor: pointer;
                    }
                }
                &__noData {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    width: 100%;
                    height: 100%;

                    &__logo {
                        width: 25%;
                        opacity: 0.6;
                    }
                    &__inform {
                        font-size: 20px;
                        font-weight: 700;
                        color: $color-white-400;
                    }
                }
            }
        }
    }
}
</style>
