import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from './ui/card'; // Import Card from ShadCN

interface D3ChartProps {
  data: { year: string; value: number }[];
  title?: string;
}

const D3Chart: React.FC<D3ChartProps> = ({ data, title }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = svg.node()?.clientWidth || 0;
      const height = svg.node()?.clientHeight || 0;

      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(data.map(d => d.year))
        .range([0, innerWidth])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .nice()
        .range([innerHeight, 0]);

      g.append('g')
        .selectAll('.x-axis')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.year) || 0)
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', 'steelblue');

      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      g.append('g')
        .call(d3.axisLeft(y));
    }
  }, [data]);

  return (
    <Card className="w-1/2 h-full p-4 shadow-lg rounded-lg bg-white">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <svg ref={svgRef} width="100%" height="50%" />
    </Card>
  );
};

export default D3Chart;
