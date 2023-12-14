import React, { useEffect } from 'react';
// import html2canvas from 'html2canvas';
import * as echarts from 'echarts';
// import { Button } from 'antd';
const HanDan = () => {
  useEffect(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
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
  // const onScreencapture = () => {
  //   const targetDom = document.getElementById('myElement');
  //   debugger
  //   const copyDom = targetDom.cloneNode(true);
  //   copyDom.style.width = `${targetDom.scrollWidth}px`;
  //   copyDom.style.height = `${targetDom.scrollHeight}px`;
  //   document.getElementById('myElement').appendChild(copyDom);
  //   html2canvas(copyDom, {
  //     // useCORS: true,
  //     allowTaint: true,
  //   }).then((canvas) => {
  //     // eslint-disable-next-line
  //     const dataImg = new Image();
  //     dataImg.src = canvas.toDataURL('image/png');
  //     const alink = document.createElement('a');
  //     alink.href = dataImg.src;
  //     alink.download = '保存实验截图.jpg';
  //     alink.click();
  //     copyDom.remove();
  //   });
  // }
  return <div id='myElement'>
    {/* <Button className="demo-log" onClick={() => { onScreencapture() }}>截屏</Button> */}
    <div style={{ width: '100%', height: 500 }} id='main'></div>
  </div>
};
export default HanDan;