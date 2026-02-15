import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember, AppMode, COLORS } from '../types';
import { RefreshCcw } from 'lucide-react';

interface MoodBoardProps {
  members: FamilyMember[];
  mode: AppMode;
  onUpdateMood: (id: string, mood: string) => void;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ members, mode, onUpdateMood }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [simulationInstance, setSimulationInstance] = useState<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  const initSimulation = () => {
    if (!svgRef.current || !containerRef.current) return;

    // Use container width to ensure we have dimensions
    const width = containerRef.current.clientWidth;
    const height = 400;

    if (width === 0) return; // Wait for layout

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Create a deep copy of members so D3 doesn't mutate React state references directly in a way that causes issues on re-renders
    const nodesData = members.map(m => ({ ...m }));

    // Physics simulation
    const simulation = d3.forceSimulation(nodesData as any)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => (mode === AppMode.KID ? 70 : 60) + 5));
    
    setSimulationInstance(simulation);

    // Nodes Group
    const nodes = svg.selectAll("g")
      .data(nodesData)
      .enter()
      .append("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Bubbles
    nodes.append("circle")
      .attr("r", mode === AppMode.KID ? 70 : 60)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .style("filter", "drop-shadow(0px 10px 10px rgba(0,0,0,0.1))")
      .style("cursor", "grab");

    // Shine effect
    nodes.append("circle")
      .attr("r", 20)
      .attr("cx", -20)
      .attr("cy", -20)
      .attr("fill", "white")
      .attr("opacity", 0.3);

    // Emoji/Avatar
    nodes.append("text")
      .text((d: any) => d.avatar)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em")
      .style("font-size", mode === AppMode.KID ? "40px" : "32px")
      .style("user-select", "none");

    // Mood
    nodes.append("text")
      .text((d: any) => d.mood)
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .style("font-size", "24px")
      .style("user-select", "none");

    // Points/Stars Badge
    nodes.append("rect")
       .attr("x", -30)
       .attr("y", mode === AppMode.KID ? 35 : 25)
       .attr("width", 60)
       .attr("height", 20)
       .attr("rx", 10)
       .attr("fill", "rgba(0,0,0,0.2)");
       
    nodes.append("text")
      .text((d: any) => `★ ${d.points}`)
      .attr("text-anchor", "middle")
      .attr("dy", mode === AppMode.KID ? "3.2em" : "2.6em")
      .style("font-size", "14px")
      .attr("fill", "white")
      .style("font-weight", "bold")
      .style("user-select", "none");

    if (mode === AppMode.ADULT) {
        nodes.append("text")
        .text((d: any) => d.name)
        .attr("text-anchor", "middle")
        .attr("dy", "-3.5em")
        .style("font-size", "14px")
        .attr("fill", "#2D3436")
        .style("font-weight", "bold");
    }

    // Interaction
    nodes.on("click", (event, d: any) => {
        setSelectedMember(d.id);
    });

    simulation.on("tick", () => {
      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return simulation;
  };

  useEffect(() => {
    const simulation = initSimulation();
    return () => {
      simulation?.stop();
    };
  }, [members, mode]);

  const handleReset = () => {
     // Force re-initialization
     const simulation = initSimulation();
     simulation?.alpha(1).restart();
  };

  const moods = ['😀', '😴', '😤', '🥳', '🤒', '🥰'];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-3xl bg-blue-50/50 border-2 border-white">
      <div className="absolute top-4 left-6 right-6 flex justify-between items-start z-10">
        <h2 className="text-xl text-gray-700 font-bold">
            {mode === AppMode.ADULT ? "Family Pulse" : "Who is home?"}
        </h2>
        <button 
            onClick={handleReset}
            className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
            title="Reset Bubbles"
        >
            <RefreshCcw size={16} className="text-gray-500" />
        </button>
      </div>
      
      <svg ref={svgRef} className="w-full h-[400px]" />
      
      {/* Mood Selector Overlay */}
      {selectedMember && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
             onClick={() => setSelectedMember(null)}>
          <div className="bg-white p-6 rounded-[40px] shadow-2xl transform scale-100 transition-transform"
               onClick={(e) => e.stopPropagation()}>
            <h3 className="text-center text-lg mb-4 text-gray-600">How are you feeling?</h3>
            <div className="grid grid-cols-3 gap-4">
              {moods.map(m => (
                <button
                  key={m}
                  onClick={() => {
                    onUpdateMood(selectedMember, m);
                    setSelectedMember(null);
                  }}
                  className="text-4xl p-4 hover:bg-gray-100 rounded-2xl transition-transform active:scale-90"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodBoard;