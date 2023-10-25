<template>
    <div class="auto-field">
        <div class="auto-field__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="auto-field__label-box__label">{{ label }}</span>
            <span class="auto-field__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <input
            :value="modelValue"
            @input="updateValue"
            @keydown="pressKey"
            @focus="onFocus"
            type="text"
            :disabled="disabled"
            :placeholder="checkPlaceholder(label)"
            class="auto-field__input"
            :class="{ disabled: disabled, validation: validation }"
            :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
        />
        <span v-if="validation" class="auto-field__validation">{{ checkValidation(label) }}</span>
        <div ref="searchBoxRef" class="auto-field__search-box" :class="{ active: SEARCHBOXVISIBLE }">
            <span 
            v-for="(item, index) in SHOWLIST" :key="index" 
            class="auto-field__search-box__list" 
            :class="{ active: item.isFocused }"
             @click="selectItem(item)">
                <img src="@assets/icons/search.svg" alt="" class="icon" />
                <span class="text">{{ item.name }}</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue'
import { useStore } from '@stores/index'
import { getRegExp } from 'korean-regexp'

interface Props {
    label: string // 라벨

    required?: boolean // 필수값 마크
    disabled?: boolean // Readonly 체크
    validation?: boolean // Validation 체크

    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인풋 값 default: 230px

    modelValue: any
}

const props = defineProps<Props>()
const { label, required, disabled, validation, labelWidth, modelValue } = toRefs(props)

// Store 접근
const store = useStore()

// v-model 양방향 데이터 바인딩
const emit = defineEmits(['update:modelValue', 'remove', 'send-event'])
const inputValue = ref<string>('') // input value

const updateValue = (event: any) => {
    emit('update:modelValue', event.target.value)
    inputValue.value = event.target.value
    autoComplete(inputValue.value)
}
const updateValidation = (label: string) => {
    if (inputValue.value) {
        emit('remove', label, false)
    } else {
        emit('remove', label, true)
    }
}

// PlaceHolder 체크 함수
const checkPlaceholder = (data: string) => {
    // data의 마지막 음절의 유니코드 (UTF-16)
    const charCode = data.charCodeAt(data.length - 1)
    // 유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28

    if (consonantCode === 0) {
        return `${data}를 입력하세요.`
    } else {
        return `${data}을 입력하세요.`
    }
}

// 한글 Validation Check 함수
const checkValidation = (data: string) => {
    // data의 마지막 음절의 유니코드 (UTF-16)
    const charCode = data.charCodeAt(data.length - 1)
    // 유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28

    if (consonantCode === 0) {
        return `${data}는 필수 값입니다.`
    } else {
        return `${data}은 필수 값입니다.`
    }
}

// ----------------------------------------------------------------------------------------------------
// 자동완성 기능 함수
const SEARCHBOXVISIBLE = ref<boolean>(false)
const searchBoxRef = ref<HTMLElement | null>(null)
const SHOWLIST = ref<any>([])
const CTGOLIST: any =  ref<any>([]) // 중장비 리스트

onMounted(() => {
    if (label.value === '업체') CTGOLIST.value = store.companyList // 업체 리스트
    if (label.value === '직종') CTGOLIST.value = store.occupationList // 직종 리스트
    if (label.value === '직책') CTGOLIST.value = store.dutyList // 직책 리스트
    if (label.value === '중장비') CTGOLIST.value =  store.equipList // 중장비 리스트
})

const onFocus =() => {
    SEARCHBOXVISIBLE.value = true
    SHOWLIST.value = CTGOLIST.value
}
const autoComplete = (search: string) => {
    let value = search.trim()
    let regex = getRegExp(value)
    let DB = CTGOLIST.value
    let dataList = DB.map((item: any) => {
        const data = {
            id: item.id,
            name: item.name,
            other_id: item.ctgo_construction_id ? item.ctgo_construction_id : 0,
            other_name: item.ctgo_construction_name ? item.ctgo_construction_name : '',
        }
        return data
    })
    console.log("autoComplete", DB)

    let matchData = dataList.filter((item: any) => {
        let result = item.name.match(regex)
        if (result) return item
    })
    SHOWLIST.value = [...matchData]
    // INPUT 창에서 방향키 이벤트로 인한 기능 구현을 위해 isFocused 변수 추가
    SHOWLIST.value.forEach((item: any) => {
        item.isFocused = false
    })
    
}
const selectItem = (value: any) => {
    console.log("update:modelValue", value.name)
    emit('send-event', value)
    emit('update:modelValue', value.name)
    inputValue.value = value.name
    SEARCHBOXVISIBLE.value = false
    SHOWLIST.value = []
}

// 방향키 이벤트
let INDEX = -1
const pressKey = (event: any) => {
    function init() {
        SHOWLIST.value.forEach((item: any) => {
            item.isFocused = false
        })
    }

    if (event.keyCode === 40) {
        // 방향키 아래
        if (INDEX < SHOWLIST.value.length - 1) {
            INDEX++
            if (INDEX === 0) {
                init()
            }
            SHOWLIST.value.forEach((item: any, index: number) => {
                item.isFocused = index === INDEX
            })
            const data = SHOWLIST.value[INDEX]
            emit('send-event', data)
            emit('update:modelValue', data.name)
        }
    } else if (event.keyCode === 38) {
        // 방향키 위
        if (INDEX > 0) {
            INDEX--
            SHOWLIST.value.forEach((item: any, index: number) => {
                item.isFocused = index === INDEX
            })
            const data = SHOWLIST.value[INDEX]
            emit('send-event', data)
            emit('update:modelValue', data.name)
        }
    } else if (event.keyCode === 13) {
        // 엔터
        if (INDEX >= 0 && INDEX < SHOWLIST.value.length) {
            const data = SHOWLIST.value[INDEX]
            emit('send-event', data)
            emit('update:modelValue', data.name)
            inputValue.value = data.name
            SEARCHBOXVISIBLE.value = false
        }
    }
    if (searchBoxRef.value != null) {
        if (INDEX > 4) {
            searchBoxRef.value.scrollTop = INDEX * 44 // 원하는 값으로 스크롤을 내립니다.
        } else if (INDEX <= 0) {
            searchBoxRef.value.scrollTop = 0 // 원하는 값으로 스크롤을 내립니다.
        }
    }
}

// input value가 변하면 validation check 해제
watch(inputValue, () => {
    updateValidation(label.value)
})


</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.auto-field {
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 48px;

    &__label-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &__required-mark {
            display: none;

            &.active {
                display: block;

                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
    }
    &__input {
        flex-grow: 1;

        padding: 14px 12px;

        border: 1px solid $color-white-400;
        border-radius: 6px;

        &.disabled {
            color: $color-white-500;
        }
        &.validation {
            border: 1px solid $color-red-000;

            &::placeholder {
                color: rgba($color-red-000, 0.9);
            }
        }
    }
    &__validation {
        position: absolute;
        top: 53px;
        left: 132px;

        color: $color-red-000;
        font-size: 12px;
    }
    &__search-box {
        display: none;

        &.active {
            position: absolute;

            top: 110%;
            right: 0;

            display: flex;
            flex-direction: column;

            width: calc(100% - 122px);
            height: 214px;

            border: 1px solid $color-white-400;
            border-radius: 6px;
            background-color: $color-white-000;

            z-index: 1;

            overflow-y: scroll;
        }

        &__list {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            width: calc(100% - 24px);

            padding: 12px;

            .icon {
                width: 20px;
                height: 20px;
            }
            .text {
                margin-left: 8px;
            }
            &:hover {
                background-color: $color-white-100;
                border-radius: 6px;

                cursor: pointer;
            }
            &.active {
                background-color: $color-white-100;
                border-radius: 6px;
            }
        }
    }

    input::placeholder {
        color: $color-white-450;
    }
    input:focus {
        outline: none;
    }
}
</style>
