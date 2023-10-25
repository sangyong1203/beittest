<template>
    <button :data-theme="theme" class="basic-button">
        {{ label }}
    </button>
</template>

<script setup lang="ts">
interface Props {
    label: string
    theme?: string
}
const { label, theme } = defineProps<Props>()
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.basic-button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 10px 12px;

    outline: none;
    border: none;
    border-radius: 6px;

    cursor: pointer;

    background-color: $color-white-700;
    color: $color-white-000;

    &[data-theme="normal"] {
        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;
        color: $color-white-900;
    }
    &[data-theme="outer"] {
        padding: 8px 11px;

        border: 2px solid $color-blue-600;
        background-color: $color-white-000;
        color: $color-blue-600;
    }
    &[data-theme="fill"] {
        background-color: $color-blue-600;
        color: $color-white-000;
    }
    &[data-theme="cancel"] {
        background-color: $color-white-700;
        color: $color-white-000;
    }
    &[data-theme="delete"] {
        background-color: $color-white-050;
        color: $color-white-900;
    }
    &[data-theme="reject"] {
        padding: 8px 11px;

        border: 2px solid $color-red-000;
        background-color: $color-white-000;
        color: $color-red-000;
    }
    &:hover {
        cursor: pointer;
    }
}
</style>
