// Based on https://d3-graph-gallery.com/graph/barplot_basic.html

const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 2000 - margin.left - margin.right,
    height = 1600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#main")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


d3.csv("https://raw.githubusercontent.com/maggiielam/data/main/ncaaw%2022-23%20ratings.csv").then(function (data) {

    console.log(data)


    const maxHeight = 300, maxWidth = 600, originalCircleSize = 5, barChartWidth = 600

    var allGroup = d3.map(data, d => d.Conf)
    allGroup = allGroup.filter((c, index) => {return allGroup.indexOf(c) === index})
    console.log(allGroup)

    // add scatterplot

    let xMax = d3.max(data.map(d => +d.ORtg))

    const x = d3.scaleLinear()
        .domain([80, xMax])
        .range([0, maxWidth]);

    let yMax = d3.max(data.map(d => +d.DRtg))

    const y = d3.scaleLinear()
        .domain([55, yMax])
        .range([maxHeight, 0]);


    let circleGroup1 = svg.append('g')
        .attr('class', 'circleGroup')
        .attr('transform', 'translate(' + 100 + ',' + 50 + ')')

    let myCircles = circleGroup1
        .selectAll(".myCircles")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'myCircles')
        .attr("cx", d => x(d.ORtg))
        .attr("cy", d => y(d.DRtg))
        .attr("r", originalCircleSize)
        .style("fill", "#7877E6")
        .style("opacity", '0.7')

    //add x axis
    circleGroup1.append("g")
        .attr("transform", `translate(0, ${maxHeight})`)
        .call(d3.axisBottom(x));

    //add y axis 
    circleGroup1.append("g")
        .call(d3.axisLeft(y));
        
    // axes labels
    svg.append("text")
        .attr("x",430)
        .attr("y", 400)
        .style("text-anchor", "middle")
        .text("Offensive Rating (Better ----->)");
        

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)
        .attr("y", 40)
        .text("Defensive Rating (Better <-----)");

    let circleTooltip = circleGroup1.append("text")
        .attr('x', 0)
        .attr('y', 0)
        .style('font-size', 16)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style("visibility", "hidden")
        .lower()


    let xLine = circleGroup1.append("line")
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style("visibility", "hidden")
        .lower()

    let yLine = circleGroup1.append("line")
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style("visibility", "hidden")
        .lower()


    myCircles
        .style('cursor', 'pointer')
        .on('mouseover', mouseOverFunction)
        .on('mouseout', mouseOutFunction)


    // bar chart

    let barGroup1 = svg.append('g')
        .attr('class', 'barGroup')
        .attr('transform', 'translate(' + 100 + ',' + 450 + ')')

    const xBar = d3.scaleBand()
        .range([0, barChartWidth])
        .domain(data.map(d => d.Conf))
        .padding(0.1);

    let yMaxBar = d3.max(data.map(d => +d.SRS))

    const yBar = d3.scaleLinear()
        .domain([0, yMaxBar])
        .range([maxHeight, 0]);


    let myBars = barGroup1.selectAll(".myBar")
        .data(data)
        .join('rect')
        .attr('class', 'myBar')
        .attr("x", d => xBar(d.Conf))
        .attr("y", d => yBar(d.SRS))
        .attr("width", xBar.bandwidth())
        .attr("height", d => maxHeight - yBar(d.SRS))
        .attr("fill", "#7877E6")
        .attr('opacity', '0.4')
        .attr('stroke', 'white')
        .style('cursor', 'pointer')
        .on('mouseover', mouseOverFunction)
        .on('mouseout', mouseOutFunction)



    barGroup1.append("g")
        .attr("transform", `translate(0, ${maxHeight})`)
        .call(d3.axisBottom(xBar))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    barGroup1.append("g")
        .call(d3.axisLeft(yBar));

    //bar tooltip
    let barToolTip = barGroup1.append("text")
        .attr('x', 0)
        .attr('y', 0)
        .style('font-size', 16)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style("visibility", "hidden")
        .lower();

    // add y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -730)
        .attr("y", 30)
        .text("SRS* by conference (Better ----->)");


    function mouseOverFunction(event, d) {

        circleTooltip
            .style('visibility', 'visible')
            .text(`${d.School} (${d.Conf}): ORtg: ${d.ORtg} - DRtg: ${d.DRtg}`)
            .attr('x', x(d.ORtg))
            .attr('y', y(d.DRtg) - 10)

        // fix
        barToolTip
            .style('visibility', 'visible')
            .text(`${d.School}: SRS: ${d.SRS}`)
            .attr('x', 500)
            .attr('y', 40)
        console.log(d.Conf)
        //highlighting

        myCircles
            .style('opacity', dCircle => dCircle.Conf === d.Conf ? 1 : 0.1)
            .attr('r', dCircle => dCircle.Conf === d.Conf ? 6 : originalCircleSize)


        //moving ref lines
        xLine
            .style('visibility', 'visible')
            .transition()
            .duration(100)
            .attr('x1', x(d.ORtg))
            .attr('x2', x(d.ORtg))
            .attr('y1', y(55))
            .attr('y2', y(d.DRtg))
        yLine
            .style('visibility', 'visible')
            .transition()
            .duration(100)
            .attr('x1', x(80))
            .attr('x2', x(d.ORtg))
            .attr('y1', y(d.DRtg))
            .attr('y2', y(d.DRtg))

        d3.selectAll('.myBar')
            .style('opacity', d1 => d1.Conf === d.Conf ? 0.3 : 0.1)
            .style('opacity', d1 => d1.School === d.School ? 0.7 : 0.1)
            .style('stroke', d1 => d1.School === d.School ? 'black' : 'none')
            .style('stroke-width', d1 => d1.School === d.School ? '2' : '1')
        
            
    }


    function mouseOutFunction(event, d) {

        circleTooltip
            .style('visibility', 'hidden')

        barToolTip
            .style('visibilty', 'hidden')

        myCircles
            .style('opacity', 0.7)
            .attr('r', originalCircleSize)
        xLine.style('visibility', 'hidden')
        yLine.style('visibility', 'hidden')


        d3.selectAll('.myBar')
            .style('opacity', 0.4)
            .style('stroke', 'white')
            .style('stroke-width', 1)
            

    }




    //brush




    let circleBrush = d3.brush().extent([[0, 0], [maxWidth, maxHeight]])
        .on('start', function () {
            barGroup1.call(barBrush.move, null);
        })
        .on('brush', function (event) {
            // console.log('event::: ', event);
            // console.log('event.selection::: ', event.selection);

            let brushedArea = event.selection
            myCircles.classed('selected', d => isBrushed(brushedArea, x(d.ORtg), y(d.DRtg)))

            //  connect with bars by country
            d3.selectAll('.myBar')
                .classed('selected', d => isBrushed(brushedArea, x(d.ORtg), y(d.DRtg)))
        })


    circleGroup1.call(circleBrush) // calling a d3 brush

    myCircles.raise()

    function isBrushed(brush_coords, cx, cy) {
        if (brush_coords) {
            var x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }
    }

        // **** Your JavaScript code for practice 1 goes here ****


    // solution
    let barBrush = d3.brushX().extent([[0, 0], [barChartWidth, maxHeight]])
        .on('start', function () {
            circleGroup1.call(circleBrush.move, null);
        })
        .on('brush', function (event) {
            console.log('event::: ', event);
            let brushedArea = event.selection
            myCircles.classed('selected', d => isBrushedX(brushedArea, xBar(d.Conf)))

            //  connect with bars by country
            d3.selectAll('.myBar')
                .classed('selected', d => isBrushedX(brushedArea, xBar(d.Conf)))
        })



    barGroup1.call(barBrush)

    myBars.raise()

    function isBrushedX(brush_coords, cx) {
        if (brush_coords) {
            var x0 = brush_coords[0],
                x1 = brush_coords[1]

            return x0 <= cx && cx <= x1;
        }
    }

    


    svg.append("text")
    .attr("x", 0)
    .attr("y", 1400)
    .text("Simple Rating System: a rating that takes into account average point differential and strength of schedule. The rating is denominated in points above/below average, where zero is average. Non-Division I games are excluded from the ratings.")
})


