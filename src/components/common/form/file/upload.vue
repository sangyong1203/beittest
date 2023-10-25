<template>
    <!-- 파일첨부 -->
    <div class="upload">
        <div class="upload__button-box">
            <span class="upload__button-box__label">파일첨부</span>
            <BasicButton v-if="disabled" :label="'첨부'" :theme="'cancel'" />
            <BasicButton v-else :label="'첨부'" :theme="'fill'" @click="openUpload" />
            <input type="file" multiple ref="fileInput" style="display: none" @change="addFile" />
        </div>
        <div v-if="label==='교육이력'" style="padding:0 12px; color: #de3e47;">
            ※ 기초안전보건교육이수증, 자격증 등의 파일을 추가해주세요.
        </div>
        
        <span v-if="message" class="upload__message">{{ message }}</span>
        <div class="upload__file-box">
            <div v-for="(item, index) in data" :key="index" class="upload__file-box__list">
                <span class="name" @click="onImageClick(item.file_url_full)">{{ item.file_name }}</span>
                <!-- disabled 속성 추후 추가 -->
                <button class="button" @click="deleteFile(item, index)">
                    <img src="@assets/icons/close.svg" alt="" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import {  toRefs, ref } from 'vue'

interface File {
    content_type: string
    file_name: string
    file_size: string
    file_type: string
    file_url: string
    file_url_full: string
    order_no: number
    seq_no: number
    user_id: number
    view_type: string

    [prop: string]: any
}
interface Props {
    label: string
    data: File[]
    disabled: boolean
    message?: string
}
const props = defineProps<Props>()
const { label, data, disabled, message } = toRefs(props)

// 첨부버튼 클릭, 파일 업로드 화면 열기
const fileInput: any = ref(null)
const openUpload = () => {
    fileInput.value?.click()
}

const emit = defineEmits(['send-eduFile', 'delete-eduFile', 'send-healthFile', 'delete-healthFile'])
const addFile = (event: any) => {
    const file = event.target.files
    let upload = Array.from(file)

    upload.forEach((item: any) => {
        item.file_name = item.name // 파일첨부할 때와 등록된 파일을 불러올 때, Property 이름이 다르기 때문에 통일해주기 위해 등록시 file_name을 생성

        if (label.value === '교육이력') {
            data.value.push(item)
            emit('send-eduFile', data.value)
        }
        if (label.value === '건강검진') {
            data.value.push(item)
            emit('send-healthFile', data.value)
        }
    })
}
const deleteFile = (file: any, index: number) => {
    if (label.value === '교육이력') {
        data.value.splice(index, 1)
        emit('delete-eduFile', file)
    }
    if (label.value === '건강검진') {
        data.value.splice(index, 1)
        emit('delete-healthFile', file)
    }
}

const onImageClick = (url: string) => {
    if (url != null && url != '') {
        window.open(url, '_blank')
    } else {
        return
    }
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 100%;

    margin-top: 24px;
    gap: 12px;

    &__button-box {
        display: flex;
        align-items: center;

        padding-left: 12px;
        gap: 24px;

        &__label {
            font-weight: 600;
            font-size: 19px;
            line-height: 23px;
        }
    }
    &__file-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        gap: 12px;

        &__list {
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 12px;
            gap: 12px;

            background-color: $color-white-050;
            border-radius: 6px;

            .name {
                &:hover {
                    text-decoration: underline;
                }
                cursor: pointer;
            }
            .button {
                outline: none;
                border: none;

                width: 20px;
                height: 20px;

                background: transparent;

                cursor: pointer;
            }
        }
    }
    &__message {
        color: $color-red-000;
        margin-left: 10px;
    }
}
</style>
