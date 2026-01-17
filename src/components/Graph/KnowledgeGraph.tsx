"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { graphNodes, graphLinks, GraphNode } from "@/data/graph-nodes";

interface KnowledgeGraphProps {
  onSwitchView: () => void;
}

interface SimulationNode extends GraphNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimulationLink {
  source: SimulationNode | string;
  target: SimulationNode | string;
  strength?: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onSwitchView }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const initializedRef = useRef(false);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 500) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle node selection - separate from D3 to prevent re-renders
  const handleNodeClick = useCallback((nodeData: GraphNode) => {
    setSelectedNode(prev => prev?.id === nodeData.id ? null : nodeData);
  }, []);

  // D3 Visualization - only runs on dimension changes
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    // Cleanup previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create deep copies of data for D3 simulation
    const nodes: SimulationNode[] = graphNodes.map(d => ({ ...d }));
    const links: SimulationLink[] = graphLinks.map(d => ({ ...d }));

    // Create container group for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id((d: d3.SimulationNodeDatum) => (d as SimulationNode).id)
        .distance(120)
        .strength((d) => (d as SimulationLink).strength || 0.5))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: d3.SimulationNodeDatum) => (d as SimulationNode).size + 15));

    simulationRef.current = simulation;

    // Create gradient definitions
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "graph-link")
      .attr("stroke", "var(--border-color)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => ((d as SimulationLink).strength || 0.5) * 2);

    // Draw node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, SimulationNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles - using CSS for hover effects to avoid flicker
    node.append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)")
      .style("transition", "fill-opacity 0.15s ease, stroke-width 0.15s ease");

    // Add hover effect via CSS class toggle
    node
      .on("mouseenter", function() {
        d3.select(this).select("circle")
          .attr("fill-opacity", 1)
          .attr("stroke-width", 4);
      })
      .on("mouseleave", function() {
        d3.select(this).select("circle")
          .attr("fill-opacity", 0.85)
          .attr("stroke-width", 2);
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        handleNodeClick(d);
      });

    // Node labels
    node.append("text")
      .attr("dy", (d) => d.size + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#e6edf3")
      .attr("font-size", "11px")
      .attr("font-family", "inherit")
      .attr("pointer-events", "none")
      .text((d) => d.label);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimulationNode).x || 0)
        .attr("y1", (d) => (d.source as SimulationNode).y || 0)
        .attr("x2", (d) => (d.target as SimulationNode).x || 0)
        .attr("y2", (d) => (d.target as SimulationNode).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Initial zoom to fit - only on first render
    if (!initializedRef.current) {
      initializedRef.current = true;
      setTimeout(() => {
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity.translate(width * 0.1, height * 0.1).scale(0.7)
        );
      }, 200);
    }

    // Click on background to deselect
    svg.on("click", () => {
      setSelectedNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions, handleNodeClick]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Graph Container */}
      <div
        ref={containerRef}
        className="terminal-glow rounded-lg overflow-hidden border border-[var(--border-color)]"
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--text-primary)]" />
          </div>
          <span className="text-sm text-[var(--text-muted)]">Knowledge Graph - Drag to explore, scroll to zoom</span>
          <button
            onClick={onSwitchView}
            className="text-sm text-[var(--text-primary)] hover:underline"
          >
            Terminal View
          </button>
        </div>

        {/* Graph */}
        <div className="relative bg-[var(--bg-terminal)]" style={{ height: "60vh", minHeight: "500px" }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            className="cursor-grab active:cursor-grabbing"
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-[var(--bg-card)]/95 p-3 rounded border border-[var(--border-color)] backdrop-blur-sm">
            <div className="text-xs text-[var(--text-muted)] mb-2">Legend</div>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { color: "#00ff9f", label: "Me" },
                { color: "#64ffda", label: "Experience" },
                { color: "#bd93f9", label: "Patents" },
                { color: "#ff79c6", label: "Skills" },
                { color: "#ffb86c", label: "Achievements" },
                { color: "#8be9fd", label: "Education" }
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[var(--text-white)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div
              className="absolute top-4 right-4 bg-[var(--bg-card)]/95 p-4 rounded border border-[var(--border-color)] max-w-xs backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--text-white)] text-lg leading-none"
              >
                ×
              </button>
              <h3 className="text-[var(--text-primary)] font-bold mb-2 pr-6">{selectedNode.label}</h3>
              <p className="text-[var(--text-muted)] text-sm mb-3">{selectedNode.description}</p>
              {selectedNode.details && (
                <div className="text-xs space-y-1">
                  {Object.entries(selectedNode.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[var(--text-secondary)] capitalize">{key}: </span>
                      <span className="text-[var(--text-white)]">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-[var(--text-muted)] text-sm">
        Click nodes to see details • Drag nodes to rearrange • Scroll to zoom
      </div>
    </div>
  );
};

export default KnowledgeGraph;
