<template>
    <RouterLink
        :to="data.path ? data.path : '/adminMain/dashboard'"
        class="navigation-menu"
        :menu-index="data.parentIdx"
        @click="active(data.index)"
    >
        <span class="navigation-menu__label">{{ data.label }}</span>
    </RouterLink>
</template>

<script setup lang="ts">
import { toRefs } from "vue"

interface Props {
    data: {
        parentIdx: number
        index: number
        label: string
        path?: string
        active: boolean
    }
}
const props = defineProps<Props>()
const { data } = toRefs(props)

const emit = defineEmits(["send-event"])
const active = (index: number) => {
    const data = {
        index: index,
        active: true,
    }
    emit("send-event", data)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$menuItemWidth : 128px;
.navigation-menu {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 128px;
    height: 100%;

    gap: 10px;

    text-decoration: none;
    cursor: pointer;

    &:first-child {
        &[menu-index="0"] {
            margin-left: 2*$menuItemWidth;
        }
        &[menu-index="1"] {
            margin-left: 2.5 * $menuItemWidth;
        }
        &[menu-index="2"] {
            margin-left: 4 * $menuItemWidth;
        }
        &[menu-index="3"] {
            margin-left:  3 * $menuItemWidth;
        }
        &[menu-index="4"] {
            margin-left: 5.5 * $menuItemWidth;
        }
        &[menu-index="5"] {
            margin-left:  7.3 * $menuItemWidth;
        }
        &[menu-index="6"] {
            margin-left: 7 * $menuItemWidth;
        }
        &[menu-index="7"] {
            margin-left: 8 * $menuItemWidth;
        }
        &[menu-index="8"] {
            margin-left: 10 * $menuItemWidth;
        }
    }

    &__label {
        color: $color-white-500;

        &:hover {
            color: $color-blue-600;
        }
    }
    &:hover {
        &__label {
            color: $color-blue-600;
        }
    }

    @include laptop() {
        width: 128px;

        &__label {
            font-size: 16px;
        }

        &:first-child {
            &[menu-index="0"] {
                margin-left: 1.5*$menuItemWidth;
            }
            &[menu-index="1"] {
                margin-left: 2 * $menuItemWidth;
            }
            &[menu-index="2"] {
                margin-left: 3 * $menuItemWidth;
            }
            &[menu-index="3"] {
                margin-left:  3 * $menuItemWidth;
            }
            &[menu-index="4"] {
                margin-left: 4 * $menuItemWidth;
            }
            &[menu-index="5"] {
                margin-left:  5.8 * $menuItemWidth;
            }
            &[menu-index="6"] {
                margin-left: 5.5 * $menuItemWidth;
            }
            &[menu-index="7"] {
                margin-left: 6 * $menuItemWidth;
            }
            &[menu-index="8"] {
                margin-left: 7.5 * $menuItemWidth;
            }
        }
    }
}
</style>
