import  { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchPayments } from '@/area-manager/services/paymentService'; // Dịch vụ API để lấy dữ liệu thanh toán

const LineChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const payments = await fetchPayments(); // Lấy dữ liệu từ API
        const formattedData = payments.map((payment) => ({
          x: new Date(payment.PayDate).getTime(), // Chuyển đổi ngày thành timestamp
          y: payment.PayAmount, // Số tiền thanh toán
        }));

        setChartData([
          {
            values: formattedData,
            key: 'Payment Amount Over Time',
            color: '#A389D4',
          },
        ]);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    loadChartData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    const customWidth = isSmallScreen ? 300 : 510;
    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = customWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select('#line-chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(chartData[0].values, (d) => d.x)) // Xác định phạm vi thời gian
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData[0].values, (d) => d.y)]) // Xác định phạm vi số tiền
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    chartData.forEach((series) => {
      svg
        .append('path')
        .datum(series.values)
        .attr('class', 'line')
        .attr('d', line)
        .style('stroke', series.color)
        .style('fill', 'none')
        .style('stroke-width', '2px');
    });

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m-%d')))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Payment Amount (VNĐ)');
  }, [chartData]);

  return <div id="line-chart-container"></div>;
};

export default LineChart;
