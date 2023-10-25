<template>
    <div class="approval-input">
        <FormLabelTextField v-model="approvalName" :label="inputLabel" class="approval-input__input" />
        <BasicButton :label="buttonLabel" :theme="'normal'" class="approval-input__button" @click.prevent="onSubmit" />
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import FormLabelTextField from '@components/common/form/LabelTextField.vue'

import { ref, toRefs } from 'vue'

interface Props {
    inputLabel: string
    buttonLabel: string
}
const props = defineProps<Props>()
const { inputLabel, buttonLabel } = toRefs(props)

// 결재선 등록
const approvalName = ref<string>('') // 등록할 결재선 이름

const emit = defineEmits(['send-event'])

const onSubmit = () => {
    emit('send-event', approvalName.value)
}

const initApprovalName = () => {
    approvalName.value = ''
}

defineExpose({ initApprovalName })
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.approval-input {
    display: flex;
    align-items: center;

    padding: 6px 6px 6px 10px;

    background: $color-white-050;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    &__input {
        flex-grow: 1;
    }
    &__button {
        padding: 14px 20px;
        margin-left: 6px;
    }
}
</style>
