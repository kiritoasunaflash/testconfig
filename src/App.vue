<script setup>
console.log(window.location.host);
let Env_hangyequan = '192.168.236.1:5173'
let Env_laoqiu = '192.168.137.1:5173'

</script>

<template>
  <router-view></router-view>
</template>

<style>
body,
div,
dl,
dt,
dd,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6,
input,
p,
form,
a,
textarea {
  margin: 0;
  padding: 0;
  /* font-family 完全可以改成你需要的 */
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

ol,
ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
  display: block;
}

img {
  border: none;
  display: block;
}

/* 给需要清除浮动的标签的class加上clearfloat类 */
.clearfloat {
  zoom: 1;
  /* 适配IE */
}

.clearfloat:after {
  display: block;
  clear: both;
  content: '';
  visibility: hidden;
  height: 0;
}
</style>
