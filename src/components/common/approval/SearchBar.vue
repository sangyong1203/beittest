<template>
    <div class="search-bar">
        <input v-model="searchText" @input="updateText" type="text" placeholder="검색어를 입력해주세요." class="search-bar__input" @keydown.enter="search" />
        <button class="search-bar__button" @click.prevent="search">
            <img src="@assets/icons/search.svg" alt="" class="search-bar__button__icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

interface Props {
    data: string
}

const props = defineProps<Props>()
const { data } = toRefs(props)

// 부모컴포넌트로 searchText 값 - 이벤트 전달
const searchText = ref<string>('')

const emit = defineEmits(['change', 'send-event'])
const updateText = (event: any) => {
    emit('change', event.target.value)
    searchText.value = event.target.value
}

const search = (): void => {
    emit('send-event', searchText.value)
}
// 초기 onMouted 에 호출하는 역할과 동일
// emit('send-event', searchText.value)

watch(data, (vo) => {
    searchText.value = data.value
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 36px;

    padding: 6px;

    background-color: $color-white-000;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    &__input {
        padding: 10px;
        margin: 0;

        flex-grow: 1;

        outline: none;
        border: none;
    }
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 40px;
        height: 40px;

        background-color: $color-white-100;
        border-radius: 3px;

        outline: none;
        border: none;
        cursor: pointer;

        &__icon {
            width: 24px;
            height: 24px;
        }
    }
}
</style>
