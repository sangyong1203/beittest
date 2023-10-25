<template>
    <div class="navigation-menu" :class="{ active: data.active }">
        <span class="navigation-menu__label" :class="{ active: data.active }">{{ data.label }}</span>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"

interface Props {
    data: {
        index: number
        label: string
        active: boolean
    }
}
const props = defineProps<Props>()
const { data } = toRefs(props)
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.navigation-menu {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 128px;
    height: 100%;

    gap: 10px;

    text-decoration: none;
    cursor: pointer;

    
    &__label {
        color: $color-white-500;

        &.active {
            color: $color-blue-600;
        }
    }

    @include laptop() {
        width: 96px;
    }
}
.navigation-menu:hover {
        border-bottom: 2px solid $color-blue-600;
    }
</style>
