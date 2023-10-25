<template>
    <div class="search-bar" :class="{ active: validation }">
        <input v-model="searchText" type="text" :placeholder="placeHolder" maxlength="15" class="search-bar__input" :class="{ active: validation }" @keydown.enter="search" />
        <button class="search-bar__button" @click.prevent="search">
            <img src="@assets/icons/search.svg" alt="" class="search-bar__button__icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 부모컴포넌트로 searchText 값 - 이벤트 전달
const searchText = ref<string>('')
const placeHolder = ref<string>('검색어를 입력하세요.')

const emit = defineEmits(['send-event'])
emit('send-event', searchText.value)

// 글자 길이 Validation
const validation = ref<boolean>(false)
const search = (): void => {
    if (searchText.value.length === 0) {
        validation.value = false
        placeHolder.value = '검색어를 입력하세요.'

        emit('send-event', '')
    } else if (searchText.value.length < 2) {
        searchText.value = ''
        validation.value = true
        placeHolder.value = '검색어를 두 글자 이상 입력하세요.'
    } else {
        validation.value = false
        placeHolder.value = '검색어를 입력하세요.'

        emit('send-event', searchText.value)
    }
}

const init = () => {
    searchText.value = ''
}

defineExpose({ searchText, init })
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px;

    background-color: $color-white-000;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    &.active {
        border: 1px solid $color-red-000;
    }

    &__input {
        padding: 10px;

        flex-grow: 1;

        outline: none;
        border: none;

        &.active {
            &::placeholder {
                color: rgba($color-red-000, 0.9);
            }
        }
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
