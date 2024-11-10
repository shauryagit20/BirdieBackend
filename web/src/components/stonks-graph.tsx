// src/components/StockChart/index.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StockData {
    date: Date;
    price: number;
  }
  
interface ChartDimensions {
    width: number;
    height: number;
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }
  
interface ChartProps {
    data?: StockData[];
    width?: number;
    height?: number;
    className?: string;
  }

const DEFAULT_DATA: StockData[] = [
  { date: new Date('2024-11-01'), price: 150 },
  { date: new Date('2024-11-02'), price: 158 },
  { date: new Date('2024-11-03'), price: 155 },
  { date: new Date('2024-11-04'), price: 162 },
  { date: new Date('2024-11-05'), price: 168 },
  { date: new Date('2024-11-06'), price: 165 },
  { date: new Date('2024-11-07'), price: 172 },
  { date: new Date('2024-11-08'), price: 169 },
  { date: new Date('2024-11-09'), price: 175 },
  { date: new Date('2024-11-10'), price: 180 }
];

const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  }
};

const StockChart: React.FC<ChartProps> = ({
  data = DEFAULT_DATA,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  className = ''
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous render
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = DEFAULT_DIMENSIONS.margin;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X & Y Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.price) as number * 0.95,
        d3.max(data, d => d.price) as number * 1.05
      ])
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line<StockData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);

    // Add area gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0')
      .attr('y1', yScale(d3.min(data, d => d.price) as number))
      .attr('x2', '0')
      .attr('y2', yScale(d3.max(data, d => d.price) as number));

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF69B4')
      .attr('stop-opacity', 0.2);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#FF69B4')
      .attr('stop-opacity', 0);

    // Add area
    const area = d3.area<StockData>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Add line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FF1493')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add points
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.price))
      .attr('r', 4)
      .attr('fill', '#FF1493')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(d3.timeFormat('%b %d') as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `$${d}`);

    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

  }, [data, width, height]);

  return (
    <div className="stock-chart-container">
      <div className="chart-card">
        <h2 className="text-xl font-bold mb-4">Stock Performance</h2>
        <svg 
          ref={chartRef} 
          className={`chart-svg ${className}`}
        />
      </div>
    </div>
  );
};

export default StockChart;