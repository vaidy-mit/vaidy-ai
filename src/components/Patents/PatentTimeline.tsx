"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { patents, Patent } from "@/data/patents";

// Company colors matching the cyberpunk theme
const companyColors: Record<string, string> = {
  "Meta": "#8be9fd",           // Blue for Meta
  "Amazon (Alexa)": "#ffb86c", // Orange for Amazon
};

// Status visual config
const statusConfig: Record<string, { dashArray: string; opacity: number }> = {
  "issued": { dashArray: "none", opacity: 1 },
  "pending": { dashArray: "5,5", opacity: 0.8 },
  "filed": { dashArray: "5,5", opacity: 0.8 },
};

interface TimelineNode {
  patent: Patent;
  x: number;
  y: number;
  color: string;
}

export const PatentTimeline: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle patent selection
  const handlePatentClick = useCallback((patent: Patent) => {
    setSelectedPatent(prev => prev?.id === patent.id ? null : patent);
  }, []);

  // D3 Visualization
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 60, right: 40, bottom: 80, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse years and create scale
    const parseYear = (yearStr: string) => {
      // Handle ranges like "2024-2025" by taking the first year
      const match = yearStr.match(/(\d{4})/);
      return match ? parseInt(match[1]) : 2021;
    };

    const years = patents.map(p => parseYear(p.year));
    const minYear = Math.min(...years) - 1;
    const maxYear = Math.max(...years) + 1;

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([0, innerWidth]);

    // Create gradient definitions
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter")
      .attr("id", "patent-glow")
      .attr("x", "-100%")
      .attr("y", "-100%")
      .attr("width", "300%")
      .attr("height", "300%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw timeline axis line
    g.append("line")
      .attr("x1", 0)
      .attr("y1", innerHeight / 2)
      .attr("x2", innerWidth)
      .attr("y2", innerHeight / 2)
      .attr("stroke", "var(--border-color)")
      .attr("stroke-width", 2);

    // Draw year markers
    const yearTicks = d3.range(minYear, maxYear + 1);
    g.selectAll(".year-tick")
      .data(yearTicks)
      .enter()
      .append("g")
      .attr("class", "year-tick")
      .attr("transform", d => `translate(${xScale(d)},${innerHeight / 2})`)
      .each(function(d) {
        const tick = d3.select(this);
        tick.append("line")
          .attr("y1", -8)
          .attr("y2", 8)
          .attr("stroke", "var(--border-color)")
          .attr("stroke-width", 1);
        tick.append("text")
          .attr("y", 25)
          .attr("text-anchor", "middle")
          .attr("fill", "var(--text-muted)")
          .attr("font-size", "12px")
          .text(d);
      });

    // Group patents by year for stacking
    const patentsByYear: Record<number, Patent[]> = {};
    patents.forEach(p => {
      const year = parseYear(p.year);
      if (!patentsByYear[year]) patentsByYear[year] = [];
      patentsByYear[year].push(p);
    });

    // Calculate node positions
    const nodes: TimelineNode[] = [];
    Object.entries(patentsByYear).forEach(([yearStr, patentList]) => {
      const year = parseInt(yearStr);
      const totalInYear = patentList.length;
      patentList.forEach((patent, index) => {
        // Alternate above and below the timeline
        const offset = totalInYear === 1 ? -60 :
          index % 2 === 0 ? -60 - (Math.floor(index / 2) * 50) : 60 + (Math.floor(index / 2) * 50);
        nodes.push({
          patent,
          x: xScale(year),
          y: innerHeight / 2 + offset,
          color: companyColors[patent.company] || "var(--text-primary)",
        });
      });
    });

    // Draw connecting lines from nodes to timeline
    g.selectAll(".connector")
      .data(nodes)
      .enter()
      .append("line")
      .attr("class", "connector")
      .attr("x1", d => d.x)
      .attr("y1", innerHeight / 2)
      .attr("x2", d => d.x)
      .attr("y2", d => d.y)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-dasharray", d => statusConfig[d.patent.status].dashArray);

    // Draw patent nodes
    const nodeGroups = g.selectAll(".patent-node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "patent-node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    // Node circles
    nodeGroups.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.color)
      .attr("fill-opacity", d => statusConfig[d.patent.status].opacity * 0.2)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => statusConfig[d.patent.status].dashArray)
      .attr("filter", "url(#patent-glow)")
      .style("transition", "all 0.2s ease");

    // Status icon in the center
    nodeGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "16px")
      .attr("fill", d => d.color)
      .text(d => d.patent.status === "issued" ? "✓" : "○");

    // Short title label
    nodeGroups.append("text")
      .attr("y", d => d.y < innerHeight / 2 ? -30 : 35)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-white)")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .each(function(d) {
        const text = d3.select(this);
        const words = d.patent.shortTitle.split(" ");
        const maxWidth = 100;
        let line: string[] = [];
        let lineNumber = 0;

        words.forEach(word => {
          line.push(word);
          const testLine = line.join(" ");
          if (testLine.length > 15 && line.length > 1) {
            line.pop();
            text.append("tspan")
              .attr("x", 0)
              .attr("dy", lineNumber === 0 ? 0 : "1.1em")
              .text(line.join(" "));
            line = [word];
            lineNumber++;
          }
        });
        text.append("tspan")
          .attr("x", 0)
          .attr("dy", lineNumber === 0 ? 0 : "1.1em")
          .text(line.join(" "));
      });

    // Hover and click interactions
    nodeGroups
      .on("mouseenter", function(event, d) {
        d3.select(this).select("circle")
          .attr("fill-opacity", d.patent.status === "issued" ? 0.5 : 0.4)
          .attr("stroke-width", 3);
      })
      .on("mouseleave", function(event, d) {
        d3.select(this).select("circle")
          .attr("fill-opacity", statusConfig[d.patent.status].opacity * 0.2)
          .attr("stroke-width", 2);
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        handlePatentClick(d.patent);
      });

    // Click on background to deselect
    svg.on("click", () => {
      setSelectedPatent(null);
    });

    // Draw company legend
    const legendData = Object.entries(companyColors);
    const legend = g.append("g")
      .attr("transform", `translate(0,${innerHeight + 40})`);

    legendData.forEach(([company, color], i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(${i * 160},0)`);

      legendItem.append("circle")
        .attr("r", 6)
        .attr("fill", color)
        .attr("fill-opacity", 0.3)
        .attr("stroke", color)
        .attr("stroke-width", 2);

      legendItem.append("text")
        .attr("x", 12)
        .attr("dy", "0.35em")
        .attr("fill", "var(--text-muted)")
        .attr("font-size", "12px")
        .text(company);
    });

    // Status legend
    const statusLegend = g.append("g")
      .attr("transform", `translate(${innerWidth - 200},${innerHeight + 40})`);

    statusLegend.append("circle")
      .attr("r", 6)
      .attr("fill", "var(--text-primary)")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "var(--text-primary)")
      .attr("stroke-width", 2);

    statusLegend.append("text")
      .attr("x", 12)
      .attr("dy", "0.35em")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", "12px")
      .text("Issued");

    statusLegend.append("circle")
      .attr("cx", 80)
      .attr("r", 6)
      .attr("fill", "var(--text-primary)")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "var(--text-primary)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3,3");

    statusLegend.append("text")
      .attr("x", 92)
      .attr("dy", "0.35em")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", "12px")
      .text("Filed/Pending");

  }, [dimensions, handlePatentClick]);

  return (
    <div className="w-full">
      {/* Timeline Container */}
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
          <span className="text-sm text-[var(--text-muted)]">Patent Timeline - Click to explore</span>
          <div className="w-20" />
        </div>

        {/* Timeline */}
        <div className="relative bg-[var(--bg-terminal)]" style={{ height: "400px" }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
          />
        </div>
      </div>

      {/* Selected Patent Details */}
      {selectedPatent && (
        <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${companyColors[selectedPatent.company]}20`,
                    color: companyColors[selectedPatent.company],
                    border: `1px solid ${companyColors[selectedPatent.company]}40`
                  }}
                >
                  {selectedPatent.company}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedPatent.status === "issued"
                      ? "bg-[var(--text-primary)]/20 text-[var(--text-primary)] border border-[var(--text-primary)]/40"
                      : "bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/40"
                  }`}
                >
                  {selectedPatent.status.charAt(0).toUpperCase() + selectedPatent.status.slice(1)}
                </span>
                <span className="text-[var(--text-muted)] text-sm">{selectedPatent.year}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-white)] mb-2">
                {selectedPatent.title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm mb-4">
                {selectedPatent.description}
              </p>
              {selectedPatent.patentNumber && (
                <a
                  href={`https://patents.google.com/patent/${selectedPatent.patentNumber.replace(/[^A-Z0-9]/gi, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {selectedPatent.patentNumber}
                </a>
              )}
            </div>
            <button
              onClick={() => setSelectedPatent(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-white)] text-xl leading-none p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center text-[var(--text-muted)] text-sm">
        Click on any patent node to view details
      </div>
    </div>
  );
};

export default PatentTimeline;
