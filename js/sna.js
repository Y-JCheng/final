function readfile(filename) {
    // Color button
    document.getElementById("plural").className = "SNAbutton";
    document.getElementById("smallworld").className = "SNAbutton";
    document.getElementById("structural_cohesion").className = "SNAbutton";
    document.getElementById("star").className = "SNAbutton";
    document.getElementById(filename).className += " showing";

    // Change introduction
    document.getElementById("plural_info").className = "SNAinfo";
    document.getElementById("smallworld_info").className = "SNAinfo";
    document.getElementById("structural_cohesion_info").className = "SNAinfo";
    document.getElementById("star_info").className = "SNAinfo";
    document.getElementById(filename + "_info").className += " showinfo";

    // Clear svg
    document.getElementById("SNA").innerHTML = "";

    var margin = 10,
        width = document.getElementById("SNA").offsetWidth - margin - margin,
        height = width / 2;

    // Set svg
    var svg = d3.select("#SNA")
        .append("svg")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")
        .attr("transform",
            "translate(" + margin + "," + margin + ")");

    //read json
    d3.json("data/" + filename + ".json", function (data) {

        // Initialize the links
        var link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", function (d) { return d.colour; })

        // Arrange forces
        var simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink()
                .id(function (d) { return d.id; })
                .links(data.links)
            )
            .force("charge", d3.forceManyBody().strength(-20))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticking);

        // Update position
        function ticking() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        // Dragging feature
        var dragging = d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end);

        function drag_start(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function drag_drag(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function drag_end(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        dragging(node)

        // Zooming feature
        var zooming = d3.zoom()
            .on("zoom", zoom_actions);

        function zoom_actions() {
            g.attr("transform", d3.event.transform)
        }

        zooming(svg); 
    });
}
$(document).ready(readfile("plural"))