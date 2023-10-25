<template>
    <!-- Label & Button Component -->
    <div class="text-field">
        <div class="text-field__label" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            {{ label }}
        </div>
        <BasicButton v-if="disabled" :label="'비밀번호 변경'" :theme="'cancel'" />
        <BasicButton v-else :label="'비밀번호 변경'" :theme="'fill'" @click="changePassword" />
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import { toRefs } from 'vue'

interface Props {
    label: string
    labelWidth?: string // 라벨 값 default: 120px
    disabled: boolean
}
const props = defineProps<Props>()
const { label, labelWidth, disabled } = toRefs(props)

const emit = defineEmits(['send-event'])
const changePassword = () => {
    emit('send-event', true)
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.text-field {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    height: 48px;

    &__label {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
}
</style>
