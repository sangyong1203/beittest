<template>
    <div class="dropdown-container">
        <!-- NEW -->
        <div class="dropdown-container__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="dropdown-container__label-box__label" v-html="label"></span>
            <span class="dropdown-container__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <form class="dropdown-container__dropdown" :class="{ disabled: disabled }" @click.prevent="openDropdown">
            <input
                :value="setModelValue"
                @input="updateValue"
                type="text"
                :placeholder="placeholder"
                :disabled="true"
                class="dropdown-container__dropdown__input"
                :class="{ disabled: disabled }"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
            />
            <IconButton :icon="'arrowDown'" class="dropdown-container__dropdown__button" />
            <!-- Dropdown -->
            <div class="dropdown-container__dropdown__drawer" :class="{ active: isActive }">
                <div v-if="data.length !== 0" v-for="(item, index) in data" :key="item" class="list" @click.prevent="closeDropdown">
                    <div class="list__name" @click.prevent="select(item)">
                        {{ item.name }}
                    </div>
                    <div class="list__dividing-line" :class="{ inActive: index === data.length - 1 ? true : false }" />
                </div>
                <div v-else class="list">
                    <div class="list__name">등록된 항목이 없습니다.</div>
                </div>
            </div>
        </form>
        <span v-if="validation" class="dropdown-container__validation">{{ checkName(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from "vue"
import IconButton from "@components/common/button/IconButton.vue"

interface Props {
    label: string
    required?: boolean
    data: any[] // 추후 타입변경 요망
    setInfo: string
    validation?: boolean
    placeholder?: string
    disabled?: boolean
    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 드롭다운 값 default: 274px
    modelValue: string
}
const props = defineProps<Props>()
let { label, required, data, setInfo, validation, disabled, modelValue } = toRefs(props)

watch(setInfo, () => {})

let setModelValue = computed(() => {
    if (setInfo.value != null && setInfo.value != "") {
        return setInfo.value.length > 0 ? setInfo.value : modelValue
    } else {
        return "선택"
    }
})

// Dropdown 열고 닫는 기능
const isActive = ref<boolean>(false)
const openDropdown = (): void => {
    isActive.value = !isActive.value
}
const closeDropdown = (): void => {
    isActive.value = !isActive.value
}
// Dropdown Value 전달
const selected = ref<string>("")
const emit = defineEmits(["send-event", "send-data", "update:modelValue", "remove"])
const select = (item: any) => {
    modelValue = item.name
    emit("send-data", item)
    closeDropdown()
}
const updateValue = (event: any) => {
    emit("update:modelValue", event.target.value)
    modelValue.value = event.target.value
}
const updateValidation = (label: string) => {
    if (selected.value) {
        emit("remove", label, false)
    } else {
        emit("remove", label, true)
    }
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
// input value가 변하면 validation check 해제
watch(selected, () => {
    updateValidation(label.value)
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
            background-color: $color-white-100;
        }
        &__input {
            padding: 14px 12px;

            outline: none;
            border: none;
            border-radius: 6px;
            background-color: $color-white-000;

            cursor: pointer;

            &.disabled {
                color: $color-white-500;
                background-color: $color-white-100;
            }

            &::placeholder {
                color: #2f2f35;
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

                border: 1px solid #dadada;
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
                        background-color: #f5f8fc;
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
</style>
