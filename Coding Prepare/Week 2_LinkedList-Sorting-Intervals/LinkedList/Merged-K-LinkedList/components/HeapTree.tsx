
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { HeapNode } from '../types';

interface HeapTreeProps {
  data: HeapNode[];
  highlightedIndex?: number;
}

const HeapTree: React.FC<HeapTreeProps> = ({ data, highlightedIndex }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });

  // Handle Window Resize for Responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 450 // Fixed height for consistent vertical rhythm
        });
      }
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (data.length === 0) {
      svg.append("text")
         .attr("x", "50%")
         .attr("y", "50%")
         .attr("text-anchor", "middle")
         .attr("fill", "#A8A29E")
         .style("font-family", "Merriweather, serif")
         .style("font-style", "italic")
         .style("font-size", "18px")
         .text("The Basket is Empty");
      return;
    }

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    interface TreeNode {
      name: string;
      val: number;
      listIdx: number;
      originalIdx: number;
      color: string;
      children?: TreeNode[];
      heapIndex: number;
    }

    const buildTree = (index: number): TreeNode | null => {
      if (index >= data.length) return null;
      const node: TreeNode = {
        name: `Node ${data[index].val}`,
        val: data[index].val,
        listIdx: data[index].listIndex,
        originalIdx: data[index].originalIndex,
        color: data[index].color,
        heapIndex: index,
        children: []
      };
      const left = buildTree(2 * index + 1);
      const right = buildTree(2 * index + 2);
      if (left) node.children?.push(left);
      if (right) node.children?.push(right);
      return node;
    };

    const rootData = buildTree(0);
    if (!rootData) return;

    const root = d3.hierarchy<TreeNode>(rootData);
    const treeLayout = d3.tree<TreeNode>().size([innerWidth, innerHeight]);
    treeLayout(root);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Links (Branches)
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x!)
        .y(d => d.y!) as any
      )
      .attr("fill", "none")
      .attr("stroke", "#A8A29E") 
      .attr("stroke-width", 2);

    // Nodes Group
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Node Shape (Organic/Harvest feel)
    const NODE_RADIUS = 32; // Increased size for readability of i,j

    // Main Background Circle
    nodes.append("circle")
      .attr("r", NODE_RADIUS) 
      .attr("fill", "white")
      .attr("stroke", d => d.data.color)
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0px 3px 3px rgba(0,0,0,0.1))");

    // Inner color fill (tint)
    nodes.append("circle")
      .attr("r", NODE_RADIUS - 4)
      .attr("fill", d => d.data.color)
      .attr("opacity", 0.15);

    // Active Highlight (Sunburst)
    const activeNodes = nodes.filter(d => d.data.heapIndex === highlightedIndex);
    
    activeNodes.append("circle")
      .attr("r", NODE_RADIUS + 8)
      .attr("fill", "none")
      .attr("stroke", "#D97706") // Pumpkin Orange
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4")
      .attr("class", "animate-spin-slow");

    // Text Group
    const text = nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#451a03")
      .style("font-family", "Inter, sans-serif");

    // Value Line (Bold, Center)
    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "-0.4em")
      .style("font-weight", "bold")
      .style("font-size", "16px")
      .text(d => `val: ${d.data.val}`);

    // Index Line (Smaller, Below)
    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "1.4em") // Move down
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("opacity", 0.8)
      .text(d => `i:${d.data.listIdx}, j:${d.data.originalIdx}`);

  }, [data, highlightedIndex, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-[450px] bg-[#FFFBEB] rounded-2xl border-2 border-[#E7E5E4] shadow-inner relative overflow-hidden">
      <div className="absolute top-4 left-0 right-0 text-center text-sm font-serif font-bold text-stone-400 uppercase tracking-widest">The Harvest Basket</div>
      <svg ref={svgRef} className="w-full h-full" />
      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeapTree;
