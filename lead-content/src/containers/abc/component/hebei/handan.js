import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import * as echarts from 'echarts';
import { Button } from 'antd';
const HanDan = () => {
  useEffect(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom, null, { renderer: 'svg' });
    var option;
    setTimeout(function () {
      option = {
        legend: {},
        title: {
          text: "酒量排行榜"
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['邯郸永年', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['邯郸武安', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['邯郸峰峰', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['邯郸成安', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };
      myChart.setOption(option);
    });
    option && myChart.setOption(option);

  }, [])
  const onScreencapture = () => {
    const targetDom = document.getElementById('myElement');
    debugger
    const copyDom = targetDom.cloneNode(true);
    copyDom.style.width = `${targetDom.scrollWidth}px`;
    copyDom.style.height = `${targetDom.scrollHeight}px`;
    document.getElementById('myElement').appendChild(copyDom);
    html2canvas(copyDom, {
      // useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      // eslint-disable-next-line
      const dataImg = new Image();
      dataImg.src = canvas.toDataURL('image/png');
      const alink = document.createElement('a');
      alink.href = dataImg.src;
      alink.download = '保存实验截图.jpg';
      alink.click();
      copyDom.remove();
    });
  }
  return <div id='myElement'>
    <Button className="demo-log" onClick={() => { onScreencapture() }}>截屏</Button>
    <div style={{ width: '100%', height: 500 }} id='main'></div>
    <p style={{ color: "red" }}>
      当前页面采用 react框架   使用echarts 绘制而成  使用了html2Canvas 截屏得功能将截取整个页面
      其中由于html2Canvas 采用得canvas功能截取  而echarts表也是
      由canvas绘制而成  造成html2Canvas 中截取不到echarts表
      解决方法  采用了将echarts表个绘制格式修改为 svg格式  就可实现截图功能
    </p>
  </div>
};
export default HanDan;