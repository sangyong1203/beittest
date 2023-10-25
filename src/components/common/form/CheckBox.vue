<template>
    <div class="check-box">
        <input v-model="data.state" type="checkbox" class="check-box__input" :disabled="disabled" @input="updateValue" />
        <span class="check-box__label">{{ data.ctgo_equip_name }}</span>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"

interface Equip {
    ctgo_dp_work_id: number
    ctgo_equip_id: number
    ctgo_equip_name: string
    scene_id: number
    state?: boolean
}
interface Props {
    data: Equip
    disabled?: boolean
}
const props = defineProps<Props>()
const { data, disabled } = toRefs(props)

const emit = defineEmits(["send-event", "send-edit"])
const updateValue = () => {
    emit("send-event")
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.check-box {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 12px;

    &__input {
        width: 16px;
        height: 16px;

        cursor: pointer;
    }
    &__label {
        font-weight: 500;
        font-size: 17px;
        line-height: 20px;

        color: $color-white-900;
    }
}
</style>
