<template>
    <button class="button">按钮组件示例</button>
</template>

<script>
export default {
    name: "me-button",
}
</script>

<style scoped lang="less">
.button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background: #3eaf7c;
    color: #fff;
    outline: none;

    &:hover {
        background: #4cc38d;
    }

    &:active {
        background: #3eaf7c;
    }
}
</style>