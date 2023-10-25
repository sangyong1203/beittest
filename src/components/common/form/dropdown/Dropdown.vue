<template>
    <div ref="dropdownRef" class="dropdown-container">
        <!-- LABEL -->
        <div
            class="dropdown-container__label-box"
            :style="{ width: labelWidth ? `${labelWidth}` : `120px` }"
        >
            <span
                class="dropdown-container__label-box__label"
            >{{ label }}</span>
            <span
                class="dropdown-container__label-box__required-mark"
                :class="{ active: required }"
                >*</span
            >
        </div>
        <!-- DROPDOWN FORM -->
        <form
            class="dropdown-container__dropdown"
            @click="openDropdown"
            :class="{ disabled: disabled, validation: validation }"
        >
            <input
                :value="inputValue"
                type="text"
                :placeholder="placeholder"
                :disabled="disabled"
                class="dropdown-container__dropdown__input"
                :class="{ disabled: disabled, validation: validation }"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
                readonly
            />
            <IconButton
                :icon="'arrowDown'"
                class="dropdown-container__dropdown__button"
                :class="{ disabled: disabled }"
            />
            <!-- DROPDOWN -->
            <div
                v-if="!disabled"
                class="dropdown-container__dropdown__drawer"
                :class="{ active: isActive }"
                @click="closeDropdown"
            >
                <div v-if="hasTotal == true" class="list" @click="select(init)">
                    <div class="list__name">전체</div>
                    <div dclass="list__dividing-line"></div>
                </div>
                <div v-for="(item, index) in data" :key="item" class="list">
                    <div class="list__name" @click="select(item)">
                        {{ item.name }}
                    </div>
                    <div
                        class="list__dividing-line"
                        :class="{
                            inActive: index === data.length - 1 ? true : false,
                        }"
                    />
                </div>
            </div>
        </form>
        <span v-if="validation" class="dropdown-container__validation">{{
            checkName(label)
        }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from "vue"
import IconButton from "@components/common/button/IconButton.vue"

interface Props {
    label: string
    required?: boolean
    data: any[] // 추후 타입변경 요망
    setInfo?: {
        id: number
        name: string
    }
    validation?: boolean
    placeholder?: string
    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 드롭다운 값 default: 274px
    disabled?: boolean
    hasTotal?: boolean

    modelValue: any // id 를 받습니다
}
const props = defineProps<Props>()
const {
    label,
    required,
    data,
    setInfo,
    validation,
    placeholder,
    labelWidth,
    inputWidth,
    disabled,
    hasTotal,
    modelValue,
} = toRefs(props)

const inputValue = computed(()=>{
    let res = ""
    data.value.forEach( (item:any)=>{
        if(item.id === modelValue.value){
            res = item.name
        }
    })
    return res
})

// Dropdown 열고 닫는 기능
const isActive = ref<boolean>(false)
let element: any = null
const openDropdown = (event:any): void => {
    element = event.target.offsetParent?.offsetParent?.offsetParent
    if (element) {
        element.addEventListener("click",handleDropdownClick)
    }
}
const handleDropdownClick = (event: any) => {
    let targetName = event.target?.className
    let parentName = event.target?.offsetParent?.className
    if (!isActive.value) {
        if (
            (parentName && targetName.includes("dropdown-container")) ||
            (parentName && parentName.includes("dropdown-container"))
        ) {
            isActive.value = true
        }
    } else {
        if (targetName.includes("list__name")) return
        closeDropdown()
    }
}
const closeDropdown = () => {
    isActive.value = false
    element.removeEventListener("click", handleDropdownClick)
}

// Dropdown Value 전달
const emit = defineEmits([
    "send-event",
    "send-data",
    "update:modelValue",
    "remove",
])

const init = {
    name: "전체",
    id: 0,
}
const select = (item: any) => {
    emit("send-data", item)
    emit("update:modelValue", item.id)
    // inputValue.value = item.name
    closeDropdown()
}


// 한글 Validation Check 함수
const checkName = (data: string | undefined) => {
    if (data !== undefined) {
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
}

// Input Value 값이 변하면 validation check 해제
watch(modelValue, () => {
    emit("remove", label.value, false)
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.dropdown-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    position: relative;

    &__label-box {
        display: flex;
        align-items: center;

        &.inActive {
            display: none;
        }

        &__required-mark {
            display: none;

            &.active {
                display: block;
                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
    }
    &__dropdown {
        position: relative;

        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;

        height: 48px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        cursor: pointer;

        &.disabled {
            background-color: $color-white-150;
        }
        &.validation {
            border: 1px solid $color-red-000;
        }
        &__input {
            padding: 12px;

            outline: none;
            border: none;
            border-radius: 6px;
            background-color: $color-white-000;

            cursor: pointer;

            &::placeholder {
                color: #2f2f35;
            }
            &.disabled {
                color: $color-white-500;
                background-color: $color-white-150;
            }
            &.validation {
                &::placeholder {
                    color: rgba($color-red-000, 0.9);
                }
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 40px;
            height: 40px;

            margin-right: 4px;

            border-radius: 3px;
            background-color: $color-white-050;
        }
        &__drawer {
            position: absolute;

            left: -1px;
            top: 52px;

            display: none;

            &.active {
                display: block;

                width: 100%;
                max-height: 180px;
                background-color: $color-white-000;

                border: 1px solid $color-white-400;
                border-radius: 6px;
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);

                overflow-y: scroll;
                z-index: 2;
            }
            .list {
                display: flex;
                flex-direction: column;

                &__name {
                    padding: 12px 16px;

                    &:hover {
                        cursor: pointer;
                        background-color: $color-blue-000;
                    }
                }
                &__dividing-line {
                    width: 95%;
                    height: 1px;
                    background-color: $color-white-200;
                    align-self: center;

                    &.inActive {
                        display: none;
                    }
                }
            }
        }
    }
    &__validation {
        position: absolute;
        top: 54px;
        left: 132px;

        color: $color-red-000;
        font-size: 12px;
    }
}
.dropdown-container__dropdown__drawer::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
}
.dropdown-container__dropdown__drawer::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: transparent;
}
.dropdown-container__dropdown__drawer:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.262);
}
</style>
