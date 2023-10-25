<template>
    <div class="check-userCard" :class="{ active: data.isChecked }" @click="collect(data)">
        <div class="check-userCard__check-box">
            <input v-model="data.isChecked" type="checkbox" class="check-userCard__check-box__input" />
        </div>
        <div class="check-userCard__content-box">
            <div class="check-userCard__content-box__image-box">
                <img :src="data.full_url" @error="setErrorImage" alt="" class="image" />
            </div>
            <div class="check-userCard__content-box__info-box">
                <span class="item">{{ data.company_name }}</span>
                <span class="item">{{ data.ctgo_construction_name }}</span>
                <span class="item">{{ data.user_name }} / {{ data.ctgo_occupation_name }}</span>
                <span class="item" style="margin-top: 16px">{{ data.user_phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref, computed } from 'vue'

interface UserData {
    company_name: string
    ctgo_construction_name: string
    ctgo_occupation_name: string
    full_url: string
    user_id: number
    user_name: string
    user_phone: string
    isChecked?: boolean

    [prop: string]: any
}
interface Props {
    data: UserData
}
const props = defineProps<Props>()
const { data } = toRefs(props)

const setErrorImage = (event: any) => {
    event.target.src = 'assets/images/logo.svg'
}

// isChecked 값이 true 인 값만 부모컴포넌트로 전달
const emit = defineEmits(['send-event'])
const collect = (data: any) => {
    emit('send-event', data)
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.check-userCard {
    display: flex;
    align-items: center;

    // width: calc(100% - 40px);
    max-height: 140px;
    max-width: 335px;
    padding: 16px;
    gap: 16px;

    background: $color-white-000;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    cursor: pointer;

    &.active {
        border: 1px solid $color-blue-900;
    }

    &__check-box {
        min-width: 28px;
        width: 28px;
        height: 28px;

        &__input {
            width: 20px;
            height: 20px;

            cursor: pointer;
        }
    }
    &__content-box {
        display: flex;
        align-items: center;

        gap: 16px;

        &__image-box {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 141px;
            min-width: 141px;
            height: 141px;

            background-color: $color-white-050;
            border-radius: 8px;

            .no-data {
                object-fit: contain;
                border-radius: 8px;
            }
            .image {
                object-fit: contain;

                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }
        &__info-box {
            display: flex;
            flex-direction: column;

            gap: 8px;

            .item {
                font-weight: 500;
                font-size: 17px;
                line-height: 20px;
            }
        }
    }
}
</style>
