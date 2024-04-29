<template>
    <div class="allEcharts">

        <div v-if="EchartData === null" style="height: 550px;">
            <a-empty
                style="display: flex; align-items: center; height: 100%;justify-content: center;flex-direction: column;"
                description="暂无访问记录" />
        </div>
        <!-- 线形图 -->
        <div v-else>
            <div style="width: 100%;" class="line">
                <div class="accessname">访问曲线</div>
                <div class="access" style="width:100%; display: flex;">
                    <ul class="data" style="flex: 0 1 30%;">
                        <li> <span style="color:#3464e0;font-weight: 700;">访问次数</span> <span>{{ EchartData?.pv }}</span>
                        </li>
                        <li><span style="color:#3464e0;font-weight: 700;">访问人数</span><span>{{ EchartData?.uv }}</span>
                        </li>
                        <li><span style="color:#3464e0;font-weight: 700;">访问IP</span><span>{{ EchartData?.uip }}</span>
                        </li>
                    </ul>
                    <div ref="main" style="height:360px; flex: 0 1 70%; width: 100%;" class="main"></div>
                </div>
            </div>
            <!-- 地图 -->
            <div style="width: 100%;" class="map">
                <div class="accessname">访问曲线</div>
                <div class="access" style="width:100%; display: flex;">
                    <ul class="data" style="flex: 0 1 30%;">
                        <div class="provice">top10省份</div>
                        <li v-for="(item, index) in EchartData?.localeCnStats" :key="index">
                            <span class="area">{{ index + 1 }}.{{ item.locale }}</span>
                            <span>{{ item.ratio * 100 }}%</span>
                            <span>{{ item.cnt }}次</span>
                        </li>
                    </ul>
                    <div ref="mainmap" style="height:360px; flex: 0 1 70%; width: 100%;" class="main"></div>
                </div>
            </div>
            <!-- 24小时分布图 -->
            <div style="width: 100%;" class="twenty">
                <div class="accessname">24小时分布</div>
                <div class="access" style="width:100%; ">
                    <div ref="maintwenty" style="height:360px; width: 100%;" class="main"></div>
                </div>
            </div>
            <div class="box1" style="display: flex;">
                <!-- 高频访问 -->
                <div style="width: 40%;height: 300px;flex: 0 1 45%;" class="frequency">
                    <div class="accessname">高频访问</div>
                    <li class="highfrequency" v-for="(item, index) in EchartData?.topIpStats " :key="index">
                        <span>{{ item.ip }}</span>
                        <span style="display: inline-block;margin-right: 80px;">{{ item.cnt }}次</span>
                    </li>
                </div>
                <!-- 一周分布 -->
                <div style="width: 40%;height: 360px;flex: 0 1 45%;margin-left: 10%;" class="frequency">
                    <div class="accessname">一周分布</div>
                    <div ref="mainfrequency" style="height:280px; flex: 0 1 45%; margin-top:-30px" class="main">
                    </div>
                </div>
            </div>
            <div class="box2" style="display: flex;margin-top:-70px">
                <!-- 操作系统 -->
                <div style="width: 100%;height: 300px;flex: 0 1 45%; " class="box2frequency">
                    <div class="accessname">
                        操作系统
                    </div>
                    <div class="content" v-for="(item, index) in EchartData?.osStats" :key="index">
                        <div class="smallcontent">
                            <div class="img">
                                <!-- <img src="E:\短链接\短链接 - 副本\public\favicon.ico" alt="" style="width: 30px;height: 30px;"> -->
                                <span>{{ item.os }}:{{ item.ratio * 100 }}%</span>
                            </div>
                            <div>{{ item.cnt }}次</div>
                        </div>
                        <a-progress :percent="item.ratio * 100" :showInfo="false" strokeColor="#3464e0" />
                    </div>
                </div>
                <!-- 访问浏览器 -->
                <div style="width: 40%;height: 360px;flex: 0 1 45%;margin-left: 10%;" class="box2frequency">
                    <div class="accessname">访问浏览器</div>
                    <div class="content" v-for="(item, index) in EchartData?.browserStats" :key="index">
                        <div class="smallcontent">
                            <div class="img">
                                <!-- <img src="E:\短链接\短链接 - 副本\public\favicon.ico" alt="" style="width: 30px;height: 30px;"> -->
                                <span>{{ item.browser }}:{{ item.ratio * 100 }}%</span>

                            </div>
                            <div>{{ item.cnt }}次</div>
                        </div>

                        <a-progress :percent="item.ratio * 100" :showInfo="false" strokeColor="#3464e0" />
                    </div>

                </div>
            </div>
            <div class="box3" style="display: flex;">
                <!-- 访问类型 -->
                <div style="width: 40%;height: 300px;flex: 0 1 45%;" class="frequency">
                    <div class="accessname">访问类型</div>
                    <div ref="mainvisitors" style="height:280px; flex: 0 1 45%;margin-top:10px" class="main">
                    </div>
                </div>
                <!-- 访问网络 -->
                <div style="width: 40%;height: 360px;flex: 0 1 45%;margin-left: 10%;" class="frequency">
                    <div class="accessname">访问网络</div>
                    <div ref="mainnetwork" style="height:280px; flex: 0 1 45%;margin-top:10px" class="main">
                    </div>
                </div>
            </div>
            <div class="box4" style="display: flex;">
                <!-- 访问类型 -->
                <div style="width: 40%;height: 300px;flex: 0 1 45%;" class="frequency">
                    <div class="accessname">访问设备</div>
                    <div ref="mainequipment" style="height:280px; flex: 0 1 45%;margin-top:10px" class="main">
                    </div>
                </div>
                <!-- 访问来源top5 -->
                <!-- <div style="width: 40%;height: 360px;flex: 0 1 45%;margin-left: 10%;" class="frequency">
                    <div class="accessname">访问网络</div>
                    <div class="origin">
                        <span style="color: #406de2;">直接访问</span>
                        <span>2次</span>
                    </div>
                </div> -->
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, defineProps, onBeforeUpdate } from 'vue'
import * as echarts from 'echarts';
import china from '@/utils/Json/china.json'
const props = defineProps(['EchartData'])
let main = ref();
let mainmap = ref()
let maintwenty = ref()
let mainfrequency = ref()
let mainvisitors = ref()
let mainnetwork = ref()
let mainequipment = ref()
let chinatestList = ref()
onBeforeUpdate(() => {
    if (props.EchartData !== null) {
        setTimeout(() => {
            let myChart = echarts.init(main.value);
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['访问次数', '访问人数', 'Ip数'],
                },
                yAxis: {


                },
                xAxis: {
                    data:
                        props.EchartData.daily.map(item => item.date),
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: '访问次数',
                        data: props.EchartData?.daily.map(item => {
                            if (!item.pv) item.pv = 0
                            return item.pv
                        }),
                        type: 'line',
                        stack: 'y',
                        smooth: true,
                    },
                    {
                        name: '访问人数',
                        data: props.EchartData?.daily.map(item => {
                            if (!item.uv) item.uv = 0
                            return item.uv
                        }),
                        type: 'line',
                        stack: 'y',
                        smooth: true,
                    },
                    {
                        name: 'Ip数',
                        data: props.EchartData?.daily.map(item => {
                            if (!item.uip) item.uip = 0
                            return item.uip
                        }),
                        type: 'line',
                        stack: 'y',
                        smooth: true,
                    }
                ]
            });

            // 地图map
            let mymapChart = echarts.init(mainmap.value);
            echarts.registerMap('china', china)
            mymapChart.setOption({
                series: [{
                    type: 'map',
                    map: 'china',
                    zoom: 1.4,
                    top: 80,
                    label: {

                        color: '#fff',
                        fontSize: 12,
                    },

                    itemStyle: {
                        areaColor: '#eeeeee',
                        borderColor: '#fff'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#006064',
                            fontSize: 14,
                        },
                        itemStyle: {
                            areaColor: '#69f0ae',
                            borderColor: '#f4fcec'
                        },
                    },
                    scaleLimit: {
                        min: 1,
                        max: 1.7
                    },
                    data: props.EchartData?.localeCnStats.map(item => {
                        return {
                            name: item.locale.slice(-3, -1),
                            value: item.cnt
                        }
                    }),
                    series: [{
                        data: props.EchartData?.localeCnStats.map(item => {
                            return {
                                name: item.locale.slice(-3, -1),
                                value: item.cnt
                            }
                        })
                    }]

                    // { name: item.locale, value: item.cnt }
                }],
                visualMap: {
                    min: 1,
                    max: 100,

                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#ccd8f8', '#7a99ea', '#3c6ae1'],
                    }
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: { readOnly: false, title: '数据视图' },
                        restore: {
                            title: '还原'
                        },
                        saveAsImage: { title: '保存图片' }
                    },
                    itemSize: 25,
                    itemGap: 16,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `地区访问次数 <br />
                        ${params.name}: ${params.value ? params.value + '次' : '-'
                            }`
                    }
                },
            });
            // 24小时分布
            let mytwentyChart = echarts.init(maintwenty.value);
            mytwentyChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                yAxis: {

                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#eff3fe'
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#ccced4'
                    }

                },
                xAxis: {
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#f6f8fe'
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#ccced4'
                    }
                },
                series: [
                    {
                        data: props.EchartData?.hourStats,
                        type: 'bar',
                        stack: 'y',
                        barWidth: '6',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgb(239, 243, 253)',
                        },
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                        },

                    },
                ]
            });

            // 一周分布
            let myfrequencyChart = echarts.init(mainfrequency.value)
            myfrequencyChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },

                yAxis: {

                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#eff3fe'
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#ccced4'
                    }

                },
                xAxis: {
                    data: ['一', '二', '三', '四', '五', '六', '日'],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#f6f8fe'
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#ccced4'
                    }
                },
                series: [
                    {
                        data: props.EchartData?.weekdayStats,
                        type: 'bar',
                        stack: 'y',
                        barWidth: '6',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgb(239, 243, 253)',
                        },
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                        },

                    },
                ]
            });

            //  访问类型
            let myvisitorsChart = echarts.init(mainvisitors.value)
            myvisitorsChart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: 'top',
                    left: 'center'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: props.EchartData?.uvTypeStats.filter(item => {
                                    return item.uvType === 'newUser'
                                })[0].ratio, name: '新设备'
                            },
                            {
                                value: props.EchartData?.uvTypeStats.filter(item => {
                                    return item.uvType === 'oldUser'
                                })[0].ratio, name: '老设备'
                            },
                        ]
                    }
                ]
            });
            //  访问网络
            let mynetworkChart = echarts.init(mainnetwork.value)
            mynetworkChart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: 'top',
                    left: 'center'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: props.EchartData?.networkStats.filter(item => { return item.network === 'Mobile' })[0]?.ratio || 0, name: '移动数据' },
                            { value: props.EchartData?.networkStats.filter(item => { return item.network === 'WIFI' })[0]?.ratio || 0, name: 'WIFI' },
                        ]
                    }
                ]
            });
            // 访问设备
            let myquipmentChart = echarts.init(mainequipment.value)
            myquipmentChart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: 'top',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: props.EchartData?.networkStats.filter(item => { return item.network === 'Mobile' })[0]?.ratio || 0, name: '移动设备' },
                            { value: props.EchartData?.networkStats.filter(item => { return item.network === 'PC' })[0]?.ratio || 0, name: '电脑' },
                        ]
                    }
                ]
            });
            window.addEventListener('resize', function () {
                myChart.resize();
                mymapChart.resize();
                mytwentyChart.resize()
            });

        }, 10)
        // line折线图
    }

})

</script>

<style lang="less" scoped>
.map,
.twenty {
    margin-top: -30px;
}

.accessname {
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 20px;
    color: #3464e0;
    font-weight: 700;
    padding-bottom: 10px;
    border-bottom: 2px solid #e9ebf0;
}

.access {
    margin-top: 10px;

    .main {
        display: flex;
        justify-content: center;
    }
}

.data {
    font-size: 12px;

    li {
        width: 45%;
        display: flex;
        justify-content: space-between;
    }

    .provice {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 700;
        color: #4c76e4;


    }

    li {
        color: #4c76e4;
        // margin-top: 15px;

        .area {
            display: inline-block;
            // margin-right: 40px;
        }

        span {
            display: inline-block;
            // margin-right: 20px;
            color: #2e364d
        }
    }
}

.highfrequency {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
}

.frequencynum {
    font-size: 12px;
    margin-top: 20px;
}

.box2frequency {
    font-size: 12px;
    font-weight: 700;

    .content {
        .img {
            display: flex;
            width: calc(100% - 20px);
            align-items: center;
        }

        .smallcontent {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        height: 50px;

        width: 100%;
    }
}

.box3,
.box4 {
    margin-top: -50px;
    margin-bottom: 70px
}

.origin {
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    font-size: 12px;
    margin-top: -20px;
    font-weight: 700;

    span {
        display: inline-block;
    }
}
</style>