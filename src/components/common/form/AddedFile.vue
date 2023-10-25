<template>
    <!-- 도면정보 : inputs -->
    <div class="added-file" @click="onImageClick(file.url)">
        <span class="added-file__name">{{ `${file.name}` }} - {{ `${file.size}` }}byte</span>
        <IconButton :icon="'close'" class="added-file__button" @click="onDeleteFile" @click.stop />
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

import IconButton from '@components/common/button/IconButton.vue'

interface Props {
    file: any
    index: number
    disabled?: boolean
}
const props = defineProps<Props>()
const { file, index, disabled } = toRefs(props)

const emits = defineEmits(['deleteFile'])
const onDeleteFile = () => {
    const data = {
        index: index.value,
        seq_no: file.value.seq_no,
    }
    if (disabled?.value == false) {
        emits('deleteFile', data)
    }
}

const onImageClick = (url: string) => {
    if (url != null && url != '') {
        window.open(url, '_blank')
    } else {
        return
    }
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.added-file {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1%;
    background-color: #f6f7f9;
    border-radius: 6px;
    color: #2f2f35;
    text-decoration: underline;
    border: 1px dotted #777777;
    position: relative;
    min-width: 80px;
    cursor: pointer;

    &__button {
        width: 32px;
        height: 32px;
        margin-left: 4px;
        background-color: #f6f7f9;
        cursor: pointer;
        position: absolute;
        top: 1%;
        right: 1%;
    }
}
</style>
