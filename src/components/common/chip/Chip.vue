<template>
    <div class="chip" :class="theme">
        <span class="chip__label" >{{ label }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

interface Props {
    label: string
}
const { label } = defineProps<Props>()
console.log("props.label",label)

// For Chip Color Change
const theme = computed(()=>{
    let value = ""
     // 결재 구분 (위험성평가)
     if (label.includes("최초")) value = "blue"
    if (label.includes("수시")) value = "blue"
    if (label.includes("정기")) value = "blue"

    // 결재 상태 (작업허가서)
    if (label.includes("완료")) value = "blue"

    // 업체관리
    if (label.includes("협력사")) value = "blue"
    if (label.includes("시공사")) value = "green"
    if (label.includes("발주처")) value = "gray"
    return value
})

</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.chip {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 6px 10px;

    border-radius: 6px;

}
.blue {
    background-color: $color-blue-000;

    .chip__label {
        color: $color-blue-600;
    }
}
.green {
    background-color: #f3f9f0;

    .chip__label {
        color: #7ab974;
    }
}
.gray {
    background-color: $color-white-300;

    .chip__label {
        color: #585959;
    }
}
</style>
