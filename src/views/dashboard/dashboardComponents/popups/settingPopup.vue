<template>
    
    <div v-if="isShowDialog"  class="setting-dialog" >
        <ul class="setting-list" :class="store.darkMode ? 'dark-mode' : ''">
            <li style="display: flex; align-items: center; gap:28px">
                <!-- 다크모드 설정 버튼 -->
                <!-- <span>Dark mode: </span>
                <span v-show="store.darkMode" class="dark-mode-btn on" @click="setDarkMode">
                    <img :src="darkmodeRoutine" alt="">
                    On
                </span>
                <span v-show="!store.darkMode" class="dark-mode-btn off"  @click="setDarkMode">
                    <img :src="darkmodeRoutine" alt="">
                    Off
                </span> -->

                <span>블록 순서 설정: </span>
            </li>
            <li v-for="(item, index) in blockItemIds" class="setting-list-item" >
                <span>{{ item.name }}</span>
                <div class="buttons">
                    <span class="upBtn" @click="goUp(index)">
                        <img :src="arrowUpBtn" alt="up button"/> 
                    </span>
                    <span class="downBtn" @click="goDown(index)">
                        <img :src="arrowUpBtn" alt="down button"/> 
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useStore } from "@stores/index"
import darkmodeRoutine from "@assets/icons/darkmode-routine.svg"
import arrowUpBtn from "@assets/images/arrowUpBtn.svg"

const store = useStore()

const blockItemIds:any = ref([])

const isShowDialog: any = ref(false)
function openDialog(data:any){
    isShowDialog.value = !isShowDialog.value
    blockItemIds.value = data
}
defineExpose({openDialog})

const emit = defineEmits(["changeBlockItems"])
function goUp(index:number){
    if(index > 0){
        let temp = blockItemIds.value[index]
        blockItemIds.value[index] = blockItemIds.value[index - 1]
        blockItemIds.value[index - 1] = temp
    }
    emit("changeBlockItems", blockItemIds.value)
}
function goDown(index:number){
    if(index < blockItemIds.value.length){
        let temp = blockItemIds.value[index]
        blockItemIds.value[index] = blockItemIds.value[index + 1]
        blockItemIds.value[index + 1] = temp
    }
    emit("changeBlockItems", blockItemIds.value)
}
function setDarkMode(){
    store.setPageFadeIn(false)
    setTimeout(()=>{
        store.setDarkMode()
        location.reload()
    }, 500)
}


</script>

<style lang="scss" scoped>
.setting-dialog{
    position: absolute; 
    right: 50px;  
    z-index: 10;
    .setting-list{
        list-style: none; 
        border: 1px solid #9d9d9c;
        padding: 15px;
        border-radius: 6px;
        background: white;
        margin: 0;
        .setting-list-item{
            padding: 10px 0; 
            width: 200px; 
            border-bottom: 1px solid #7a7a7a;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .buttons{
                padding:0 5px;
                cursor: pointer;
                
                .downBtn img{
                    transform: rotate(180deg) !important;
                }
            }
        }
    }
    .dark-mode-btn{
        padding: 3px 15px;
        // border: 1px solid rgb(163, 163, 163);
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        cursor: pointer;
        &.on{
            background-color: rgb(45, 45, 45);
            color: #d1d1d1;
        }

        img{
            width: 25px;
            height: 25px;
        }

    }
    .dark-mode{
        background: #2b3c4e;
    }
}
</style>
