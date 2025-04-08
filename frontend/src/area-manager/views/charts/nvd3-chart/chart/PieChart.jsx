import  { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchPaymentsByMethod } from '@/area-manager/services/paymentService';

const PieBasicChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const payments = await fetchPaymentsByMethod(); // Gọi API lấy dữ liệu nhóm theo phương thức
        const formattedData = payments.map((item, index) => ({
          key: item.method,
          y: item.total,
          color: d3.schemeTableau10[index % 10], // Màu sắc từ d3
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data for pie chart:', error);
      }
    };

    loadChartData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value((d) => d.y);
    const path = d3.arc().outerRadius(radius).innerRadius(0);

    const arcs = svg.selectAll('arc').data(pie(chartData)).enter().append('g');

    arcs
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${path.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .text((d) => d.data.key);
  }, [chartData]);

  return <div id="chart"></div>;
};

export default PieBasicChart;
