<template>
    <div class="ant-row ant-row-center ant-row-middle bar-wrapper" :style="circleStyle">
        <div v-for="n in 10" :key="n" class="bar"></div>
    </div>
</template>

<script>
// Không sử dụng export default, sử dụng named export
export const Spin = {
    name: 'Spin', // Đặt tên cho component
    data() {
        return {
            // Style vòng tròn
            circleStyle: {
                width: '300px',
                height: '300px',
                backgroundColor: 'skyblue',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            },
        };
    },
};
</script>

<style scoped>
.bar-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    position: relative;
    justify-content: center;
    align-items: center;
}

.bar {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    animation: rotate 2s linear infinite;
}

.bar:nth-child(1) {
    transform: rotate(0deg) translateX(130px);
}

.bar:nth-child(2) {
    transform: rotate(36deg) translateX(130px);
}

.bar:nth-child(3) {
    transform: rotate(72deg) translateX(130px);
}

.bar:nth-child(4) {
    transform: rotate(108deg) translateX(130px);
}

.bar:nth-child(5) {
    transform: rotate(144deg) translateX(130px);
}

.bar:nth-child(6) {
    transform: rotate(180deg) translateX(130px);
}

.bar:nth-child(7) {
    transform: rotate(216deg) translateX(130px);
}

.bar:nth-child(8) {
    transform: rotate(252deg) translateX(130px);
}

.bar:nth-child(9) {
    transform: rotate(288deg) translateX(130px);
}

.bar:nth-child(10) {
    transform: rotate(324deg) translateX(130px);
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) translateX(130px);
    }

    100% {
        transform: rotate(360deg) translateX(130px);
    }
}
</style>
<!-- <template>
    <div class="loading">
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
        <div class="obj"></div>
    </div>
</template>

<script>
export const Spin = {
    name: 'Spin',
};
</script>

<style scoped lang="css">
@import './spin.css'; 
 </style> -->
