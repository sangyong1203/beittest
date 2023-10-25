<template>
    <button :data-theme="theme" class="icon-button" @click.prevent="handleClick">
        {{ label }}
        <img :src="`src/assets/icons/${icon}.svg`" alt="" class="icon-button__icon" />
    </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

interface Props {
    label?: string
    theme?: string
    icon: string
}
const props = defineProps<Props>()
const { label, theme, icon } = toRefs(props)

const emits = defineEmits(['send-event'])
const handleClick = () => {
    emits('send-event')
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.icon-button {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px;
    gap: 10px;

    outline: none;
    border: none;
    border-radius: 6px;

    cursor: pointer;

    background-color: $color-white-000;
    color: $color-blue-600;

    &[data-theme='normal'] {
        padding: 4px 16px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;
    }
    &[data-theme='fill'] {
        background-color: $color-blue-600;
        color: $color-white-000;
    }
    &:hover {
        cursor: pointer;
    }
    &__icon {
        width: 20px;
        height: 20px;
    }
}
</style>
