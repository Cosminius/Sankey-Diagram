function computeLayout({ nodes, links, width, height }) {
  const sankey = d3.sankey()
    .nodeId(d => d.name)
    .nodeWidth(14)
    .nodePadding(16)
    .extent([[80, 60], [width - 140, height - 40]]);

  return sankey({
    nodes: nodes.map(d => ({ ...d })),
    links: links.map(d => ({ ...d }))
  });
}

function drawLinks(svg, graph) {
  svg.append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(graph.links)
    .join('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke', d => color(d.source.name))
    .attr('stroke-opacity', 0.45)
    .attr('stroke-width', d => Math.max(1, d.width))
    .style('mix-blend-mode', 'multiply')
    .append('title')
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);
}

function drawNodes(svg, graph, width) {
  const node = svg.append('g')
    .selectAll('g')
    .data(graph.nodes)
    .join('g');

  node.append('rect')
    .attr('class', 'node-rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('width', d => d.x1 - d.x0)
    .attr('fill', d => color(d.name))
    .append('title')
    .text(d => `${d.name}\n${d.value}`);

  node.append('text')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
    .attr('y', d => (d.y0 + d.y1) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .text(d => `${d.name} · ${d.value}`);
}

function renderDiagram(svg, graph, width) {
  drawLinks(svg, graph);
  drawNodes(svg, graph, width);
}
